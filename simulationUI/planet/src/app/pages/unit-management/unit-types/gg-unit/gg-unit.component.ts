import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-gg-unit',
  styleUrls: ['./gg-unit.component.scss'],
  templateUrl: './gg-unit.component.html',
})
export class GGUnitComponent {

  ggParams: Object;
  @Output() gg: EventEmitter<Object>;

  constructor() {
    this.ggParams = {
      'hardwareId': 'NGgrid',
      'topic': 'NGgrid',
      'payload': {
        'parameters': {
          'configuration': {
          },
          'input': {
            'ng.power.1': '',
            'ng.power.2': '',
            'ng.power.m': '',
          },
          'output': {
            'gg.energy.balance': '',
          },
        },
      },
    };

    this.gg = new EventEmitter<Object>();

  }

  onChange(attribute, event) {
    this.ggParams['payload']['parameters']['configuration'][attribute] = event;
    this.gg.emit(this.ggParams);
  }

}
