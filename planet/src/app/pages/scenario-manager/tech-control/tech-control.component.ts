import { Component, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { ControlFileService } from '../../../@theme/services/scenario-manager-services/control-file.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-tech-control',
  templateUrl: './tech-control.component.html',
  styleUrls: ['./tech-control.component.scss'],
})
export class TechControlComponent implements OnDestroy {

  @Output() phase4: EventEmitter<Boolean>;
  @Input() isLoadModule: Boolean;
  controlSystem: Object;
  private subscriptions: Subscription[] = [];
  resProd = {
    'yes': false,
    'no': true,
  };

  constructor(private controlFileService: ControlFileService) {
    this.controlSystem = this.controlFileService.controlSystem;
    this.phase4 = new EventEmitter<Boolean>();
    this.subscriptions.push(this.controlFileService.controlFileUpdated.subscribe(
      (data) => this.controlSystem = data,
    ));
  }

  nextPhase() {
    if (!this.checkControlValue()) {
      this.controlFileService.controlFileUpdated.next(this.controlSystem);
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
