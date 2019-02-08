import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';

@Component({
    selector: 'ngx-tech-cost',
    styleUrls: ['./tech-cost.component.scss'],
    templateUrl: './tech-cost.component.html',
})
export class TechCostComponent implements OnChanges {

    checkVal: boolean[] = [];
    @Input() data: Object;
    @Output() dataChange: EventEmitter<Object>;
    nodeData: any;
    CHECKBOX_COUNT = 6;

    constructor() {
        for (let i = 0; i < this.CHECKBOX_COUNT; i++) {
            this.checkVal.push(false);
        }
        this.data = {};
        this.dataChange = new EventEmitter<Object>();
        this.nodeData = {
            'file.name': 'Economy_environment_initialization',
            'payload': {
                'NG.cost': 50,
                'SNG.cost': 50,
                'heat.cost': 45,
                'carbon.tax': 15,
                'NG.emission.factor': 0.2012,

                'technologies.cost': {
                    'WT': {
                        'CAPEX': 1100,
                        'OPEX': 3.5,
                        'life.time': 25,
                    },
                    'PV': {
                        'CAPEX': 800,
                        'OPEX': 1.5,
                        'life.time': 30,
                    },
                    'CHP': {
                        'CAPEX': 900,
                        'OPEX': 3,
                        'life.time': 20,
                    },
                    'HP': {
                        'CAPEX': 2900,
                        'OPEX': 2,
                        'life.time': 20,
                    },
                    'EH': {
                        'CAPEX': 100,
                        'OPEX': 1,
                        'life.time': 20,
                    },
                    'EB': {
                        'CAPEX': 250,
                        'OPEX': 1,
                        'life.time': 15,
                    },
                    'P2G': {
                        'CAPEX': 750,
                        'OPEX': 2,
                        'life.time': 20,
                    },
                },
            },
        };
    }

    ngOnChanges() {
        this.afterDataRecieved();
    }

    afterDataRecieved() {

        this.dataChange.emit(this.nodeData);
    }

    changeCheckBoxVal(id) {
        this.checkVal[id] = !this.checkVal[id];
    }
}
