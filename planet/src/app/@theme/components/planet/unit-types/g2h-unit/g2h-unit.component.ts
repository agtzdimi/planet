import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-g2h-unit',
  styleUrls: ['./g2h-unit.component.scss'],
  templateUrl: './g2h-unit.component.html',
})
export class G2HUnitComponent {

  g2hParams: Object;
  @Output() g2h: EventEmitter<Object>;

  constructor() {
    this.g2hParams = {
      'hardwareId': 'G2H1',
      'topic': 'G2H/1',
      'payload': {
        'parameters': {
          'configuration': {
            'nominal.heat.power': '',
            'efficiency.thermal': '',
          },
          'input': {
            'control': '',
          },
          'output': {
            'heat.power': '',
            'ng.power': '',
          },
        },
      },
    };

    this.g2h = new EventEmitter<Object>();

  }

  onChange(attribute, event) {
    this.g2hParams['payload']['parameters']['configuration'][attribute] = event;
    this.g2h.emit(this.g2hParams);
  }

}
