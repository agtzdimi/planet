import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ngx-p2h-unit',
  styleUrls: ['./p2h-unit.component.scss'],
  templateUrl: './p2h-unit.component.html',
})
export class P2HUnitComponent implements OnChanges {

  p2hParams: Object;
  @Input() p2hInput: Object;
  @Input() mode: string;
  @Output() p2h: EventEmitter<Object>;

  constructor() {
    this.p2hParams = {
      'hardwareId': 'HP1',
      'topic': 'HP/1',
      'payload': {
        'parameters': {
          'configuration': {
            'nominal_heat_power': '',
            'cop': '',
          },
          'input': {
            'control': '',
          },
          'output': {
            'electricity_power_active': '',
            'electricity_power_reactive': '',
            'heat_power': '',
          },
        },
      },
      'description': '',
    };
    this.p2h = new EventEmitter<Object>();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['p2hInput']['currentValue']['metadata']) {
      const defaultValues = this.changeDotsToUnderScores(changes['p2hInput']['currentValue']['metadata']);
      this.p2hParams['payload']['parameters']['configuration'] = JSON.parse(defaultValues);
      this.p2hParams['description'] = changes['p2hInput']['currentValue']['description'];
      this.p2h.emit(this.p2hParams);
    } else if (changes['p2hInput']['currentValue']['nominal_heat_power']) {
      const defaultValues = this.changeDotsToUnderScores(changes['p2hInput']['currentValue']);
      this.p2hParams['payload']['parameters']['configuration'] = JSON.parse(defaultValues);
      this.p2h.emit(this.p2hParams);
    }
  }

  changeDotsToUnderScores(p2hObject: Object): string {
    const p2hObjectValue = JSON.stringify(p2hObject).replace('nominal.heat.power', 'nominal_heat_power');
    return p2hObjectValue;
  }

  onChange(attribute, event) {
    this.p2hParams['payload']['parameters']['configuration'][attribute] = event;
    this.p2h.emit(this.p2hParams);
  }

}
