import React from "react";
import { deck, moveCard } from "./cards";
import deal from "./deal";
import scoreTarget from "./score";

const initialSolitaireState = {
  stack: [],
  starter: null,
  starter_hidden: true,
  hand: [],
  crib: [],
  crib_hidden: true,
  score: 0,
  points: [],
  message: ""
};
const SolitaireContext = React.createContext();

const WINNING_SCORE = 81;

const solitaireReducer = (state, action) => {
  switch (action.type) {
    case "key":
      return key(state, action);
    case "FirstDeal":
      return firstDeal(state);
    case "hand":
      return hand(state, action);
    case "button":
      return button(state, action);
    default:
      throw new Error("Uknown action at dispatch const");
  }
};

const handToCrib = (hand, crib, card) => {
  let index = hand.findIndex(c => c === card);
  moveCard(hand, crib, index);
  return { hand: hand, crib: crib };
};

const key = (state, action) => {
  if (action.key === "Enter") {
    action.type = "button";
    return button(state, action);
  } else {
    let key = parseInt(action.key, 10) - 1;
    if (key >= 0 && key < state.hand.length) {
      action.type = "hand";
      action.card = state.hand[key];
      return hand(state, action);
    }
    return state;
  }
};

const firstDeal = state => {
  return {
    ...initialSolitaireState,
    ...deal(deck(), initialSolitaireState.starter),
    message: "Select 2 Cards for the Crib"
  };
};

const hand = (state, action) => {
  if (state.message === "Select 2 Cards for the Crib") {
    return {
      ...state,
      ...handToCrib(state.hand, state.crib, action.card),
      message: "Select 1 Card for the Crib"
    };
  }
  if (state.message === "Select 1 Card for the Crib") {
    state = {
      ...state,
      ...handToCrib(state.hand, state.crib, action.card),
      starter_hidden: false
    };
    return {
      ...state,
      ...scoreTarget(state.hand, state.starter, state.score, true),
      message: "Points Hand"
    };
  }
  return state;
};
const button = (state, action) => {
  if (state.message === "You won!" || state.message === "You lost.") {
    return {
      ...initialSolitaireState,
      ...deal(deck(), initialSolitaireState.starter),
      message: "Select 2 Cards for the Crib"
    };
  }
  if (state.score >= WINNING_SCORE) {
    return { ...state, message: "You won!" };
  }
  if (state.message === "Points Hand") {
    if (state.stack.length === 0) {
      return { ...state, message: "You lost." };
    }
    return {
      ...state,
      ...scoreTarget(state.crib, state.starter, state.score, false),
      crib_hidden: false,
      message: "Points Crib"
    };
  }
  if (state.message === "Points Crib") {
    let newState = {
      ...state,
      ...deal(state.stack, state.starter, state.score)
    };
    if (newState.stack.length === 0) {
      return {
        ...newState,
        ...scoreTarget(newState.hand, newState.starter, newState.score, false),
        message: "Points Hand"
      };
    }
    return { ...newState, message: "Select 2 Cards for the Crib" };
  }
  return state;
};
export {
  SolitaireContext,
  solitaireReducer,
  initialSolitaireState,
  WINNING_SCORE
};
