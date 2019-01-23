import { Component, Input, Output, SimpleChanges, OnChanges, OnInit, EventEmitter } from '@angular/core';

@Component({
    selector: 'ngx-tech-cost',
    styleUrls: ['./tech-cost.component.scss'],
    templateUrl: './tech-cost.component.html',
})
export class TechCostComponent implements OnInit, OnChanges {

    checkVal: boolean[] = [];
    @Input() data: Object;
    @Output() dataChange: EventEmitter<Object>;
    nodeData: any;
    CHECKBOX_COUNT = 6

    constructor() {
        for (let i = 0; i < this.CHECKBOX_COUNT; i++) {
            this.checkVal.push(false);
        }
        this.data = {};
        this.dataChange = new EventEmitter<Object>();
    }

    ngOnInit() {
        this.nodeData = {
            'payload': {
                "technologies.cost": {
                    "WT": {
                        "CAPEX": "",
                        "OPEX": "",
                        "life.time": ""
                    },
                    "PV": {
                        "CAPEX": "",
                        "OPEX": "",
                        "life.time": ""
                    },
                    "CHP": {
                        "CAPEX": "",
                        "OPEX": "",
                        "life.time": ""
                    },
                    "HP": {
                        "CAPEX": "",
                        "OPEX": "",
                        "life.time": ""
                    },
                    "EH": {
                        "CAPEX": "",
                        "OPEX": "",
                        "life.time": ""
                    },
                    "EB": {
                        "CAPEX": "",
                        "OPEX": "",
                        "life.time": ""
                    },
                    "P2G": {
                        "CAPEX": "",
                        "OPEX": "",
                        "life.time": ""
                    }
                }
            }
        };
    }

    ngOnChanges(changes: SimpleChanges) {
        this.afterDataRecieved(changes.data.currentValue);
    }

    afterDataRecieved(data: Object) {
        this.nodeData = data;
        this.dataChange.emit(this.nodeData)
    }

    changeCheckBoxVal(id) {
        this.checkVal[id] = !this.checkVal[id]
    }
}