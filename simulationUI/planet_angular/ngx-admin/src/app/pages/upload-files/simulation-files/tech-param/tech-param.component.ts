import { Component, Input, EventEmitter, Output, SimpleChanges, OnChanges, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-tech-param',
    styleUrls: ['./tech-param.component.scss'],
    templateUrl: './tech-param.component.html',
})
export class TechParamComponent implements OnInit, OnChanges {

    checkVal: boolean[] = [];
    @Input() data: Object;
    @Output() dataChange: EventEmitter<Object>;
    nodeData: any;
    displayingNode: string;
    nodes = [];
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
                'technologies': {
                    'node.1': {
                        'PV': {
                            'nominal.electric.power': '',
                        },
                        'WT': {
                            'nominal.electric.power': '',
                        },
                        'CHP': {
                            'nominal.electric.power': '',
                            'efficiency.electric': '',
                            'efficiency.thermal': '',
                        },
                        'P2H': {
                            'DH': {
                                'HP': {
                                    'nominal.heat.power': '',
                                    'cop': '',
                                },
                                'EH': {
                                    'nominal.heat.power': '',
                                    'efficiency.thermal': '',
                                },
                            },
                            'LHD': {
                                'HP': {
                                    'nominal.heat.power': '',
                                    'cop': 3,
                                },
                                'EH': {
                                    'nominal.heat.power': '',
                                    'efficiency.thermal': '',
                                },
                            },
                        },
                        'P2G': {
                            'nominal.electric.power': '',
                            'efficiency.electrolysis': '',
                            'efficiency.methanation': '',
                            'efficiency.thermal': '',
                        },
                        'EB': {
                            'storage.electric.capacity': '',
                            'efficiency.charge': '',
                            'efficiency.discharge': '',
                            'c.rate': '',
                        },
                        'G2H': {
                            'DH': {
                                'nomial.heat.power': '',
                                'efficiency.thermal': '',
                            },
                            'LHD': {
                                'nomial.heat.power': '',
                                'efficiency.thermal': '',
                            },
                        },
                    },
                },
            },
        };
    }

    ngOnChanges(changes: SimpleChanges) {
        this.afterDataRecieved(changes.data.currentValue);
    }

    afterDataRecieved(data) {
        this.nodeData = data;
        if (this.nodeData.payload.technologies) {
            this.nodes = Object.getOwnPropertyNames(this.nodeData.payload.technologies);
            this.displayingNode = this.nodes[0];
        }
        this.dataChange.emit(this.nodeData)
    }

    setPeriodAngGetData(value: string): void {
        this.displayingNode = value;
    }

    changeCheckBoxVal(id) {
        this.checkVal[id] = !this.checkVal[id]
    }

}
