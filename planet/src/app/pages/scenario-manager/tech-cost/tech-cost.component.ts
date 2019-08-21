import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { EconomyFileService } from '../../../@theme/services/scenario-manager-services/economy-file.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ngx-tech-cost',
    styleUrls: ['./tech-cost.component.scss'],
    templateUrl: './tech-cost.component.html',
})
export class TechCostComponent implements OnDestroy {

    checkVal: boolean[] = [];
    economyParams: Object;
    private subscriptions: Subscription[] = [];
    CHECKBOX_COUNT = 5;
    @Output() phase5: EventEmitter<Boolean>;
    @Input() isLoadModule: Boolean;

    constructor(private economyFileService: EconomyFileService) {
        for (let i = 0; i < this.CHECKBOX_COUNT; i++) {
            this.checkVal.push(false);
        }
        this.phase5 = new EventEmitter<Boolean>();
        this.economyParams = this.economyFileService.economyFile;

        this.subscriptions.push(this.economyFileService.economyFileUpdated.subscribe(
            (data) => this.economyParams = data,
        ));
    }

    nextPhase() {
        this.economyFileService.economyFileUpdated.next(this.economyParams);
        this.phase5.emit(true);
    }

    changeCheckBoxVal(id) {
        this.checkVal[id] = !this.checkVal[id];
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
