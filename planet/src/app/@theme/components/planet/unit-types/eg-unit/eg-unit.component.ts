import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-eg-unit',
  styleUrls: ['./eg-unit.component.scss'],
  templateUrl: './eg-unit.component.html',
})
export class EGUnitComponent {

  egParams: Object;
  @Output() eg: EventEmitter<Object>;

  constructor() {
    this.egParams = {
      'hardwareId': 'Electricgrid',
      'topic': 'Electricgrid',
      'payload': {
        'parameters': {
          'configuration': {
          },
          'input': {
            'electricity.power.active.1': '',
            'electricity.power.reactive.1': '',
            'electricity.power.active.m': '',
            'electricity.power.reactive.m': '',
          },
          'output': {
            'dh.energy.balance.active': '',
            'dh.energy.balance.reactive': '',
          },
        },
      },
    };

    this.eg = new EventEmitter<Object>();

  }

  onChange(attribute, event) {
    this.egParams['payload']['parameters']['configuration'][attribute] = event;
    this.eg.emit(this.egParams);
  }

}
