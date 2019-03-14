import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-p2h-heat-pump-unit',
  styleUrls: ['./p2h-heat-pump-unit.component.scss'],
  templateUrl: './p2h-heat-pump-unit.component.html',
})
export class P2HHeatPumpUnitComponent {

  p2hHeatPumpParams: Object;
  @Output() p2hHeatPump: EventEmitter<Object>;

  constructor() {
    this.p2hHeatPumpParams = {
      'hardwareId': 'HP1',
      'topic': 'HP/1',
      'payload': {
        'parameters': {
          'configuration': {
            'nominal.heat.power': '',
            'cop': '',
            'cos_phi': '',
          },
          'input': {
            'control': '',
          },
          'output': {
            'electricity.power.active': '',
            'electricity.power.reactive': '',
            'heat.power': '',
          },
        },
      },
    };

    this.p2hHeatPump = new EventEmitter<Object>();

  }

  onChange(attribute, event) {
    this.p2hHeatPumpParams['payload']['parameters']['configuration'][attribute] = event;
    this.p2hHeatPump.emit(this.p2hHeatPumpParams);
  }

}
