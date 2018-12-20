import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "./components/SubmitFile";
import DashBoard from "./Views/DashBoard";
import SubmitFile from "./components/SubmitFile";
import Simulate from "./components/Simulate";
import { BrowserRouter, Route } from "react-router-dom";

class App extends Component {
  backgroundImgStyle =
    "body { \
       background-image: url(planet.jpg); \
       height: 100%; margin: 0; \
       background-repeat: no-repeat; \
       background-size: cover; } \
    ";

  render() {
    return (
      <BrowserRouter>
        <div>
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
                <a href="dashboard">Go to results page</a>
                <style>{this.backgroundImgStyle}</style>
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
