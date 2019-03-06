import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-p2g-unit',
  styleUrls: ['./p2g-unit.component.scss'],
  templateUrl: './p2g-unit.component.html',
})
export class P2GUnitComponent {

  p2gParams: Object;
  @Output() p2g: EventEmitter<Object>;

  constructor() {
    this.p2gParams = {
      'hardwareId': 'P2G1',
      'topic': 'P2G/1',
      'payload': {
        'parameters': {
          'configuration': {
            'nominal.electric.power': '',
            'efficiency.electrolysis': '',
            'efficiency.methanation': '',
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

    this.p2g = new EventEmitter<Object>();

  }

  onChange(attribute, event) {
    this.p2gParams['payload']['parameters']['configuration'][attribute] = event;
    this.p2g.emit(this.p2gParams);
  }

}
