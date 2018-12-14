import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { post, get } from "axios";

class Simulate extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      isLoading: false,
      url: "http://localhost:8000/transfer",
      data: { name: "Transfering" },
      imageBase64: ""
    };
  }

  handleClick() {
    this.setState({ isLoading: true });
    post(this.state.url, this.state.data).then(response =>
      console.log("result", response)
    );

    get("http://localhost:8000/simulation").then(response =>
      this.setState({ imageBase64: "base64," + response.data })
    );

    // This probably where you would have an `ajax` call
    setTimeout(() => {
      // Completed of async action, set loading state back
      this.setState({ isLoading: false });
    }, 2000);
  }

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
        <img
          src={"data:image/jpeg;" + this.state.imageBase64}
          style={{ width: "30%", height: "30%" }}
        />
      </div>
    );
  }
}

export default Simulate;
