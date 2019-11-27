import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScenarioPanelComponent } from '../../../@theme/components/planet/general-components/scenario-panel/scenario-panel.component';
import { NbDialogService } from '@nebular/theme';
import { SendScenarioService } from '../../../@theme/services/sendScenarioName.service';
import { NbSidebarService } from '@nebular/theme';
import { UserProfileService } from '../../../@theme/services';

@Component({
  selector: 'ngx-simulation-start',
  styleUrls: ['./simulation-start.component.scss'],
  templateUrl: './simulation-start.component.html',
})
export class SimulationStartComponent {

  AREAS_TOTAL = 7;
  BARS_TOTAL = 5;
  VES_CHART_TOTAL = 5;
  STADALONE_VES_CHARTS = 3;
  lengthAreas: number = 0;
  areaChart = [];
  VesChart = [];
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
  formName = 'Select Saved Scenario';
  showVal: boolean;
  expanded = false;
  yVal: number = 0;
  changingValue = 0;
  showSimBar = false;
  paramInit: Object = {
    'payload': {
      'model': '',
    },
  };
  simulationTime: any;
  tOutForecast: any;
  demandModTimeseries: any;
  isVesPresent: boolean;

  constructor(private httpClient: HttpClient,
    private dialogService: NbDialogService,
    private sendScenarioService: SendScenarioService,
    private sidebarService: NbSidebarService,
    private userProfile: UserProfileService) {
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
    this.showSimBar = true;
    this.changingValue = 0;
    this.initializeCharts();
    // get Ves parameters from parameters_initialization
    const urlVesParams = '/planet/rest/load_data';
        this.httpClient.get(urlVesParams, {
          params: {
            'formName': this.formName,
            'email': this.userProfile.getEmail(),
          },
        })
        .subscribe(
          res => {
            this.paramInit = JSON.parse(res['paramInit']);
            this.simulationTime = this.paramInit['payload']['simulation']['simulation.time'];
            this.tOutForecast = this.paramInit['payload']['electric.grid']['node.1']['VES']['inputData']['tOutForecast'];
            this.demandModTimeseries = this.paramInit['payload']['electric.grid']['node.1']['VES']['optionalInputData'];
            if (this.paramInit['payload']['electric.grid']['node.1']['VES']['name']) {
              this.isVesPresent = true;
            } else {
              this.isVesPresent = false;
            }
          },
          error => {
            this.isVesPresent = false;
          },
          );
    // end of get Ves parameters
    this.status = '';
    let url = '/planet/rest/transfer';
    this.httpClient.post(url,
      {
        'formName': this.formName,
        'mode': '1',
        'email': this.userProfile.getEmail(),
      })
      .subscribe(
        data => {
          this.changingValue = 50;
          const barData = setInterval(() => {
            url = '/planet/rest/simulation_status';
            this.httpClient.get(url, {
              params: {
                'formName': this.formName,
                'email': this.userProfile.getEmail() + '_' + data['timeStamp'],
              },
            })
              .subscribe(
                status => {
                  // console.log('GET Request is successful ');
                  if (status['value']) {
                    this.changingValue = status['value'];
                  }
                },
                error => {
                  // console.log('Error', error);
                },
              );
          }, 10000);
          const interval = setInterval(() => {
            url = '/planet/rest/simulation';
            this.httpClient.get(url, {
              params: {
                'formName': this.formName,
                'email': this.userProfile.getEmail() + '_' + data['timeStamp'],
              },
            })
              .subscribe(
                simulationData => {
                  // console.log('GET Request is successful ');
                  if (simulationData['results1'] && simulationData['results2']) {
                    this.status = simulationData['status'];
                    this.results1Data = simulationData['results1'];
                    this.results2Data = simulationData['results2'];
                    this.initializeAreaChart();
                    clearInterval(interval);
                    clearInterval(barData);
                    if (this.isVesPresent) {
                      this.spreadValuesToChartsWithVes(this.results1Data);
                    } else {
                    this.spreadValuesToCharts(this.results1Data);
                    }
                    this.spreadValuesToCharts2(this.results2Data);
                  } else if (simulationData['status'] && !simulationData['status'].includes('Simulation finished successfully')) {
                    const tempStatus = simulationData['status'].split('\n');
                    this.status = tempStatus[2] + '\n' + tempStatus[3];
                    if (!this.status.includes('Error')) {
                      this.status = 'Error: ' + this.status;
                    }
                    clearInterval(interval);
                    clearInterval(barData);
                    this.loading = false;
                    this.showVal = true;
                  }
                  this.showSimBar = false;
                },
                error => {
                  // console.log('Error', error);
                },
              );
          }, 5000);
        },
        error => {
          this.changingValue = 50;
        },
      );
  }

