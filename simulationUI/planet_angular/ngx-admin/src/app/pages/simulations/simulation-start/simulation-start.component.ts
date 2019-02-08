import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DialogSelectFormPromptComponent } from './dialog-prompt/select-form.component';
import { DialogSelectMultipleFormPromptComponent } from './dialog-prompt/select-multiple-form.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-simulation-start',
  styleUrls: ['./simulation-start.component.scss'],
  templateUrl: './simulation-start.component.html',
})
export class SimulationsFilesComponent {

  CHARTS_TOTAL = 3;
  areaChart = [];
  barChart = [];
  lineChart = [];
  showBar: boolean = false;
  showArea: boolean = false;
  showLine: boolean = false;
  loading = false;
  count = 0;

  options: any = {};
  themeSubscription: any;
  selectedItem = '';
  selectedForms = 'Select Saved Simulations';
  formName = 'Select Saved Simulation';
  finalFormName = '';

  constructor(private httpClient: HttpClient, private dialogService: NbDialogService) {
    for (let i = 0; i < this.CHARTS_TOTAL; i++) {
      this.areaChart[i] = {
        data: [],
      };
      this.barChart[i] = {
        data: [],
      };
    }
    this.lineChart[0] = {
      data: [],
    };
  }

  toggleLoadingAnimation() {
    this.loading = true;
  }

  startSimulation(): void {
    if (this.selectedItem === 'single') {
      this.finalFormName = this.formName;
    } else {
      this.finalFormName = this.selectedForms;
    }
    this.toggleLoadingAnimation();
    this.httpClient.post('http://80.106.151.108:8000/transfer',
      {
        'formName': this.finalFormName,
      })
      .subscribe(
        data => {
          // console.log('POST Request is successful ', data);
        },
        error => {
          // console.log('Error', error);
        },
      );

    if (this.selectedItem === 'single') {
      const interval = setInterval(() => {
        this.httpClient.get('http://80.106.151.108:8000/simulation')
          .subscribe(
            data => {
              // console.log('GET Request is successful ');
              if (typeof data === 'string' && data !== '') {
                this.spreadValuesToCharts(data);
              }
            },
            error => {
              // console.log('Error', error);
            },
          );

        this.httpClient.get('http://80.106.151.108:8000/simulation2')
          .subscribe(
            data => {
              // console.log('GET Request is successful ');
              if (typeof data === 'string' && data !== '') {
                clearInterval(interval);
                this.spreadValuesToCharts2(data);
              }
            },
            error => {
              // console.log('Error', error);
            },
          );
      }, 10000);
    } else {
      const interval = setInterval(() => {
        this.httpClient.get('http://80.106.151.108:8000/multi_simulation')
          .subscribe(
            data => {
              // console.log('GET Request is successful ');
              if (typeof data === 'string' && data !== '' && this.count !== 1) {
                this.getCurtailment(data);
              }
            },
            error => {
              // console.log('Error', error);
            },
          );

        this.httpClient.get('http://80.106.151.108:8000/multi_simulation2')
          .subscribe(
            data => {
              // console.log('GET Request is successful ');
              if (typeof data === 'string' && data !== '') {
                clearInterval(interval);
                this.getCurtailment(data);
              }
            },
            error => {
              // console.log('Error', error);
            },
          );
      }, 10000);
    }
  }

  getCurtailment(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    for (let index = 0; index < headers.length; index++) {
      switch (headers[index]) {
        case 'Time':
          this.lineChart[0].data.push(this.getColumnData(lines, index));
          break;
        case 'RES_Curtailment':
          this.count++;
          this.lineChart[0].data.push(this.getColumnData(lines, index));
          if (this.count === 2) {
            this.lineChart[0].data[this.lineChart[0].data.length - 1][0] = 'RES_Curtailment2';
          } else {
            this.lineChart[0].data[this.lineChart[0].data.length - 1][0] = 'RES_Curtailment1';
          }
          break;
      }
    }
    if (this.count === 2) {
      this.lineChart[0].title = 'RES Curtailment Difference';
      this.showLine = true;
      this.loading = false;
      this.count = 0;
    }

  }

