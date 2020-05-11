import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ControlFileService } from '../../../@theme/services/scenario-manager-services/control-file.service';


/**
 * Component responsible for configuring the ```Control_initialization.txt``` file
 */
@Component({
  selector: 'ngx-tech-control',
  templateUrl: './tech-control.component.html',
  styleUrls: ['./tech-control.component.scss'],
})
/**
 * @param {Object} resProd Variable holding the boolean value of the checkbox for having or not RES Producibility
 * @param {Subscription[]} subscriptions Private variable holding the custom Observables to unsubscribe when the component will be destroyed
 * @param {boolean} isLoadModule Input Variable declaring if the component started on load scenario or not
 * @param {Object} controlSystem Variable holding the JSON structure of ```Control_initialization.txt``` file
 * @param {EventEmitter<boolean>} phase4 Variable emit true when the user proceed to the next phase. Available only in create scenario
 *
 */
export class TechControlComponent implements OnDestroy {

  @Output() phase4: EventEmitter<boolean>;
  @Input() isLoadModule: boolean;
  public controlSystem: Object;
  private subscriptions: Subscription[] = [];
  public resProd: Object = {
    'yes': false,
    'no': true,
  };

  /**
  * @param {ControlFileService} controlFileService Custom service holding the structure of Control_initialization.txt
  */
  constructor(private controlFileService: ControlFileService) {
    this.controlSystem = this.controlFileService.controlSystem;
    this.phase4 = new EventEmitter<boolean>();
    this.subscriptions.push(this.controlFileService.controlFileUpdated.subscribe(
      (data) => this.controlSystem = data,
    ));
  }

  /**
  *
  * Function that will brief the create-scenario component to proceed to the next phase
  * @example
  * nextPhase()
  *
  */
  public nextPhase(): void {
    if (!this.checkControlValue()) {
      this.controlFileService.controlFileUpdated.next(this.controlSystem);
      this.phase4.emit(true);
    }
  }

  /**
  *
  * Function that will check the validity of the <input/> value. The value should be between 1-5
  * @example
  * checkControlValue()
  *
  * @returns [true|false]
  */
  public checkControlValue(): boolean {
    return this.controlSystem['payload']['control'] < 1 || this.controlSystem['payload']['control'] > 6;
  }

  /**
  *
  * Function that will be triggered when a user selects a different value [true|false] for the RES Producibility
  * @example
  * handleResProd(checkBoxValue, checkBoxText)
  *
  * @param {boolean} checkBoxValue The value [true|false] corresponding to the checkbox selected by the user
  * @param {string} checkBoxText The checkBox test [yes|no]
  */
  public handleResProd(checkBoxValue: boolean, checkBoxText: string): void {
    if (checkBoxText === 'yes') {
      this.resProd = { 'yes': checkBoxValue, 'no': false };
      this.controlSystem['payload']['RES.curtailment'] = 1;
    } else {
      this.resProd = { 'yes': false, 'no': checkBoxValue };
      this.controlSystem['payload']['RES.curtailment'] = 0;
    }
  }

  /**
  * Angular lifecycle hook on Component destroyed. used to clear the Observable subscriptions
  */
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
