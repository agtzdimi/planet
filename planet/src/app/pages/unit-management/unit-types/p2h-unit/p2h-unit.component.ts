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
    this.p2h = new EventEmitter<Object>();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['p2hInput']['currentValue']) {
      let metadata = JSON.stringify(changes['p2hInput']['currentValue']['metadata']);
      if (metadata) {
        metadata = JSON.parse(metadata);
        this.p2hParams['payload']['parameters']['configuration'] = metadata;
        this.p2hParams['description'] = changes['p2hInput']['currentValue']['description'];
      }
    }
  }

  onChange(attribute, event) {
    this.p2hParams['payload']['parameters']['configuration'][attribute] = event;
    this.p2h.emit(this.p2hParams);
  }

}
