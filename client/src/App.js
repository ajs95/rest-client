import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import Rest from "./containers/Rest";
class App extends Component {
  render() {
    return (
      <div className="container-fluid">
        <Switch>
          <Route path="/" component={Rest} />
        </Switch>
      </div>
    );
  }
}

export default App;
