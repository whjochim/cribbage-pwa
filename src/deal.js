import { compareCards, moveRandomCard } from "./cards";

const deal = (stack, starter) => {
  if (starter != null) {
    stack.push(starter);
  }
  let hand;
  if (stack.length === 4) {
    [stack, hand] = dealTarget(stack, 4, hand);
    return { hand: hand, crib: [], stack: [], starter: null, points: [] };
  }
  [stack, hand] = dealTarget(stack, 6, hand);
  let crib;
  [stack, crib] = dealTarget(stack, 2, crib);
  let newStarter = [];
  moveRandomCard(stack, newStarter);
  newStarter = newStarter[0];
  return {
    hand: hand,
    stack: stack,
    crib: crib,
    crib_hidden: true,
    starter: newStarter,
    starter_hidden: true,
    points: []
  };
};

const dealTarget = (stack, amount, target) => {
  target = [];
  for (let i = 0; i < amount; i++) {
    moveRandomCard(stack, target);
  }
  target.sort(compareCards);
  return [stack, target];
};

export default deal;
