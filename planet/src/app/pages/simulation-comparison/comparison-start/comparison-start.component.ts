import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NbDialogService, NbDialogConfig } from '@nebular/theme';

import { UserProfileService } from '../../../@theme/services';
import { ScenarioPanelComponent } from '../../../@theme/components';

/**
 * ComparisonStartComponent is used to select multiple already simulated scenarios
 */
@Component({
  selector: 'ngx-comparison-start',
  styleUrls: ['./comparison-start.component.scss'],
  templateUrl: './comparison-start.component.html',
})
/**
 * @param {Array<Object>} lineChart Array holding the simulation results for line charts per scenario.
 * @param {boolean} showLine Boolean variable indicating to show or now the line charts
 * @param {boolean} loading Boolean variable indicating to show or now the spinner at loading of the scenarios
 * @param {number} count Variable counting the number of retrieved scenarios' data
 * @param {number} selectedScenariosCount Variable holding the number of the selected scenarios
 * @param {string[]} forms Array holding the names of the scenarios
 * @param {Array<Object>} timers Array holding the x-axis (time) for each scenario
 * @param {Array<Object>} barChart Array holding the simulation results for bar charts per scenario.
 * @param {number} yVal The y-value that will be defined in Bar charts, to be easier to read
 * @param {boolean} showBar Boolean variable indicating to show or now the bar charts
 * @param {string} status Variable holding the string message from the API after simulation ended
 * @param {string} textMessage Variable holding a string message displayed to the user for some guidance
 * @param {number} BARS_TOTAL Constant holding the number of total bar charts
 * @param {string} selectedForms Variable holding the string representation of the selected scenarios
 * @param {string} buttonText Variable holding the button text to select a scenario
 *
 */
export class ComparisonStartComponent {

  public lineChart: Array<Object> = [];
  public showLine: boolean = false;
  public loading: boolean = false;
  private count: number = 0;
  private selectedScenariosCount: number = 0;
  private forms: string[] = [];
  private timers: Array<Object> = [];
  public barChart: Array<Object> = [];
  private yVal: number;
  public showBar: boolean = false;
  public status: string = '';
  public textMessage: string = '';
  private BARS_TOTAL: number = 5;
  public selectedForms: string = 'Select Saved Scenarios';
  public buttonText: string = 'Select Saved Scenarios';

  /**
 * @param {HttpClient} httpClient Angular service to make REST requests
 * @param {NbDialogService} dialogService Nebular service to open a new dialog screen over the current one
 * @param {UserProfileService} userProfile Custom service to get User's information like the email
 *
 */
  constructor(private httpClient: HttpClient,
    private dialogService: NbDialogService,
    private userProfile: UserProfileService) {
    this.initializeCharts();
  }

  /**
  * Function responsible toggling the loading spinner
  * @example
  * toggleLoadingAnimation()
  *
  */
  public toggleLoadingAnimation(): void {
    this.loading = true;
  }

  /**
* Function responsible to start collecting the results of the selected scenarios through the REST API
* @example
* toggleLoadingAnimation()
*
*/
  public startComparison(): void {
    this.toggleLoadingAnimation();
    this.initializeCharts();
    this.forms = this.selectedForms.split('  -  ');
    this.selectedScenariosCount = this.forms.length;
    const params = {};
    for (let i = 0; i < this.forms.length; i++) {
      const tempString = 'formName' + (i + 1);
      params[tempString] = this.forms[i];
    }
    params['email'] = this.userProfile.getEmail();
    const url = '/planet/rest/multi_simulation';

    const interval = setInterval(() => {
      this.httpClient.get(url, {
        params: params,
      })
        .subscribe(
          data => {
            // console.log('GET Request is successful ');
            if (data) {
              for (let i = 0; i < Object.keys(data).length; i++) {
                const resultString = 'results' + (i + 1);
                this.getCurtailment(data[resultString]['results1'], i + 1);
                this.getBarCharts(data[resultString]['results2']);
              }
              clearInterval(interval);
            }
          },
          error => {
            // console.log('Error', error);
          },
        );
    }, 10000);
  }

