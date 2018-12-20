import React, { Component } from "react";
import { get } from "axios";
import { Button } from "react-bootstrap";

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      data: []
    };
  }

  getData() {
    console.log("HERE");
    get("http://localhost:8000/simulation").then(response =>
      this.setState({ data: response.data })
    );

    console.log(this.state.data);
  }

  render() {
    if (!this.state.data.length) return null;

    return (
      <div>
        <Button className="btn btn-primary m-2" bsStyle="primary">
          PAOK
        </Button>
      </div>
    );
  }
}

export default Dashboard;
