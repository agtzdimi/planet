import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ngx-ves-unit',
  styleUrls: ['./ves-unit.component.scss'],
  templateUrl: './ves-unit.component.html',
})
export class VESUnitComponent implements OnChanges {

  vesParams: Object;
  @Input() vesInput: Object;
  @Input() mode: string;
  @Output() ves: EventEmitter<Object>;

  constructor() {
    this.vesParams = {
      'hardwareId': 'VES1',
      'topic': 'VES/1',
      'payload': {
        'parameters': {
          'configuration': {
            'nominal_heat_power': '',
            'efficiency_thermal': '',
          },
          'input': {
            'control': '',
          },
          'output': {
            'electricity_power_active': '',
            'electricity_power_reactive': '',
            'heat.power': '',
          },
        },
      },
      'description': '',
    };
    this.ves = new EventEmitter<Object>();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['vesInput']['currentValue']['metadata']) {
      const defaultValues = this.changeDotsToUnderScores(changes['vesInput']['currentValue']['metadata']);
      this.vesParams['payload']['parameters']['configuration'] = JSON.parse(defaultValues);
      this.vesParams['description'] = changes['vesInput']['currentValue']['description'];
      this.ves.emit(this.vesParams);
    } else if (changes['vesInput']['currentValue']['nominal_heat_power']) {
      const defaultValues = this.changeDotsToUnderScores(changes['vesInput']['currentValue']);
      this.vesParams['payload']['parameters']['configuration'] = JSON.parse(defaultValues);
      this.ves.emit(this.vesParams);
    }
  }

  changeDotsToUnderScores(vesObject: Object): string {
    let vesObjectValue = JSON.stringify(vesObject).replace('nominal.heat.power', 'nominal_heat_power');
    vesObjectValue = JSON.stringify(vesObject).replace('efficiency.thermal', 'efficiency_thermal');
    return vesObjectValue;
  }

  onChange(attribute, event) {
    this.vesParams['payload']['parameters']['configuration'][attribute] = event;
    this.ves.emit(this.vesParams);
  }

}
