import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "./components/SubmitFile";
import SubmitFile from "./components/SubmitFile";
import Simulate from "./components/Simulate";

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
      <div>
        <SubmitFile
          message="Upload Components and Simulation Parameter File"
          id="file1"
        />
        <SubmitFile message="Upload Energy Load File" id="file2" />
        <SubmitFile message="Upload Simulink File" id="file3" />
        <Simulate />
        <style>{this.backgroundImgStyle}</style>
      </div>
    );
  }
}

export default App;
