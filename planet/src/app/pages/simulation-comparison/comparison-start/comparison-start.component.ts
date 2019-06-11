import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DialogSelectMultipleFormPromptComponent } from './dialog-prompt/select-multiple-form.component';
import { NbDialogService } from '@nebular/theme';
import { EnvService } from '../../../env.service';

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
  status = '';
  textMessage = '';

  options: any = {};
  themeSubscription: any;
  selectedForms = 'Select Saved Simulations';

  constructor(private httpClient: HttpClient,
    private dialogService: NbDialogService,
    private env: EnvService) {
    this.initializeCharts();
  }

  toggleLoadingAnimation() {
    this.loading = true;
  }

  startComparison(): void {
    this.toggleLoadingAnimation();
    this.showLine = false;
    this.initializeCharts();
    this.forms = this.selectedForms.split('  -  ');
    this.selectedScenariosCount = this.forms.length;
    const params = {};
    for (let i = 0; i < this.forms.length; i++) {
      const tempString = 'formName' + (i + 1);
      params[tempString] = this.forms[i];
    }
    const url = 'http://' + this.env.planet + ':' + this.env.planetRESTPort + '/multi_simulation';

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
                this.getCurtailment(data[resultString], i + 1);
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

  getColumnData(lines, column: number) {
    const result = lines.map(val => {
      const value = val.split(',');
      return value[column];
    },
    );
    return result;
  }

  openDialogBox() {
    this.dialogService.open(DialogSelectMultipleFormPromptComponent)
      .onClose.subscribe(name => {
        if (name) {
          this.selectedForms = name;
        }
      });
  }

  initializeCharts() {
    this.status = '';
    this.textMessage = '';
    this.lineChart[0] = {
      data: [],
    };
    this.timers = [];
  }

}
