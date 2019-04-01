import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-pv-unit',
  styleUrls: ['./pv-unit.component.scss'],
  templateUrl: './pv-unit.component.html',
})
export class PVUnitComponent {

  pvParams: Object;
  @Output() pv: EventEmitter<Object>;

  constructor() {
    this.pvParams = {
      'hardwareId': 'PV1',
      'topic': 'PV/1',
      'payload': {
        'parameters': {
          'configuration': {
            'nominal.electric.power': '',
            'specific.producibility.profile': '',
            'cos_phi': '',
          },
          'input': {
            'control.curtailment': '',
          },
          'output': {
            'electricity.power.active': '',
            'electricity.power.reactive': '',
          },
        },
      },
    };

    this.pv = new EventEmitter<Object>();

  }

  onChange(attribute, event) {
    this.pvParams['payload']['parameters']['configuration'][attribute] = event;
    this.pv.emit(this.pvParams);
  }

}
