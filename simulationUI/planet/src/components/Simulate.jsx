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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Button
          className="btn btn-primary m-2"
          disabled={isLoading}
          onClick={!isLoading ? this.handleClick : null}
          style={{ width: "15%" }}
        >
          {isLoading ? "Processing..." : "Simulate"}
        </Button>
        {this.state.displayTable && <Table />}
      </div>
    );
  }
}

export default Simulate;
