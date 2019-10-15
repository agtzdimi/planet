import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
    selector: 'ngx-scen-panel-sim-icon',
    template: `
  <nb-icon *ngIf="value" icon="checkmark-circle-outline" status="primary"></nb-icon>
  <nb-icon *ngIf="!value" icon="close-circle-outline" status="primary"></nb-icon>
 `,
})
export class ScenPanelSimIconComponent implements ViewCell, OnInit {

    @Input() value: any;    // This hold the cell value
    @Input() rowData: any;  // This holds the entire row object

    constructor() {
    }

    ngOnInit() {
    }

}
