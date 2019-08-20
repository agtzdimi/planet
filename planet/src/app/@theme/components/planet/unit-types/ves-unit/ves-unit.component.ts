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
    if (changes['vesInput']['currentValue']) {
      let metadata = JSON.stringify(changes['vesInput']['currentValue']['metadata']);
      if (metadata) {
        metadata = JSON.parse(metadata);
        this.vesParams['payload']['parameters']['configuration'] = metadata;
        this.vesParams['description'] = changes['vesInput']['currentValue']['description'];
        this.ves.emit(this.vesParams);
      } else if (changes['vesInput']['currentValue']) {
        const defaultValues = JSON.stringify(changes['vesInput']['currentValue']).replace(/\./g, '_');
        this.vesParams['payload']['parameters']['configuration'] = JSON.parse(defaultValues);
        this.ves.emit(this.vesParams);
      }
    }
  }

  onChange(attribute, event) {
    this.vesParams['payload']['parameters']['configuration'][attribute] = event;
    this.ves.emit(this.vesParams);
  }

}
