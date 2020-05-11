import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { TurinGridInitService } from '../../../../services/scenario-manager-services/turin-grid-init.service';

@Component({
  selector: 'nb-name-prompt',
  templateUrl: './energy-grid.tech.component.html',
  styleUrls: ['./energy-grid.tech.component.scss'],
})
export class TechnologiesDialogComponent implements OnInit {

  node: string = '';
  public registeredDevices: Array<any> = [];
  public paramInit: Object = {};
  showingNode = '';
  showUnit = false;
  on = true;
  constructor(protected dialogRef: NbDialogRef<TechnologiesDialogComponent>,
    private httpClient: HttpClient,
    private turinGrid: TurinGridInitService) {
    this.paramInit = this.turinGrid.paramInit;
  }

  ngOnInit() {
    for (const property in this) {
      if (!isNaN(Number(property))) {
        this.node = this.node + this[property];
      }
    }
    this.showingNode = this.node.split(',')[1];
    this.node = this.node.split(',')[0];
    this.on = this.paramInit['payload']['electric.grid'][this.node]['activated'];
    const url = '/planet/rest/get_devices';
    this.httpClient.get(url)
      .pipe(map((results) => {
        return results['results']['resources'];
      }),
      )
      .subscribe(
        (devices) => {
          this.registeredDevices['P2G'] = devices.filter(value => value.unitType === 'P2G');
          this.registeredDevices['P2H'] = devices.filter(value => value.unitType === 'P2H');
          this.registeredDevices['VES'] = devices.filter(value => value.unitType === 'VES');
          this.showUnit = true;
        },
        (error) => {
          // console.log(error)
        },
      );
  }

  cancel() {
    this.dialogRef.close({
      'activated': this.on,
    });
  }

  submit() {
    this.dialogRef.close({
      'activated': this.on,
    });
  }

  /**
  * Function responsible on applying the registered flexibility values to the main configuration
  * @example
  * optionSelected('P2G1','P2G')
  *
  * @param {string} unitName The unit name
  * @param {string} unitType The unitType [P2G|P2H|VES]
  *
  */
  public optionSelected(unitName: string, unitType: string): void {
    const optionValue = this.registeredDevices[unitType].filter(value => {
      if (value['name'] === unitName) {
        return value['metadata'];
      }
    });
    if (unitName !== 'None') {
      this.paramInit['payload']['electric.grid'][this.node][unitType] = optionValue[0]['metadata'];
      this.paramInit['payload']['electric.grid'][this.node][unitType]['IP'] = optionValue[0]['IP'];
      this.paramInit['payload']['electric.grid'][this.node][unitType]['Port'] = optionValue[0]['Port'];
      this.paramInit['payload']['electric.grid'][this.node][unitType]['name'] = optionValue[0]['name'];
    } else {
      if (unitType === 'P2G') {
        this.paramInit['payload']['electric.grid'][this.node][unitType]['nominal.electric.power'] = 0;
      } else {
        this.paramInit['payload']['electric.grid'][this.node][unitType] = [];
      }
      this.paramInit['payload']['electric.grid'][this.node][unitType]['IP'] = '';
      this.paramInit['payload']['electric.grid'][this.node][unitType]['Port'] = '';
      this.paramInit['payload']['electric.grid'][this.node][unitType]['name'] = '';
    }

  }

  public checkUnit() {
    if (this.node && this.paramInit['payload']['electric.grid'][this.node]['P2H']['name'] &&
      this.paramInit['payload']['electric.grid'][this.node]['P2H']['name'] !== 'None') {
      return true;
    } else {
      return false;
    }

  }

  /**
  * Function responsible on updating the main configuration for ```Parameteres_initialazation.txt``` when a flexibility
  * unit has changed one of its attributes
  * @example
  * onUnitChange(p2gObject,'P2G')
  *
  * @param {Object} unitConfig The unit Object configuration
  * @param {string} unitType The unitType [P2G|P2H|VES]
  *
  */
  public onUnitChange(unitConfig: Object, unitType: string): void {
    let arr: Object[] = [];
    if (unitType === 'VES') {
      arr.push(unitConfig['payload']);
    } else {
      arr.push(unitConfig['payload']['parameters']['configuration']);
    }

    arr = arr.map(value => {
      return JSON.parse(JSON.stringify(value).replace(/_/g, '.'));
    });
    if (unitType === 'P2H') {
      for (let i = 1; i <= 43; i++) {
        this.paramInit['payload']['electric.grid']['node.' + i]['P2H']['HPMaxTemperature'] = this.paramInit['payload']['electric.grid'][this.node]['P2H']['HPMaxTemperature'];
      }
    }
    this.paramInit['payload']['electric.grid'][this.node][unitType] = arr[0];
  }

}
