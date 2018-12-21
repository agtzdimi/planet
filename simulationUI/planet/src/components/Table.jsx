import React, { Component } from "react";
import { post, get } from "axios";
import { CsvToHtmlTable } from "react-csv-to-table";

class Table extends Component {
  state = { csvData: "", isLoading: false, error: null };

  componentDidMount() {
    this.interval = setInterval(() => this.getData(), 6000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async getData() {
    if (this.state.csvData === "") {
      try {
        const result = await get("http://localhost:8000/simulation");
        this.setState({ csvData: result.data, isLoading: false });
      } catch (error) {
        this.setState({
          error,
          isLoading: false
        });
      }
    }
  }

  render() {
    return (
      <CsvToHtmlTable
        data={this.state.csvData}
        csvDelimiter=","
        tableClassName="table table-striped table-hover"
      />
    );
  }
}

export default Table;
