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
            'HPMaxTemperature': 90,
            'HPPowerFactor': 0.9,
            'HPNominalPower': 30,
            'StorageVolume': 500,
            'BuildingsVolume': 250000,
            'CAPEX': 2000,
            'OPEX': 2,
          },
        },
      },
      'description': '',
    };
    this.p2h = new EventEmitter<Object>();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['p2hInput']['currentValue']['metadata']) {
      this.p2hParams['payload']['parameters']['configuration'] = changes['p2hInput']['currentValue']['metadata'];
      this.p2hParams['description'] = changes['p2hInput']['currentValue']['description'];
      this.p2h.emit(this.p2hParams);
    } else if (changes['p2hInput']['currentValue']['HPMaxTemperature']) {
      this.p2hParams['payload']['parameters']['configuration']['HPMaxTemperature'] = changes['p2hInput']['currentValue']['HPMaxTemperature'];
      this.p2hParams['payload']['parameters']['configuration']['HPPowerFactor'] = changes['p2hInput']['currentValue']['HPPowerFactor'];
      this.p2hParams['payload']['parameters']['configuration']['HPNominalPower'] = changes['p2hInput']['currentValue']['HPNominalPower'];
      this.p2hParams['payload']['parameters']['configuration']['StorageVolume'] = changes['p2hInput']['currentValue']['StorageVolume'];
      this.p2hParams['payload']['parameters']['configuration']['BuildingsVolume'] = changes['p2hInput']['currentValue']['BuildingsVolume'];
      this.p2hParams['payload']['parameters']['configuration']['name'] = changes['p2hInput']['currentValue']['name'];
      this.p2hParams['payload']['parameters']['configuration']['IP'] = changes['p2hInput']['currentValue']['IP'];
      this.p2hParams['payload']['parameters']['configuration']['Port'] = changes['p2hInput']['currentValue']['Port'];
      this.p2hParams['payload']['parameters']['configuration']['CAPEX'] = changes['p2hInput']['currentValue']['CAPEX'];
      this.p2hParams['payload']['parameters']['configuration']['OPEX'] = changes['p2hInput']['currentValue']['OPEX'];
      this.p2h.emit(this.p2hParams);
    }
  }

  onChange(attribute, event) {
    this.p2hParams['payload']['parameters']['configuration'][attribute] = event;
    this.p2h.emit(this.p2hParams);
  }

}
