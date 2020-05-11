import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-chp-unit',
  styleUrls: ['./chp-unit.component.scss'],
  templateUrl: './chp-unit.component.html',
})
export class CHPUnitComponent {

  chpParams: Object;
  @Output() chp: EventEmitter<Object>;

  constructor() {
    this.chpParams = {
      'hardwareId': 'CHP1',
      'topic': 'CHP/1',
      'payload': {
        'parameters': {
          'configuration': {
            'nominal.electric.power': '',
            'efficiency.electric': '',
            'efficiency.thermal': '',
            'cos_phi': '',
          },
          'input': {
            'control': '',
          },
          'output': {
            'electricity.power.active': '',
            'electricity.power.reactive': '',
            'heat.power': '',
            'ng.power': '',
          },
        },
      },
    };

    this.chp = new EventEmitter<Object>();

  }

  onChange(attribute, event) {
    this.chpParams['payload']['parameters']['configuration'][attribute] = event;
    this.chp.emit(this.chpParams);
  }

}