  spreadValuesToCharts(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    for (let index = 0; index < headers.length; index++) {
      switch (headers[index]) {
        case 'Hours':
          this.areaChart[0].data.push(this.getColumnData(lines, index));
          this.areaChart[1].data.push(this.getColumnData(lines, index));
          this.areaChart[2].data.push(this.getColumnData(lines, index));
          this.areaChart[3].data.push(this.getColumnData(lines, index));
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
          // this.areaChart[1].data.push(this.getColumnData(lines, index));
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
        case 'Electric_grid_power_flow':
          this.areaChart[3].data.push(this.getColumnData(lines, index));
          break;
        case 'RES_power':
          this.areaChart[0].data.push(this.getColumnData(lines, index));
          break;
        case 'EB_input':
          // this.areaChart[0].data.push(this.getColumnData(lines, index));
          break;
        case 'FlexibilityMin':
          break;
        case 'FlexibilityMax':
          break;
        case 'FlexibilityBaseline':
          break;
        case 'FlexibilityModif':
          break;
        case 'IndoorTemp':
          break;
        default:
          break;
      }
    }
    this.areaChart[0].title = 'Electric demand, RES producibility, dispatch of the electric surplus';
    this.areaChart[1].title = 'Fulfilment of the Electric Demand';
    this.areaChart[2].title = 'Fulfilment of the Heat Demand (both DH and LHD)';
    this.areaChart[3].title = 'Electric grid power flow';

    this.showArea = true;
    this.loading = false;
    this.showVal = true;
  }

