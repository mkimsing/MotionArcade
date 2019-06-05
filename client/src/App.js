import React from "react";
import "./styles/App.css";
import { Route, Switch } from "react-router-dom";
import IFrameContainer from "./containers/iframeContainer";
import ThreadingTest from "./components/threadingTest";
import Header from "./components/Header";
import Home from "./components/Home";
import Footer from "./components/Footer"
function App() {
  return (
    <>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/Game1" component={IFrameContainer} />
      </Switch>
      {/* <IFrameContainer /> */}
      {/* <ThreadingTest /> */}
      <Footer />
    </>
  );
}

export default App;
