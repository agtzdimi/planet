import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-p2h-electric-heat-unit',
  styleUrls: ['./p2h-electric-heat-unit.component.scss'],
  templateUrl: './p2h-electric-heat-unit.component.html',
})
export class P2HElectricHeatUnitComponent {

  p2hElectricHeatParams: Object;
  @Output() p2hElectricHeat: EventEmitter<Object>;

  constructor() {
    this.p2hElectricHeatParams = {
      'hardwareId': 'EH1',
      'topic': 'EH/1',
      'payload': {
        'parameters': {
          'configuration': {
            'nominal.heat.power': '',
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
          },
        },
      },
    };

    this.p2hElectricHeat = new EventEmitter<Object>();

  }

  onChange(attribute, event) {
    this.p2hElectricHeatParams['payload']['parameters']['configuration'][attribute] = event;
    this.p2hElectricHeat.emit(this.p2hElectricHeatParams);
  }

}
