import React from "react";
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
import styled from "styled-components";
import Solitaire from "./solitaire";

const StyledMenu = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  h1 {
    font-size: 10vw;
    color: white;
    margin-top: 10vh;
    margin-bottom: 10vh;
  }

  a {
    text-decoration: none;
    color: black;
    background-color: white;
    font-size: 3vw;
    font-weight: bold;
    padding: 1.5vw;
    border: 0.5vw solid black;
    border-radius: 3vw;
  }
`;

const Menu = () => {
  return (
    <StyledMenu>
      <h1>Cribbage</h1>
      <Link to="/solitaire">Cribbage Solitaire</Link>
    </StyledMenu>
  );
};

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Menu} />
        <Route path="/solitaire/" component={Solitaire} />
      </Switch>
    </Router>
  );
};

export default AppRouter;
