import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ngx-simulation-start',
  styleUrls: ['./simulation-start.component.scss'],
  templateUrl: './simulation-start.component.html',
})
export class SimulationsFilesComponent {

  areaChart1: object;
  areaChart2: object;
  areaChart3: object;
  areaChart4: object;
  simulationStarted: boolean = false;
  loading = false;

  options: any = {};
  themeSubscription: any;

  constructor(private httpClient: HttpClient) {
  }

  toggleLoadingAnimation() {
    this.loading = true;
  }

  startSimulation(): void {
    this.toggleLoadingAnimation()
    this.httpClient.post('http://localhost:8000/transfer',
      {
        'name': 'transfering',
      })
      .subscribe(
        data => {
          // console.log('POST Request is successful ', data);
        },
        error => {
          // console.log('Error', error);
        },
      );

    const interval = setInterval(() => {
      this.httpClient.get('http://localhost:8000/simulation')
        .subscribe(
          data => {
            // console.log('GET Request is successful ');
            if (typeof data === "string" && data !== "") {
              this.spreadValuesToCharts(data);
            }
          },
          error => {
            // console.log('Error', error);
          },
        );

      this.httpClient.get('http://localhost:8000/simulation2')
        .subscribe(
          data => {
            // console.log('GET Request is successful ');
            if (typeof data === "string" && data !== "") {
              clearInterval(interval);
              this.spreadValuesToCharts2(data);
            }
          },
          error => {
            // console.log('Error', error);
          },
        );
    }, 10000);

  }

  spreadValuesToCharts(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    const chart1Data = [];
    const chart2Data = [];
    const chart3Data = [];
    for (let index = 0; index < headers.length; index++) {
      switch (headers[index]) {
        case 'Time':
          chart1Data.push(this.getColumnData(lines, index));
          chart2Data.push(this.getColumnData(lines, index));
          chart3Data.push(this.getColumnData(lines, index));
          break;
        case 'P2H_heat':
          chart1Data.push(this.getColumnData(lines, index));
          break;
        case 'P2G_heat':
          chart1Data.push(this.getColumnData(lines, index));
          break;
        case 'EB_output':
          chart1Data.push(this.getColumnData(lines, index));
          break;
        case 'RES_Curtailment':
          chart1Data.push(this.getColumnData(lines, index));
          break;
        case 'Surplus':
          chart1Data.push(this.getColumnData(lines, index));
          break;
        case 'Electric_demand':
          chart1Data.push(this.getColumnData(lines, index));
          chart3Data.push(this.getColumnData(lines, index));
          break;
        case 'RES_direct_utilization':
          chart1Data.push(this.getColumnData(lines, index));
          break;
        case 'P2H_input':
          chart2Data.push(this.getColumnData(lines, index));
          break;
        case 'CHP_el_production':
          chart2Data.push(this.getColumnData(lines, index));
          chart3Data.push(this.getColumnData(lines, index));
          break;
        case 'P2G_input':
          chart2Data.push(this.getColumnData(lines, index));
          break;
        case 'G2H_heat':
          chart2Data.push(this.getColumnData(lines, index));
          break;
        case 'Total_heat_demand':
          chart2Data.push(this.getColumnData(lines, index));
          break;
        case 'RES_power':
          chart3Data.push(this.getColumnData(lines, index));
          break;
        case 'EB_input':
          chart3Data.push(this.getColumnData(lines, index));
          break;
        case '':
          chart3Data.push(this.getColumnData(lines, index));
          break;
        default:
          break;
      }
    }
    this.areaChart3 = chart3Data;
    this.areaChart2 = chart2Data;
    this.areaChart1 = chart1Data;

  }

  spreadValuesToCharts2(data) {

    const lines = data.split('\n');
    const chart4Data = [];
    for (let index = 0; index < lines.length; index++) {
      const keyVal = lines[index].split(',');
      switch (keyVal[0]) {
        case 'Total technologies annual cost':
          chart4Data.push(keyVal);
          break;
        case 'CO2 emissions cost':
          chart4Data.push(keyVal);
          break;
        case 'Revenue for heat production':
          chart4Data.push(keyVal);
          break;
        case 'NG expenditure':
          chart4Data.push(keyVal);
          break;
        case 'Revenue for SNG':
          chart4Data.push(keyVal);
          break;
        case 'LCOE':
          chart4Data.push(keyVal);
          break;
        default:
          break;
      }
    }
    this.areaChart4 = chart4Data;
    this.simulationStarted = true;
    this.loading = false;
  }

  getColumnData(lines, column: number) {
    const result = lines.map(val => {
      const value = val.split(',');
      return value[column];
    },
    );
    return result;
  }

}
