import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NbDialogService, NbDialogConfig } from '@nebular/theme';
import { UserProfileService } from '../../../@theme/services';
import { ScenarioPanelComponent } from '../../../@theme/components';

@Component({
  selector: 'ngx-comparison-start',
  styleUrls: ['./comparison-start.component.scss'],
  templateUrl: './comparison-start.component.html',
})
export class ComparisonStartComponent {

  lineChart = [];
  showLine: boolean = false;
  loading = false;
  count = 0;
  selectedScenariosCount = 0;
  forms: string[] = [];
  results1Data: any;
  timers = [];
  barChart = [];
  yVal: number;
  showBar = false;
  status = '';
  textMessage = '';
  BARS_TOTAL = 5;

  options: any = {};
  themeSubscription: any;
  selectedForms = 'Select Saved Scenarios';
  buttonText = 'Select Saved Scenarios';

  constructor(private httpClient: HttpClient,
    private dialogService: NbDialogService,
    private userProfile: UserProfileService) {
    this.initializeCharts();
  }

  toggleLoadingAnimation() {
    this.loading = true;
  }

  startComparison(): void {
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
                this.getBarCharts(data[resultString]['results2'], i + 1);
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

  getCurtailment(data, id) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    for (let index = 0; index < headers.length; index++) {
      switch (headers[index]) {
        case 'Hours':
          this.timers.push({
            id: id,
            time: this.getColumnData(lines, index).length,
          });
          this.lineChart[0].data.push(this.getColumnData(lines, index));
          break;
        case 'Electric_grid_power_flow':
          this.count++;
          this.lineChart[0].data.push(this.getColumnData(lines, index));
          this.lineChart[0].data[this.lineChart[0].data.length - 1][0] = this.forms[(id - 1)];
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
        this.lineChart[0].title = 'Electric grid power flow';
        this.showLine = true;
      }
      this.loading = false;
      this.count = 0;
    }
  }

  getBarCharts(data, id) {

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
    const result = lines.map(val => {
      const value = val.split(',');
      return value[column];
    },
    );
    return result;
  }

  openDialogBox() {
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

  initializeCharts() {
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
