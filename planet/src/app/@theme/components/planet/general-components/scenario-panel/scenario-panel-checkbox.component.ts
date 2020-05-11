import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from '@mykeels/ng2-smart-table';
import { CheckBoxesService } from './scenario-panel-checkboxes-values.service';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'ngx-scen-panel-checkbox',
    template: `
  <nb-checkbox style="padding-left: 2.4rem;" status="primary" [checked]="value" (change)="valueChanged($event)" [formControl]="myCheckbox"></nb-checkbox>
 `,
})
export class ScenPanelCheckBoxComponent implements ViewCell, OnInit {

    @Input() value: any;    // This hold the cell value
    @Input() rowData: any;  // This holds the entire row object
    checkboxes;
    myCheckbox: FormControl = new FormControl();
    scenarioType = 'single';

    constructor(private checkBoxesService: CheckBoxesService) {

        this.checkBoxesService.checkboxesUpdated.subscribe(
            (data) => {
                this.checkboxes = data;
                if (data['scenarioType']) {
                    this.scenarioType = data['scenarioType'];
                } else {
                    const checkboxVal = this.checkboxes.find(row => {
                        if (this.rowData['id'] === row['id']) {
                            return row;
                        }
                    });
                    this.myCheckbox.setValue(checkboxVal['value']);
                }
            },
        );
    }

    ngOnInit() {
        this.checkBoxesService.addCheckBox(this.rowData['id']);
    }

    addCheckBoxes() {
        this.checkBoxesService.addCheckBox(this.rowData['id']);
    }

    valueChanged(checkBoxValue) {
        this.checkBoxesService.changeCheckBoxValue(this.scenarioType, this.rowData['id'], checkBoxValue.target.checked);
    }

}
