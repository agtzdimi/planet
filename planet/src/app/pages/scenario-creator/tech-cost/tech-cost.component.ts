import { Component, OnChanges, EventEmitter, Input, Output } from '@angular/core';
import { EconomyFileService } from '../../../@theme/services/scenario-manager-services/economy-file.service';

@Component({
    selector: 'ngx-tech-cost',
    styleUrls: ['./tech-cost.component.scss'],
    templateUrl: './tech-cost.component.html',
})
export class TechCostComponent implements OnChanges {

    checkVal: boolean[] = [];
    economyParams: Object;
    CHECKBOX_COUNT = 5;
    @Output() phase5: EventEmitter<Boolean>;
    @Input() isLoadModule: Boolean;

    constructor(private economyFileService: EconomyFileService) {
        for (let i = 0; i < this.CHECKBOX_COUNT; i++) {
            this.checkVal.push(false);
        }
        this.phase5 = new EventEmitter<Boolean>();
        this.economyParams = this.economyFileService.economyFile;

        this.economyFileService.economyFileUpdated.subscribe(
            (data) => this.economyParams = data,
        );
    }

    ngOnChanges() {

    }

    nextPhase() {
        this.economyFileService.economyFileUpdated.emit(this.economyParams);
        this.phase5.emit(true);
    }

    changeCheckBoxVal(id) {
        this.checkVal[id] = !this.checkVal[id];
    }
}
