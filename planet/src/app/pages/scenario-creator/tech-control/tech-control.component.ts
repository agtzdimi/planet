import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ControlFileService } from '../../../@theme/services/scenario-manager-services/control-file.service';

@Component({
  selector: 'ngx-tech-control',
  templateUrl: './tech-control.component.html',
  styleUrls: ['./tech-control.component.scss'],
})
export class TechControlComponent implements OnInit {

  @Output() phase4: EventEmitter<Boolean>;
  @Input() isLoadModule: Boolean;
  controlSystem: Object;
  resProd = {
    'yes': false,
    'no': true,
  };

  constructor(private controlFileService: ControlFileService) {
    this.controlSystem = this.controlFileService.controlSystem;
    this.phase4 = new EventEmitter<Boolean>();
    this.controlFileService.controlFileUpdated.subscribe(
      (data) => this.controlSystem = data,
    );
  }

  ngOnInit() {
  }

  nextPhase() {
    if (!this.checkControlValue()) {
      this.controlFileService.controlFileUpdated.emit(this.controlSystem);
      this.phase4.emit(true);
    }

  }

  checkControlValue() {
    return this.controlSystem['payload']['control'] < 1 || this.controlSystem['payload']['control'] > 6;
  }

  handleResProd(event, checkBox) {
    if (checkBox === 'yes') {
      this.resProd = { 'yes': event, 'no': false };
      this.controlSystem['payload']['RES.curtailment'] = 1;
    } else {
      this.resProd = { 'yes': false, 'no': event };
      this.controlSystem['payload']['RES.curtailment'] = 0;
    }
  }
}
