import React from "react";
import { SVGBoilerPlate, CardContent } from "./SVG";

const Card = props => {
  return (
    <SVGBoilerPlate onClick={props.onClick}>
      {props.symbol === "b" ? null : (
        <g>
          <g>
            <CardContent symbol={props.symbol} number={props.number} />
          </g>
          <g transform="rotate(180 150 250)">
            <CardContent symbol={props.symbol} number={props.number} />
          </g>
        </g>
      )}
    </SVGBoilerPlate>
  );
};

const MiniCard = props => {
  return (
    <SVGBoilerPlate onClick={props.onClick}>
      {<use xlinkHref={"#" + props.symbol} y="80" />}
      {
        <use
          xlinkHref={"#" + props.number}
          stroke={"black"}
          width="150"
          height="150"
          x="10"
          y="20"
        />
      }
    </SVGBoilerPlate>
  );
};

const deck = () => {
  let d = [];
  let symbols = ["c", "d", "h", "s"];
  for (let i = 1; i <= 13; i++) {
    for (let s of symbols) {
      d.push({ symbol: s, number: i });
    }
  }
  return d;
};

const compareCards = (a, b) => {
  if (a.number > b.number) return 1;
  if (a.number < b.number) return -1;
  if (a.symbol > b.symbol) return 1;
  if (a.symbol < b.symbol) return -1;
  return 0;
};

const cardToComponent = (card, hidden, clickConst) => {
  return hidden ? (
    <Card
      key={card.symbol + card.number}
      symbol={"b"}
      number={"b"}
      onClick={clickConst}
    />
  ) : (
    <Card
      key={card.symbol + card.number}
      symbol={card.symbol}
      number={card.number}
      onClick={clickConst}
    />
  );
};

const pointToComponents = set => {
  let key_set = set
    .slice()
    .map(card => card.symbol + card.number)
    .join("");
  return set.map(card => (
    <MiniCard
      key={key_set + card.symbol + card.number}
      symbol={card.symbol}
      number={card.number}
    />
  ));
};

const getRandomIndex = size => {
  return Math.floor(Math.random() * size);
};

const moveCard = (source, target, index) => {
  target.push(source[index]);
  source.splice(index, 1);
};

const moveRandomCard = (source, target) => {
  moveCard(source, target, getRandomIndex(source.length));
};

const stackComponent = (starter, stack_length, hidden) => {
  return stack_length > 0 ? (
    <React.Fragment>
      <div className="stackcard">
        <SVGBoilerPlate onClick={() => {}} />
      </div>
      <div className="stackcard">
        <SVGBoilerPlate onClick={() => {}} />
      </div>
      <div className="stackcard">
        <SVGBoilerPlate onClick={() => {}} />
      </div>
      <div className="stack_topcard">
        <SVGBoilerPlate onClick={() => {}}>
          {starter == null ? null : hidden ? (
            <text x="150" y="250" textAnchor="middle" fontSize={64}>
              {stack_length + 1 + " cards"}
            </text>
          ) : (
            <g>
              <g>
                <CardContent symbol={starter.symbol} number={starter.number} />
              </g>
              <g transform="rotate(180 150 250)">
                <CardContent symbol={starter.symbol} number={starter.number} />
              </g>
            </g>
          )}
        </SVGBoilerPlate>
      </div>
    </React.Fragment>
  ) : null;
};

export {
  Card,
  deck,
  compareCards,
  cardToComponent,
  moveCard,
  moveRandomCard,
  pointToComponents,
  stackComponent
};
