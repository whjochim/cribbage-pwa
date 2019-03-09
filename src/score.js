import { compareCards } from "./cards";

const scoreTarget = (target, starter, score, should_score_jack) => {
  let points = [];
  let cards = target.slice();
  if (should_score_jack) {
    points = points.concat(pointsStarter(starter));
  }
  points = points.concat(pointsKnob(cards, starter));
  points = points.concat(pointsFlush(cards, starter));
  if (starter != null) {
    cards.push(starter);
  }
  points = points.concat(points15(cards));
  points = points.concat(pointsPairs(cards));
  points = points.concat(pointsRuns(cards));
  score += points.reduce((sum, point) => sum + point.number, 0);
  return { score: score, points: points };
};

const pointsStarter = starter => {
  if (starter !== null && starter.number === 11) {
    return [{ set: [starter], number: 2 }];
  }
  return [];
};

const pointsKnob = (cards, starter) => {
  return starter === null
    ? []
    : cards
        .filter(card => card.number === 11 && card.symbol === starter.symbol)
        .map(card => ({ set: [card], number: 1 }));
};

const pointsFlush = (cards, starter) => {
  if (
    cards.reduce((prev, next) =>
      prev && prev.symbol === next.symbol ? next : false
    )
  ) {
    if (starter != null && cards[0].symbol === starter.symbol) {
      let set = cards.slice();
      set.push(starter);
      set.sort(compareCards);
      return [{ set: set, number: cards.length + 1 }];
    }
    return [{ set: cards.slice(), number: cards.length }];
  }
  return [];
};

const points15 = cards => {
  return powerSet(cards)
    .filter(
      set =>
        set.reduce(
          (sum, card) => (sum += card.number > 10 ? 10 : card.number),
          0
        ) === 15
    )
    .map(set => ({ set: set.sort(compareCards), number: 2 }));
};

const pointsPairs = cards => {
  return Object.values(
    cards.reduce((grouped, card) => {
      grouped[card.number] = (grouped[card.number] || []).concat(card);
      return grouped;
    }, {})
  )
    .filter(set => set.length > 1)
    .map(set => ({
      set: set.sort(compareCards),
      number: set.length * (set.length - 1)
    }));
};

const pointsRuns = cards => {
  let result = powerSet(cards)
    .filter(set => set.length > 2)
    .map(set =>
      set.sort((a, b) => {
        if (a.number > b.number) return 1;
        if (a.number < b.number) return -1;
        return 0;
      })
    )
    .filter(set =>
      set.reduce((prev, next) =>
        prev.number + 1 === next.number ? next : false
      )
    );
  result = result.filter(set => {
    for (let other_set of result) {
      if (
        set.length < other_set.length &&
        set.reduce((bool, card) => bool && other_set.includes(card), true)
      ) {
        return false;
      }
    }
    return true;
  });
  return result.map(set => ({ set: set, number: set.length }));
};

const powerSet = cards => {
  return cards.reduce(
    (subsets, value) => subsets.concat(subsets.map(set => [value, ...set])),
    [[]]
  );
};

export default scoreTarget;
