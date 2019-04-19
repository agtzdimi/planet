import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ControlFileService } from '../services/control-file.service';

@Component({
  selector: 'ngx-tech-control',
  templateUrl: './tech-control.component.html',
  styleUrls: ['./tech-control.component.scss'],
})
export class TechControlComponent implements OnInit {

  @Output() phase4: EventEmitter<Boolean>;
  @Input() isLoadModule: Boolean;
  controlSystem: Object;

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
}
