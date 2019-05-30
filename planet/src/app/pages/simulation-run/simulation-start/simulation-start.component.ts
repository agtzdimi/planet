import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DialogSelectFormPromptComponent } from './dialog-prompt/select-form.component';
import { NbDialogService } from '@nebular/theme';
import { EnvService } from '../../../env.service';
import { SendScenarioService } from './sendScenarioName.service';
import { NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'ngx-simulation-start',
  styleUrls: ['./simulation-start.component.scss'],
  templateUrl: './simulation-start.component.html',
})
export class SimulationStartComponent {

  CHARTS_TOTAL = 3;
  areaChart = [];
  barChart = [];
  showBar: boolean = false;
  showArea: boolean = false;
  loading = false;
  count = 0;
  results1Data: any;
  results2Data: any;
  options: any = {};
  status: String = '';
  themeSubscription: any;
  formName = 'Select Saved Simulation';
  showVal: boolean;
  expanded = false;

  constructor(private httpClient: HttpClient,
    private dialogService: NbDialogService,
    private env: EnvService,
    private sendScenarioService: SendScenarioService,
    private sidebarService: NbSidebarService) {
    this.sidebarService.onToggle()
      .subscribe((data) => {
        this.expanded = !this.expanded;
      });
    this.initializeCharts();
  }

  toggleLoadingAnimation() {
    this.loading = true;
  }

  startSimulation(): void {
    this.toggleLoadingAnimation();
    if (this.expanded === true) {
      this.sidebarService.toggle(false, 'settings-sidebar');
    }
    this.sendScenarioService.updateFormName(this.formName);
    this.showArea = false;
    this.showBar = false;
    this.showVal = false;
    this.initializeCharts();
    this.status = '';
    let url = 'http://' + this.env.planet + ':' + this.env.planetRESTPort + '/transfer';
    this.httpClient.post(url,
      {
        'formName': this.formName,
        'mode': '1',
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
      url = 'http://' + this.env.planet + ':' + this.env.planetRESTPort + '/simulation';
      this.httpClient.get(url, {
        params: {
          'formName': this.formName,
        },
      })
        .subscribe(
          data => {
            // console.log('GET Request is successful ');
            if (data['results1'] && data['results2']) {
              this.status = data['status'];
              this.results1Data = data['results1'];
              this.results2Data = data['results2'];
              clearInterval(interval);
              this.spreadValuesToCharts(this.results1Data);
              this.spreadValuesToCharts2(this.results2Data);
            } else if (data['status'] && !data['status'].includes('Simulation finished successfully')) {
              const tempStatus = data['status'].split('\n');
              this.status = tempStatus[2] + '\n' + tempStatus[3];
              if (!this.status.includes('Error')) {
                this.status = 'Error: ' + this.status;
              }
              clearInterval(interval);
              this.loading = false;
              this.showVal = true;
            }
          },
          error => {
            // console.log('Error', error);
          },
        );
      clearInterval(interval);
    }, 2000);
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
          this.areaChart[2].data.push(this.getColumnData(lines, index));
          break;
        case 'P2G_heat':
          this.areaChart[2].data.push(this.getColumnData(lines, index));
          break;
        case 'G2H_heat':
          this.areaChart[2].data.push(this.getColumnData(lines, index));
          break;
        case 'CHP_heat':
          this.areaChart[2].data.push(this.getColumnData(lines, index));
          break;
        case 'EB_output':
          this.areaChart[1].data.push(this.getColumnData(lines, index));
          break;
        case 'RES_Curtailment':
          this.areaChart[0].data.push(this.getColumnData(lines, index));
          break;
        case 'Surplus':
          this.areaChart[0].data.push(this.getColumnData(lines, index));
          break;
        case 'Electric_demand':
          this.areaChart[0].data.push(this.getColumnData(lines, index));
          this.areaChart[1].data.push(this.getColumnData(lines, index));
          break;
        case 'RES_direct_utilization':
          this.areaChart[1].data.push(this.getColumnData(lines, index));
          break;
        case 'P2H_input':
          this.areaChart[0].data.push(this.getColumnData(lines, index));
          break;
        case 'CHP_el_production':
          this.areaChart[1].data.push(this.getColumnData(lines, index));
          break;
        case 'P2G_input':
          this.areaChart[0].data.push(this.getColumnData(lines, index));
          break;
        case 'Total_heat_demand':
          this.areaChart[2].data.push(this.getColumnData(lines, index));
          break;
        case 'RES_power':
          this.areaChart[0].data.push(this.getColumnData(lines, index));
          break;
        case 'EB_input':
          this.areaChart[0].data.push(this.getColumnData(lines, index));
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
    this.showVal = true;
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
    this.dialogService.open(DialogSelectFormPromptComponent)
      .onClose.subscribe(name => {
        if (name) {
          this.formName = name['formName'];
        }
      });
  }

  initializeCharts() {
    for (let i = 0; i < this.CHARTS_TOTAL; i++) {
      this.areaChart[i] = {
        data: [],
      };
      this.barChart[i] = {
        data: [],
      };
    }
  }

}
