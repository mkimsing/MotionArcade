import React from "react";
import "./styles/App.css";
import { Route, Switch } from "react-router-dom";
import ThreadingTest from "./components/threadingTest";
import Header from "./components/Header";
import Home from "./components/Home";
import GamePage from "./components/GamePage";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <Header />
      <Switch>
        <ScrollToTop>
          <Route path="/" exact component={Home} />
          <Route path="/Game1" component={GamePage} />
        </ScrollToTop>
      </Switch>
      {/* <ThreadingTest /> */}
      <Footer />
    </>
  );
}

export default App;
