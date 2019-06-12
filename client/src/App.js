import React from "react";
import "./styles/App.css";
import { Route, Switch } from "react-router-dom";
import ThreadingTest from "./components/threadingTest";
import Header from "./components/Header";
import Home from "./components/Home";
import GamePage_ER from "./components/GamePage_ER";
import GamePage_SS from "./components/GamePage_SS";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <Header />
      <Switch>
        <ScrollToTop>
          <Route path="/" exact component={Home} />
          <Route path="/endlessRunner" component={GamePage_ER} />
          <Route path="/spaceShooter" component={GamePage_SS} />
        </ScrollToTop>
      </Switch>
      {/* <ThreadingTest /> */}
      <Footer />
    </>
  );
}

export default App;
