import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { post } from "axios";
import Table from "./Table";

class Simulate extends Component {
  state = {
    csvData: "",
    isLoading: false,
    displayTable: false,
    url: "http://localhost:8000/transfer",
    data: { name: "Transfering" }
  };

  async sendData() {
    try {
      await post(this.state.url, this.state.data).then(response => {
        console.log(response);
      });
    } catch (error) {
      console.log(error);
    }
  }

  handleClick = () => {
    this.setState({ isLoading: true });

    this.sendData();

    setTimeout(() => {
      // Completed of async action, set loading state back
      this.setState({ isLoading: false, displayTable: true });
    }, 2000);
  };

  render() {
    const { isLoading } = this.state;

    return (
      <div>
        <h3>Simulate Results</h3>
        <Button
          className="m-2"
          bsStyle="primary"
          disabled={isLoading}
          onClick={!isLoading ? this.handleClick : null}
        >
          {isLoading ? "Processing..." : "Simulate"}
        </Button>
        {this.state.displayTable && <Table />}
      </div>
    );
  }
}

export default Simulate;
