import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "./components/SubmitFile";
import SubmitFile from "./components/SubmitFile";
import Simulate from "./components/Simulate";
import { BrowserRouter, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <ul className="header">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="dashboard">Simulation Results</a>
            </li>
          </ul>
          <Route
            exact={true}
            path="/"
            render={() => (
              <div className="App">
                <SubmitFile
                  message="Upload Components and Simulation Parameter File"
                  id="file1"
                />
                <SubmitFile message="Upload Energy Load File" id="file2" />
                <SubmitFile message="Upload Simulink File" id="file3" />
              </div>
            )}
          />
          <Route
            exact={true}
            path="/dashboard"
            render={() => (
              <div className="App">
                <Simulate />
              </div>
            )}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
