import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'ngx-simulation-start',
  styleUrls: ['./simulation-start.component.scss'],
  templateUrl: './simulation-start.component.html',
})
export class SimulationsFilesComponent {

  areaChart1: object

  options: any = {};
  themeSubscription: any;

  constructor(private httpClient: HttpClient) {
  }

  startSimulation(): void {
    this.httpClient.post("http://localhost:8000/transfer",
      {
        "name": "transfering"
      })
      .subscribe(
        data => {
          console.log("POST Request is successful ", data);
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  simulateChart(): void {
    this.httpClient.get("http://localhost:8000/simulation")
      .subscribe(
        data => {
          console.log("GET Request is successful ");
          this.spreadValuesToCharts(data)
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  spreadValuesToCharts(data) {
    let lines = data.split("\n")
    const headers = lines[0].split(",");
    let chart1Data = [];
    for (let index = 0; index < headers.length; index++) {
      switch (headers[index]) {
        case 'Time':
          chart1Data.push(this.getColumnData(lines, index))
          break;
        case 'P2H_heat':
          chart1Data.push(this.getColumnData(lines, index))
          break;
        case 'P2G_heat':
          chart1Data.push(this.getColumnData(lines, index))
          break;
        case 'EB_output':
          chart1Data.push(this.getColumnData(lines, index))
          break;
        case 'RES_Curtailment':
          chart1Data.push(this.getColumnData(lines, index))
          break;
        case 'Surplus':
          chart1Data.push(this.getColumnData(lines, index))
          break;
        case 'Electric_demand':
          chart1Data.push(this.getColumnData(lines, index))
          break;
        case 'RES_direct_utilization':
          chart1Data.push(this.getColumnData(lines, index))
          break;
        default:
          break;
      }
    }
    this.areaChart1 = chart1Data;

  }

  getColumnData(lines, column: number) {
    const result = lines.map(val => {
      const value = val.split(",");
      return value[column];
    }
    )
    return result
  }

}
