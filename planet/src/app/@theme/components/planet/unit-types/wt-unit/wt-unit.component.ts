import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-wt-unit',
  styleUrls: ['./wt-unit.component.scss'],
  templateUrl: './wt-unit.component.html',
})
export class WTUnitComponent {

  wtParams: Object;
  @Output() wt: EventEmitter<Object>;

  constructor() {
    this.wtParams = {
      'hardwareId': 'WT1',
      'topic': 'WT/1',
      'payload': {
        'parameters': {
          'configuration': {
            'nominal.electric.power': '',
            'producibility.profile': '',
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

    this.wt = new EventEmitter<Object>();

  }

  onChange(attribute, event) {
    this.wtParams['payload']['parameters']['configuration'][attribute] = event;
    this.wt.emit(this.wtParams);
  }

}
