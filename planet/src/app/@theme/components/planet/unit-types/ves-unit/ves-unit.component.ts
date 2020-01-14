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
  parametersColumnSize = 'col-md-8';

  constructor() {
    this.vesParams = {
      'hardwareId': 'VES1',
      'topic': 'VES/1',
      'payload': {
        'simulationID': '',
        'nodeID': '',
        'VESPortfolioID': '',
        'parameters': {
          'timeStamp': '',
          'noSteps': 24,
          'timeStep': '',
          'noResidentialBuildings': 100,
          'noCommercialBuildings': 150,
          'tOutForecast': [13, 13, 13, 13, 13, 13],
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
    this.ves.emit(this.vesParams);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['vesInput']['currentValue']['metadata']) {
      const defaultValues = this.changeDotsToUnderScores(changes['vesInput']['currentValue']['metadata']);
      this.vesParams['payload'] = JSON.parse(defaultValues);
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
    if (this.vesParams['payload']['parameters']['configuration']) {
      this.vesParams['payload']['parameters']['configuration']['parameters']['tOutForecast'] = this.vesParams['payload']['parameters']['tOutForecast'];
    }
    this.ves.emit(this.vesParams);
  }

}
