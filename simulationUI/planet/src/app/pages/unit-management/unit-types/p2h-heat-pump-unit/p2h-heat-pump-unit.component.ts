import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ngx-p2h-heat-pump-unit',
  styleUrls: ['./p2h-heat-pump-unit.component.scss'],
  templateUrl: './p2h-heat-pump-unit.component.html',
})
export class P2HHeatPumpUnitComponent implements OnChanges {

  p2hHeatPumpParams: Object;
  @Input() hpInput: Object;
  @Input() mode: string;
  @Output() p2hHeatPump: EventEmitter<Object>;

  constructor() {
    this.p2hHeatPumpParams = {
      'hardwareId': 'HP1',
      'topic': 'HP/1',
      'payload': {
        'parameters': {
          'configuration': {
            'nominal.heat.power': '',
            'cop': '',
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

    this.p2hHeatPump = new EventEmitter<Object>();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['hpInput']['currentValue']) {
      let metadata = JSON.stringify(changes['hpInput']['currentValue']['metadata']);
      if (metadata) {
        metadata = metadata.replace(/_/g, '.');
        metadata = metadata.replace(/cos\.phi/, 'cos_phi');
        metadata = JSON.parse(metadata);
        this.p2hHeatPumpParams['payload']['parameters']['configuration'] = metadata;
        this.p2hHeatPumpParams['description'] = changes['hpInput']['currentValue']['comments'];
      }
    }
  }

  onChange(attribute, event) {
    this.p2hHeatPumpParams['payload']['parameters']['configuration'][attribute] = event;
    this.p2hHeatPump.emit(this.p2hHeatPumpParams);
  }

}