  spreadValuesToCharts(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    for (let index = 0; index < headers.length; index++) {
      switch (headers[index]) {
        case 'Time':
          this.areaChart[0].data.push(this.getColumnData(lines, index));
          this.areaChart[1].data.push(this.getColumnData(lines, index));
          this.areaChart[2].data.push(this.getColumnData(lines, index));
          break;
        case 'P2H_heat':
          this.areaChart[0].data.push(this.getColumnData(lines, index));
          break;
        case 'P2G_heat':
          this.areaChart[0].data.push(this.getColumnData(lines, index));
          break;
        case 'EB_output':
          this.areaChart[0].data.push(this.getColumnData(lines, index));
          break;
        case 'RES_Curtailment':
          this.areaChart[0].data.push(this.getColumnData(lines, index));
          break;
        case 'Surplus':
          this.areaChart[0].data.push(this.getColumnData(lines, index));
          break;
        case 'Electric_demand':
          this.areaChart[0].data.push(this.getColumnData(lines, index));
          this.areaChart[2].data.push(this.getColumnData(lines, index));
          break;
        case 'RES_direct_utilization':
          this.areaChart[0].data.push(this.getColumnData(lines, index));
          break;
        case 'P2H_input':
          this.areaChart[1].data.push(this.getColumnData(lines, index));
          break;
        case 'CHP_el_production':
          this.areaChart[1].data.push(this.getColumnData(lines, index));
          this.areaChart[2].data.push(this.getColumnData(lines, index));
          break;
        case 'P2G_input':
          this.areaChart[1].data.push(this.getColumnData(lines, index));
          break;
        case 'G2H_heat':
          this.areaChart[1].data.push(this.getColumnData(lines, index));
          break;
        case 'Total_heat_demand':
          this.areaChart[1].data.push(this.getColumnData(lines, index));
          break;
        case 'RES_power':
          this.areaChart[2].data.push(this.getColumnData(lines, index));
          break;
        case 'EB_input':
          this.areaChart[2].data.push(this.getColumnData(lines, index));
          break;
        case '':
          this.areaChart[2].data.push(this.getColumnData(lines, index));
          break;
        default:
          break;
      }
    }
    this.areaChart[0].title = 'Electric demand, RES producibility, dispatch of the electric surplus';
    this.areaChart[1].title = 'Fulfilment of the Electric Demand';
    this.areaChart[2].title = 'Fulfilment of the Heat Demand (both DH and LHD)';
    this.showArea = true;
    this.loading = false;
  }

  spreadValuesToCharts2(data) {

    const lines = data.split('\n');
    let directUtil = 0;
    for (let index = 0; index < lines.length; index++) {
      const keyVal = lines[index].split(',');
      switch (keyVal[0]) {
        case 'Total technologies annual cost':
          this.barChart[0].data.push(keyVal);
          break;
        case 'CO2 emissions cost':
          this.barChart[0].data.push(keyVal);
          break;
        case 'Revenue for heat production':
          this.barChart[0].data.push(keyVal);
          break;
        case 'NG expenditure':
          this.barChart[0].data.push(keyVal);
          break;
        case 'Revenue for SNG':
          this.barChart[0].data.push(keyVal);
          break;
        case 'LCOE':
          this.barChart[0].data.push(keyVal);
          break;
        case 'G2H CO2 emissions':
          this.barChart[1].data.push(keyVal);
          break;
        case 'P2G CO2 savings':
          this.barChart[1].data.push(keyVal);
          break;
        case 'CHP CO2 emissions':
          this.barChart[1].data.push(keyVal);
          break;
        case 'Total CO2 emissions':
          this.barChart[1].data.push(keyVal);
          break;
        case 'RES curtailment':
          this.barChart[2].data.push(keyVal);
          break;
        case 'RES to P2G':
          this.barChart[2].data.push(keyVal);
          break;
        case 'RES to EB':
          this.barChart[2].data.push(keyVal);
          break;
        case 'RES to P2H':
          this.barChart[2].data.push(keyVal);
          break;
        case 'RES direct utilization':
          if (directUtil === 0) {
            this.barChart[2].data.push(keyVal);
            directUtil += 1;
          }
          break;
        case 'RES producibility':
          this.barChart[2].data.push(keyVal);
          break;
        default:
          break;
      }
    }
    this.barChart[0].title = 'LCOE and economic resultsYearly CO2 emissions ';
    this.barChart[0].yAxisLabel = 'Expenses and Revenues M€/y';
    this.barChart[0].yRightAxisLabel = 'LCOE €/MWh';
    this.barChart[1].title = 'Yearly CO' + '\u2082' + ' emissions';
    this.barChart[1].yAxisLabel = 'CO' + '\u2082' + ' emissions 10' + '\u00B3' + ' t/y';
    this.barChart[2].title = 'Yearly RES producibility dispatch';
    this.barChart[2].yAxisLabel = 'RES producibility GWh/y';
    this.showBar = true;
  }

  getColumnData(lines, column: number) {
    const result = lines.map(val => {
      const value = val.split(',');
      return value[column];
    },
    );
    return result;
  }

  openDialogBox() {
    if (this.selectedItem === 'single') {
      this.dialogService.open(DialogSelectFormPromptComponent)
        .onClose.subscribe(name => {
          if (name) {
            this.formName = name;
          }
        });
    } else {
      this.dialogService.open(DialogSelectMultipleFormPromptComponent)
        .onClose.subscribe(name => {
          if (name) {
            this.selectedForms = name;
          }
        });
    }

  }

}
