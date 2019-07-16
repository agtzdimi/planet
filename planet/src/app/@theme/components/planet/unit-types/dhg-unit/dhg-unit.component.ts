import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-dhg-unit',
  styleUrls: ['./dhg-unit.component.scss'],
  templateUrl: './dhg-unit.component.html',
})
export class DHGUnitComponent {

  dhgParams: Object;
  @Output() dhg: EventEmitter<Object>;

  constructor() {
    this.dhgParams = {
      'hardwareId': 'DH1',
      'topic': 'DH/1',
      'payload': {
        'parameters': {
          'configuration': {
          },
          'input': {
            'heat.power.1': '',
            'heat.power.2': '',
            'heat.power.m': '',
          },
          'output': {
            'dh.energy.balance': '',
          },
        },
      },
    };

    this.dhg = new EventEmitter<Object>();

  }

  onChange(attribute, event) {
    this.dhgParams['payload']['parameters']['configuration'][attribute] = event;
    this.dhg.emit(this.dhgParams);
  }

}
