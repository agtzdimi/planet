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
    this.ves = new EventEmitter<Object>();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['vesInput']['currentValue']) {
      let metadata = JSON.stringify(changes['vesInput']['currentValue']['metadata']);
      if (metadata) {
        metadata = JSON.parse(metadata);
        this.vesParams['payload']['parameters']['configuration'] = metadata;
        this.vesParams['description'] = changes['vesInput']['currentValue']['description'];
      }
    }
  }

  onChange(attribute, event) {
    this.vesParams['payload']['parameters']['configuration'][attribute] = event;
    this.ves.emit(this.vesParams);
  }

}
