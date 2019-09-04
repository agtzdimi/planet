import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-ves-unit',
  styleUrls: ['./ves-unit.component.scss'],
  templateUrl: './ves-unit.component.html',
})
export class VESUnitComponent implements OnInit, OnChanges {

  vesParams: Object;
  @Input() vesInput: Object;
  @Input() mode: string;
  @Output() ves: EventEmitter<Object>;
  parametersColumnSize = 'col-md-6';

  constructor() {
    this.vesParams = {
      'hardwareId': 'VES1',
      'topic': 'VES/1',
      'payload': {
        'parameters': {
          'timeStamp': '',
          'horizon': 120,
          'timeStep': '',
          'timeUnit': 'MINUTES',
          'noAssets': 100,
          'assetType': 'residential',
        },
        'optionalParameters': {
          'conductance': null,
          'capacity': null,
          'hvacCOP': {
            'heat': {
              'a': 0.0461466850663691,
              'b': 2.90629308414889,
            },
            'cool': {
              'a': -0.1082518,
              'b': 7.10789209,
            },
          },
          'pMax': 4000,
          'mode': 'HEAT',
        },
        'inputData': {
          'tOutForecast': [13, 13, 13, 13, 13, 13],
        },
        'optionalInputData': {
          'tInInit': 21.5,
          'tInBaseMin': [21, 21, 21, 21, 21, 21],
          'tInBaseMax': [22, 22, 22, 22, 22, 22],
          'tInAltMin': [20, 20, 20, 20, 20, 20],
          'tInAltMax': [23, 23, 23, 23, 23, 23],
        },
      },
      'description': '',
    };
    this.ves = new EventEmitter<Object>();

  }

  ngOnInit() {
    if (this.mode === 'edit') {
      this.parametersColumnSize = 'col-md-12';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['vesInput']['currentValue']['metadata']) {
      const defaultValues = this.changeDotsToUnderScores(changes['vesInput']['currentValue']['metadata']);
      this.vesParams['payload']['parameters']['configuration'] = JSON.parse(defaultValues);
      this.vesParams['description'] = changes['vesInput']['currentValue']['description'];
      this.ves.emit(this.vesParams);
    } else if (changes['vesInput']['currentValue']['parameters']) {
      const defaultValues = this.changeDotsToUnderScores(changes['vesInput']['currentValue']);
      this.vesParams['payload'] = JSON.parse(defaultValues);
      this.ves.emit(this.vesParams);
    }
  }

  changeDotsToUnderScores(vesObject: Object): string {
    let vesObjectValue = JSON.stringify(vesObject).replace('nominal.heat.power', 'nominal_heat_power');
    vesObjectValue = JSON.stringify(vesObject).replace('efficiency.thermal', 'efficiency_thermal');
    return vesObjectValue;
  }

  onChange(attribute, event, attributeType) {
    this.vesParams['payload'][attributeType][attribute] = event;
    this.ves.emit(this.vesParams);
  }

}
