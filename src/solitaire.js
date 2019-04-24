import React, { useContext, useReducer, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { cardToComponent, pointToComponents, stackComponent } from "./cards";
import {
  SolitaireContext,
  solitaireReducer,
  initialSolitaireState,
  WINNING_SCORE
} from "./solitaireContext";

const StyledStack = styled.div`
  grid-column-start: left;
  grid-column-end: middle;
  grid-row-start: field;
  grid-row-end: next;
  height: 25vh;
  width: 17vh;
  display: flex;
  align-content: flex-start;
  justify-content: flex-start;

  .stackcard {
    overflow: hidden;
    width: 15vh;
    height: 25vh;
  }

  .stack_topcard {
    overflow: visible;
  }

  svg {
    height: 25vh;
    width: 15vh;
  }
`;

const Stack = props => {
  return (
    <StyledStack>
      {stackComponent(props.starter, props.stack_length, props.hidden)}
    </StyledStack>
  );
};

const StyledHand = styled.div`
  grid-column-start: left;
  grid-column-end: end;
  grid-row-start: hand;
  grid-row-end: end;
  display: flex;
  max-width: 100%;
  align-content: center;
  justify-content: center;
`;

const StyledCard = styled.div`
  overflow: ${props => (props.last ? "visible" : "hidden")};
  svg {
    height: 25vh;
    width: 15vh;
  }
`;

const Hand = props => {
  const dispatch = useContext(SolitaireContext);

  let handcards = [];
  for (let i = 0; i < props.cards.length - 1; i++) {
    handcards.push(
      <StyledCard key={props.cards[i].symbol + props.cards[i].number}>
        {cardToComponent(props.cards[i], false, () =>
          dispatch({ type: "hand", card: props.cards[i] })
        )}
      </StyledCard>
    );
  }
  if (props.cards !== null && props.cards.length > 0) {
    let lastcard = props.cards[props.cards.length - 1];
    handcards.push(
      <StyledCard last key={lastcard.symbol + lastcard.number}>
        {cardToComponent(lastcard, false, () =>
          dispatch({ type: "hand", card: lastcard })
        )}
      </StyledCard>
    );
  }
  return <StyledHand>{handcards}</StyledHand>;
};

const StyledCrib = styled.div`
  grid-column-start: left;
  grid-column-end: end;
  grid-row-start: crib;
  grid-row-end: hand;
  display: flex;
  align-content: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const Crib = props => {
  let cribcards = [];
  for (let i = 0; i < props.cards.length - 1; i++) {
    cribcards.push(
      <StyledCard key={props.cards[i].symbol + props.cards[i].number}>
        {cardToComponent(props.cards[i], props.hidden, () => {})}
      </StyledCard>
    );
  }
  if (props.cards !== null && props.cards.length > 0) {
    let lastcard = props.cards[props.cards.length - 1];
    cribcards.push(
      <StyledCard last key={lastcard.symbol + lastcard.number}>
        {cardToComponent(lastcard, props.hidden, () => {})}
      </StyledCard>
    );
  }
  return <StyledCrib>{cribcards}</StyledCrib>;
};

const StyledScoreBoard = styled.div`
  grid-column-start: left;
  grid-column-end: middle;
  grid-row-start: topbar;
  grid-row-end: field;
  padding-left: 0.5vh;
  padding-right: 0.5vh;
  width: fit-content;
  font-size: 2vh;
  font-weight: bold;
  text-align: center;
  margin: 0.25vh;
  background: white;
  display: inline-block;
  border: 0.25vh solid #e40000;
  border-radius: 1vh;
`;

const ScoreBoard = props => {
  return (
    <StyledScoreBoard>
      {props.score + "/" + props.winning_score}
    </StyledScoreBoard>
  );
};

const StyledScoreTable = styled.div`
  grid-column-start: left;
  grid-column-end: end;
  grid-row-start: field;
  grid-row-end: next;

  margin-left: 20vh;
  margin-top: 2vh;

  font-size: 2vh;
  color: white;
  text-shadow: 0.2vh 0.2vh black;

  table {
    display: flex;
    border-collapse: collapse;
    display: inline-block;
    border-radius: 1vh;
    border: 0.5vh solid white;
    border-spacing: 0px;
    background: white;
  }

  th {
    border: 0.25vh solid white;
    padding: 0.2vh;
    background: #006500;
  }

  float: left;
  .points {
    height: 6vh;
  }

  .cards {
    margin: auto;
  }

  .number {
    margin-left: 1vh;
  }

  svg {
    height: 6vh;
  }
`;

const ScoreTable = props => {
  return (
    <StyledScoreTable>
      {props.state === "Points hand" || props.state === "Points crib" ? (
        <table>
          <tbody>
            {props.points.map(point => (
              <tr
                class="points"
                key={
                  point.set.map(card => card.symbol + card.number).join() +
                  point.number
                }
              >
                <th class="cards">{pointToComponents(point.set)}</th>
                <th class="type">{point.type}</th>
                <th class="number">{point.number}</th>
              </tr>
            ))}
            <tr>
              <th>Total</th>
              {props.points !== null && props.points.length > 0 ? <th /> : null}
              <th>
                {props.points.reduce((sum, point) => (sum += point.number), 0)}
              </th>
            </tr>
          </tbody>
        </table>
      ) : null}
    </StyledScoreTable>
  );
};

const StyledMessage = styled.div`
  grid-column-start: middle;
  grid-column-end: right;
  grid-row-start: topbar;
  grid-row-end: field;
  text-align: center;
  width: fit-content;
  padding-left: 0.5vh;
  padding-right: 0.5vh;
  font-size: 2vh;
  font-weight: bold;
  display: inline-block;
  background-color: white;
  border: 0.25vh solid black;
  border-radius: 1vh;
  margin: 0.25vh;
  justify-self: center;
`;

const Message = props => {
  return <StyledMessage>{props.message}</StyledMessage>;
};

const StyledNextButton = styled.div`
  grid-column-start: middle;
  grid-column-end: right;
  grid-row-start: next;
  grid-row-end: crib;
  text-align: center;
  font-size: 1vh;

  button {
    height: 2.8vh;
    width: 20vh;
    font-size: 2vh;
    font-weight: bold;
    background-color: white;
    border: 0.25vh solid black;
    border-radius: 1vh;
  }
`;

const NextButton = props => {
  const dispatch = useContext(SolitaireContext);
  const messages = ["Points hand", "Points crib", "You won!", "You lost."];
  return (
    <StyledNextButton>
      {messages.includes(props.state) ? (
        <button onClick={() => dispatch({ type: "button" })}>Next</button>
      ) : null}
    </StyledNextButton>
  );
};

const StyledBackButton = styled.div`
  grid-column-start: right;
  grid-column-end: end;
  grid-row-start: topbar;
  grid-row-end: field;
  width: fit-content;
  padding-left: 0.5vh;
  padding-right: 0.5vh;
  justify-self: end;
  text-align: center;
  font-size: 2vh;
  font-weight: bold;
  background: white;
  border: 0.25vh solid black;
  border-radius: 1vh;
  vertical-align: middle;
  margin: 0.25vh;
  :hover {
    font-size: 2.25vh;
    height: 2.25vh;
  }
  a {
    text-decoration: none;
    color: black;
  }
`;

const BackButton = () => {
  return (
    <StyledBackButton>
      <Link to="/">Back</Link>
    </StyledBackButton>
  );
};

const StyledSolitaire = styled.div`
  display: grid;
  height: 98vh;
  width: 98wh;
  grid-template-columns: [left] 20% [middle] 60% [right] 20%[end];
  grid-template-rows:
    [topbar]3vh [field]auto [next] 3vh
    [crib]25vh [hand]25vh [end];
`;

const Solitaire = props => {
  const [state, dispatch] = useReducer(solitaireReducer, initialSolitaireState);

  useEffect(() => {
    dispatch({ type: "FirstDeal" });

    const keyHandler = function(event) {
      dispatch({ type: "key", key: event.key });
    };

    window.addEventListener("keypress", keyHandler);

    return () => {
      window.removeEventListener("keypress", keyHandler);
    };
  }, []);

  return (
    <StyledSolitaire>
      <SolitaireContext.Provider value={dispatch}>
        <ScoreBoard score={state.score} winning_score={WINNING_SCORE} />
        <Message message={state.message} />
        <BackButton />
        {<ScoreTable points={state.points} state={state.message} />}
        <NextButton state={state.message} />
        <Stack
          starter={state.starter}
          hidden={state.starter_hidden}
          stack_length={state.stack.length}
        />
        <Crib cards={state.crib} hidden={state.crib_hidden} />
        <Hand cards={state.hand} />
      </SolitaireContext.Provider>
    </StyledSolitaire>
  );
};

export default Solitaire;
