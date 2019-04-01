import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ngx-p2h-electric-heat-unit',
  styleUrls: ['./p2h-electric-heat-unit.component.scss'],
  templateUrl: './p2h-electric-heat-unit.component.html',
})
export class P2HElectricHeatUnitComponent implements OnChanges {

  p2hElectricHeatParams: Object;
  @Input() ehInput: Object;
  @Input() mode: string;
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
      'description': '',
    };

    this.p2hElectricHeat = new EventEmitter<Object>();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ehInput']['currentValue']) {
      let metadata = JSON.stringify(changes['ehInput']['currentValue']['metadata']);
      if (metadata) {
        metadata = metadata.replace(/_/g, '.');
        metadata = metadata.replace(/cos\.phi/, 'cos_phi');
        metadata = JSON.parse(metadata);
        this.p2hElectricHeatParams['payload']['parameters']['configuration'] = metadata;
        this.p2hElectricHeatParams['description'] = changes['ehInput']['currentValue']['comments'];
      }
    }
  }

  onChange(attribute, event) {
    this.p2hElectricHeatParams['payload']['parameters']['configuration'][attribute] = event;
    this.p2hElectricHeat.emit(this.p2hElectricHeatParams);
  }

}
