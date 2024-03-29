import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ngx-p2g-unit',
  styleUrls: ['./p2g-unit.component.scss'],
  templateUrl: './p2g-unit.component.html',
})
export class P2GUnitComponent implements OnChanges {

  p2gParams: Object;
  unitDescr: string;
  @Input() p2gInput: Object;
  @Input() mode: string;
  @Output() p2g: EventEmitter<Object>;

  constructor() {
    this.p2gParams = {
      'hardwareId': 'P2G1',
      'topic': 'P2G/1',
      'payload': {
        'parameters': {
          'configuration': {
            'nominal_electric_power': '',
            'efficiency_electrolysis': '',
            'efficiency_methanation': '',
            'efficiency_thermal': '',
          },
          'input': {
            'control': '',
          },
          'output': {
            'electricity_power_active': '',
            'electricity_power_reactive': '',
            'heat_power': '',
            'ng_power': '',
          },
        },
      },
      'description': '',
    };

    this.p2g = new EventEmitter<Object>();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['p2gInput']['currentValue']['metadata']) {
      const defaultValues = this.changeDotsToUnderScores(changes['p2gInput']['currentValue']['metadata']);
      this.p2gParams['payload']['parameters']['configuration'] = JSON.parse(defaultValues);
      this.p2gParams['description'] = changes['p2gInput']['currentValue']['description'];
      this.p2g.emit(this.p2gParams);
    } else if (changes['p2gInput']['currentValue']['efficiency_electrolysis']
      || changes['p2gInput']['currentValue']['efficiency.electrolysis']) {
      const defaultValues = this.changeDotsToUnderScores(changes['p2gInput']['currentValue']);
      this.p2gParams['payload']['parameters']['configuration'] = JSON.parse(defaultValues);
      this.p2g.emit(this.p2gParams);
    }
  }

  changeDotsToUnderScores(p2gObject: Object): string {
    let p2gObjectValue = JSON.stringify(p2gObject).replace('nominal.electric.power', 'nominal_electric_power');
    p2gObjectValue = p2gObjectValue.replace('efficiency.electrolysis', 'efficiency_electrolysis');
    p2gObjectValue = p2gObjectValue.replace('efficiency.methanation', 'efficiency_methanation');
    p2gObjectValue = p2gObjectValue.replace('efficiency.thermal', 'efficiency_thermal');
    return p2gObjectValue;
  }

  onChange(attribute, event) {
    this.p2gParams['payload']['parameters']['configuration'][attribute] = event;
    this.p2g.emit(this.p2gParams);
  }

}