  /**
  * Function responsible to isolate the variables corresponding to electric grid power flow
  * and push them to the lineChart variable to be simulated as a timeseries line
  * @example
  * getCurtailment(data, id)
  *
  * data = `Time,Electric_demand,WT_power,PV_power,RES_power,
  * Surplus,EB_input,P2G_input,P2H_input,RES_Curtailment,RES_direct_utilization,
  * EB_output,CHP_el_production,DH_demand,LHD_demand,Total_heat_demand,P2H_heat,CHP_heat,P2G_heat,
  * G2H_heat,Electric_grid_power_flow,formName,Hours,FlexibilityBaseline,
  * FlexibilityMin,FlexibilityMax,FlexibilityModif,IndoorTemp`
  * id = 1
  *
  * @param {string} data contains a CSV file as string
  * @param {number} id The id of the scenario that is being processed
  */
  private getCurtailment(data: string, id: number): void {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    for (let index = 0; index < headers.length; index++) {
      switch (headers[index]) {
        case 'Hours':
          this.timers.push({
            id: id,
            time: this.getColumnData(lines, index).length,
          });
          this.lineChart[0]['data'].push(this.getColumnData(lines, index));
          break;
        case 'Electric_grid_power_flow':
          this.count++;
          this.lineChart[0]['data'].push(this.getColumnData(lines, index));
          this.lineChart[0]['data'][this.lineChart[0]['data'].length - 1][0] = this.forms[(id - 1)];
          break;
      }
    }

    if (this.count === this.selectedScenariosCount) {
      if (this.timers[0]['time'] !== this.timers[1]['time']) {
        this.status = 'error';
        this.textMessage = 'These scenarios have different horizon!';
      } else {
        this.status = 'success';
        this.textMessage = 'Data successfully retrieved!';
        this.lineChart[0]['title'] = 'Electric grid power flow';
        this.showLine = true;
      }
      this.loading = false;
      this.count = 0;
    }
  }

