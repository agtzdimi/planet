import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DialogSelectMultipleFormPromptComponent } from './dialog-prompt/select-multiple-form.component';
import { NbDialogService } from '@nebular/theme';
import ipJson from '../../../../assets/data//planet_IPs.json';

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
  forms: string[] = [];
  results1Data: any;

  options: any = {};
  themeSubscription: any;
  selectedForms = 'Select Saved Simulations';

  constructor(private httpClient: HttpClient, private dialogService: NbDialogService) {
    this.initializeCharts();
  }

  toggleLoadingAnimation() {
    this.loading = true;
  }

  startComparison(): void {
    this.toggleLoadingAnimation();
    this.showLine = false;
    this.initializeCharts();
    const interval = setInterval(() => {
      this.forms = this.selectedForms.split('  -  ');
      const url = 'http://' + ipJson['planet'] + ':8000/multi_simulation';
      this.httpClient.get(url, {
        params: {
          'formName1': this.forms[0],
          'formName2': this.forms[1],
        },
      })
        .subscribe(
          data => {
            // console.log('GET Request is successful ');
            if (data['results1'] && data['results2']) {
              this.getCurtailment(data['results1'], 1);
              this.getCurtailment(data['results2'], 2);
              clearInterval(interval);
            }
          },
          error => {
            // console.log('Error', error);
          },
        );
    }, 2000);
  }

  getCurtailment(data, id) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    for (let index = 0; index < headers.length; index++) {
      switch (headers[index]) {
        case 'Time':
          this.lineChart[0].data.push(this.getColumnData(lines, index));
          break;
        case 'Electric_grid_power_flow':
          this.count++;
          this.lineChart[0].data.push(this.getColumnData(lines, index));
          if (id === 2) {
            this.lineChart[0].data[this.lineChart[0].data.length - 1][0] = this.forms[1];
          } else {
            this.lineChart[0].data[this.lineChart[0].data.length - 1][0] = this.forms[0];
          }
          break;
      }
    }

    if (this.count === 2) {
      this.lineChart[0].title = 'Electric grid power flow';
      this.showLine = true;
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
    this.lineChart[0] = {
      data: [],
    };
  }

}
