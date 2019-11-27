import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { EconomyFileService } from '../../../@theme/services/scenario-manager-services/economy-file.service';


/**
 * Component responsible for configuring the ```Economy_environment_initialization.txt``` file
 */
@Component({
    selector: 'ngx-tech-cost',
    styleUrls: ['./tech-cost.component.scss'],
    templateUrl: './tech-cost.component.html',
})
/**
 * @param {boolean[]} checkVal Array holding the `switches` state per node @example checkVal['node.1'] = true
 * @param {Object} economyParams Variable holding the JSON structure of ```Economy_environment_initialization.txt``` file
 * @param {Subscription[]} subscriptions Private variable holding the custom Observables to unsubscribe when the component will be destroyed
 * @param {number} CHECKBOX_COUNT constant with the numbers of the checkboxes available in the component
 * @param {EventEmitter<boolean>} phase5 Variable emit true when the user proceed to the next phase. Available only in create scenario
 * @param {boolean} isLoadModule Input Variable declaring if the component started on load scenario or not
 */
export class TechCostComponent implements OnDestroy {

    public checkVal: boolean[] = [];
    public economyParams: Object;
    private subscriptions: Subscription[] = [];
    private CHECKBOX_COUNT: number = 6;
    @Output() phase5: EventEmitter<boolean>;
    @Input() isLoadModule: boolean;

    /**
 * @param {EconomyFileService} economyFileService Custom service holding the structure of Economy_environment_initialization.txt
 */
    constructor(private economyFileService: EconomyFileService) {
        for (let i = 0; i < this.CHECKBOX_COUNT; i++) {
            this.checkVal.push(false);
        }
        this.phase5 = new EventEmitter<boolean>();
        this.economyParams = this.economyFileService.economyFile;

        this.subscriptions.push(this.economyFileService.economyFileUpdated.subscribe(
            (data) => this.economyParams = data,
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
        this.economyFileService.economyFileUpdated.next(this.economyParams);
        this.phase5.emit(true);
    }

    /**
  * Function responsible on updating the switces holding the different technologies
  * @example
  * changeCheckBoxVal(1): will change the Wind checkBox status to [true|false]
  *
  * @param {number} id The number indicating the changed checkbox
  *
  */
    public changeCheckBoxVal(id: number): void {
        this.checkVal[id] = !this.checkVal[id];
    }

    /**
  * Angular lifecycle hook on Component destroyed. used to clear the Observable subscriptions
  */
    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