  /**
  * Function responsible to isolate the variables corresponding to bar charts
  * and push them to the barChart variable to be simulated
  * @example
  * getBarCharts(data)
  *
  * data = `Time,Electric_demand,WT_power,PV_power,RES_power,
  * Surplus,EB_input,P2G_input,P2H_input,RES_Curtailment,RES_direct_utilization,
  * EB_output,CHP_el_production,DH_demand,LHD_demand,Total_heat_demand,P2H_heat,CHP_heat,P2G_heat,
  * G2H_heat,Electric_grid_power_flow,formName,Hours,FlexibilityBaseline,
  * FlexibilityMin,FlexibilityMax,FlexibilityModif,IndoorTemp`
  *
  * @param {string} data contains a CSV file as string
  */
  private getBarCharts(data: string): void {

    const lines = data.split('\n');
    let directUtil = 0;
    for (let index = 0; index < lines.length; index++) {
      const keyVal = lines[index].split(',');
      switch (keyVal[0]) {
        case 'Total technologies annual cost':
          this.barChart[0]['data'].push(keyVal);
          break;
        case 'CO2 emissions cost':
          this.barChart[0]['data'].push(keyVal);
          break;
        case 'Revenue for heat production':
          this.barChart[0]['data'].push(keyVal);
          break;
        case 'NG expenditure':
          this.barChart[0]['data'].push(keyVal);
          break;
        case 'Revenue for SNG':
          this.barChart[0]['data'].push(keyVal);
          break;
        case 'LCOE':
          this.barChart[0]['data'].push(keyVal);
          break;
        case 'CHP el production':
          this.barChart[3]['data'].push(keyVal);
          break;
        case 'G2H CO2 emissions':
          this.barChart[1]['data'].push(keyVal);
          break;
        case 'P2G CO2 savings':
          this.barChart[1]['data'].push(keyVal);
          break;
        case 'CHP CO2 emissions':
          this.barChart[1]['data'].push(keyVal);
          break;
        case 'Total CO2 emissions':
          this.barChart[1]['data'].push(keyVal);
          break;
        case 'RES curtailment':
          this.barChart[2]['data'].push(keyVal);
          break;
        case 'RES to P2G':
          this.barChart[2]['data'].push(keyVal);
          break;
        case 'RES to EB':
          // this.barChart[2]['data'].push(keyVal);
          break;
        case 'RES to P2H':
          this.barChart[2]['data'].push(keyVal);
          break;
        case 'RES direct utilization':
          if (directUtil === 0) {
            this.barChart[2]['data'].push(keyVal);
            this.barChart[3]['data'].push(keyVal);
            directUtil += 1;
          }
          break;
        case 'Imported electricity cost':
          this.barChart[0]['data'].push(keyVal);
          break;
        case 'Imported electricity':
          this.barChart[3]['data'].push(keyVal);
          break;
        case 'RES producibility':
          // this.barChart[2]['data'].push(keyVal);
          break;
        case 'P2G heat':
          this.barChart[4]['data'].push(keyVal);
          break;
        case 'G2H heat':
          this.barChart[4]['data'].push(keyVal);
          break;
        case 'CHP heat':
          this.barChart[4]['data'].push(keyVal);
          break;
        case 'P2H heat':
          this.barChart[4]['data'].push(keyVal);
          break;
        default:
          break;
      }
    }
    this.barChart[0]['title'] = 'LCOE and economic results CO' + '\u2082' + ' emissions cost';
    this.barChart[0]['yAxisLabel'] = 'Expenses and Revenues M€';
    this.barChart[0]['yRightAxisLabel'] = 'LCOE €/MWh';
    this.barChart[1]['title'] = 'CO' + '\u2082' + ' emissions cost';
    this.barChart[1]['yAxisLabel'] = 'CO' + '\u2082' + ' emissions 10' + '\u00B3' + ' t';
    this.barChart[2]['title'] = 'RES producibility dispatch';
    this.barChart[2]['yAxisLabel'] = 'RES producibility MWh';
    this.barChart[3]['title'] = 'Electric Demand Fulfilment';
    this.barChart[3]['yAxisLabel'] = 'Electric Demand MWh';
    this.barChart[4]['title'] = 'Thermal Demand Fulfilment';
    this.barChart[4]['yAxisLabel'] = 'Thermal Demand MWh';
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

  /**
  * Function responsible for returning the columns data for a specific index
  * @example
  * getColumnData(lines, column)
  * lines = ['Electric_grid_power_flow','2','3','4','5','6','7','8','9','10']
  * column = 5
  *
  * @param {Array<string>} lines Holding information for each line (timestep) of the horizon
  * @param {number} column number indicating the column we want to extract from the lines
  * @returns The corresponding column
  */
  private getColumnData(lines: Array<string>, column: number): Array<string> {
    const result = lines.map(val => {
      const value = val.split(',');
      return value[column];
    },
    );
    return result;
  }

  /**
  * Function responsible for Opening a dialog box over the current screen
  * @example
  * openDialogBox()
  *
  * @returns A dialog box with all the already simulated scenarios
  */
  public openDialogBox(): void {
    const context: Object = {
      context: {
        scenarioType: 'comparison',
      },
    } as Partial<NbDialogConfig<string | Partial<ScenarioPanelComponent>>>;
    this.dialogService.open(ScenarioPanelComponent, context)
      .onClose.subscribe(name => {
        if (name) {
          this.selectedForms = name['comparison'];
          this.buttonText = 'Compared Scenarios';
        }
      });
  }

  /**
  * Function to initialize the state from the begining
  * @example
  * initializeCharts()
  *
  */
  private initializeCharts(): void {
    this.status = '';
    this.showLine = false;
    this.showBar = false;
    this.textMessage = '';
    this.lineChart[0] = {
      data: [],
    };
    for (let i = 0; i < this.BARS_TOTAL; i++) {
      this.barChart[i] = {
        data: [],
      };
    }
    this.timers = [];
  }

}