  spreadValuesToChartsWithVes(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    for (let index = 0; index < headers.length; index++) {
      if (this.isVesPresent) {
      this.setVesCharts(index, headers);
    }
      switch (headers[index]) {
        case 'Hours':
          this.areaChart[0].data.push(this.getColumnData(lines, index));
          this.areaChart[1].data.push(this.getColumnData(lines, index));
          this.areaChart[2].data.push(this.getColumnData(lines, index));
          this.areaChart[3].data.push(this.getColumnData(lines, index));
          this.areaChart[4].data.push(this.getColumnData(lines, index));
          this.areaChart[5].data.push(this.getColumnData(lines, index));
          this.areaChart[6].data.push(this.getColumnData(lines, index));
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
          // this.areaChart[1].data.push(this.getColumnData(lines, index));
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
        case 'Electric_grid_power_flow':
          this.areaChart[3].data.push(this.getColumnData(lines, index));
          break;
        case 'RES_power':
          this.areaChart[0].data.push(this.getColumnData(lines, index));
          break;
        case 'EB_input':
          // this.areaChart[0].data.push(this.getColumnData(lines, index));
          break;
        case 'FlexibilityMin':
          this.areaChart[4].data.push(this.getColumnData(lines, index));
          break;
        case 'FlexibilityMax':
          this.areaChart[4].data.push(this.getColumnData(lines, index));
          break;
        case 'FlexibilityBaseline':
          this.areaChart[4].data.push(this.getColumnData(lines, index));
          break;
        case 'FlexibilityModif':
          this.areaChart[1].data.push(this.getColumnData(lines, index));
          this.areaChart[4].data.push(this.getColumnData(lines, index));
          break;
        case 'IndoorTemp':
          this.areaChart[5].data.push(this.getColumnData(lines, index));
          break;
        default:
          break;
      }
    }

    this.areaChart[5].data.push(this.VesChart[0].data);
    this.areaChart[6].data.push(this.VesChart[1].data);
    this.areaChart[6].data.push(this.VesChart[2].data);
    this.areaChart[6].data.push(this.VesChart[3].data);
    this.areaChart[6].data.push(this.VesChart[4].data);

    this.areaChart[0].title = 'Electric demand, RES producibility, dispatch of the electric surplus';
    this.areaChart[1].title = 'Fulfilment of the Electric Demand';
    this.areaChart[2].title = 'Fulfilment of the Heat Demand (both DH and LHD)';
    this.areaChart[3].title = 'Electric grid power flow';
    this.areaChart[4].title = 'Flexibility Values for time horizon';
    this.areaChart[5].title = 'Indoor & Outdoor Temperature evolution timeseries';
    this.areaChart[6].title = 'Modified heat Consumption';

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
        case 'CHP el production':
          this.barChart[3].data.push(keyVal);
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
          // this.barChart[2].data.push(keyVal);
          break;
        case 'RES to P2H':
          this.barChart[2].data.push(keyVal);
          break;
        case 'RES direct utilization':
          if (directUtil === 0) {
            this.barChart[2].data.push(keyVal);
            this.barChart[3].data.push(keyVal);
            directUtil += 1;
          }
          break;
        case 'Imported electricity cost':
          this.barChart[0].data.push(keyVal);
          break;
        case 'Imported electricity':
          this.barChart[3].data.push(keyVal);
          break;
        case 'RES producibility':
          // this.barChart[2].data.push(keyVal);
          break;
        case 'P2G heat':
          this.barChart[4].data.push(keyVal);
          break;
        case 'G2H heat':
          this.barChart[4].data.push(keyVal);
          break;
        case 'CHP heat':
          this.barChart[4].data.push(keyVal);
          break;
        case 'P2H heat':
          this.barChart[4].data.push(keyVal);
          break;
        default:
          break;
      }
    }
    this.barChart[0].title = 'LCOE and economic results CO' + '\u2082' + ' emissions cost';
    this.barChart[0].yAxisLabel = 'Expenses and Revenues M€';
    this.barChart[0].yRightAxisLabel = 'LCOE €/MWh';
    this.barChart[1].title = 'CO' + '\u2082' + ' emissions cost';
    this.barChart[1].yAxisLabel = 'CO' + '\u2082' + ' emissions 10' + '\u00B3' + ' t';
    this.barChart[2].title = 'RES producibility dispatch';
    this.barChart[2].yAxisLabel = 'RES producibility MWh';
    this.barChart[3].title = 'Electric Demand Fulfilment';
    this.barChart[3].yAxisLabel = 'Electric Demand MWh';
    this.barChart[4].title = 'Thermal Demand Fulfilment';
    this.barChart[4].yAxisLabel = 'Thermal Demand MWh';
    const maxYValueArr = [];
    maxYValueArr.push(this.barChart[2]);
    maxYValueArr.push(this.barChart[3]);
    maxYValueArr.push(this.barChart[4]);
    this.yVal = Math.max.apply(Math, maxYValueArr.map(function (o) {
      let max = 0;
      for (let arr = 0; arr < o['data'].length; arr++) {
        max = +o['data'][arr][1] + max;
      }
      return max;
    }));
    this.yVal = Math.ceil((this.yVal + 1) / 10) * 10;
    this.showBar = true;
  }

  getColumnData(lines, column: number) {
    let result = lines.map(val => {
      const value = val.split(',');
      return value[column];
    },
    );
    if (result[result.length - 1] === undefined) {
      result = result.slice(0, -1);
    }
    return result;
  }

  openDialogBox() {
    this.dialogService.open(ScenarioPanelComponent)
      .onClose.subscribe(name => {
        if (name['formName'] !== undefined) {
          this.formName = name['formName'];
        }
      });
  }

  setVesCharts(index, headers) {
    if (index === 0) {
      this.VesChart[0].data.push('OutDoor Temp'); // , this.tOutForecast[index / tmp]) ;
      this.VesChart[1].data.push('Alt Min');
      this.VesChart[2].data.push('Alt Max');
      this.VesChart[3].data.push('Baseline Mix');
      this.VesChart[4].data.push('Baseline Max');
    } else {
      const tmp = Math.floor((index / (headers.length / this.tOutForecast.length)));
      this.VesChart[0].data.push(this.tOutForecast[tmp].toString());
      this.VesChart[1].data.push(this.demandModTimeseries['tInAltMin'][tmp].toString());
      this.VesChart[2].data.push(this.demandModTimeseries['tInAltMax'][tmp].toString());
      this.VesChart[3].data.push(this.demandModTimeseries['tInBaseMin'][tmp].toString());
      this.VesChart[4].data.push(this.demandModTimeseries['tInBaseMax'][tmp].toString());
    }
  }

  initializeAreaChart() {
    this.areaChart = [];
    if (this.isVesPresent) {
      this.lengthAreas = this.AREAS_TOTAL;
    } else {
      this.lengthAreas = this.AREAS_TOTAL - this.STADALONE_VES_CHARTS;
    }
    for (let i = 0; i < this.lengthAreas; i++) {
      this.areaChart[i] = {
        data: [],
      };
    }
  }

  initializeCharts() {
    for (let i = 0; i < this.BARS_TOTAL; i++) {
      this.barChart[i] = {
        data: [],
      };
    }

    for (let i = 0; i < this.VES_CHART_TOTAL; i++) {
      this.VesChart[i] = {
        data: [],
      };
    }
  }

}
