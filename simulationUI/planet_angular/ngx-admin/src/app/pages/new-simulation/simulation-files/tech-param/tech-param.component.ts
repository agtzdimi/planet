import { Component, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';

@Component({
    selector: 'ngx-tech-param',
    styleUrls: ['./tech-param.component.scss'],
    templateUrl: './tech-param.component.html',
})
export class TechParamComponent implements OnChanges {

    checkVal: Object = {};
    @Input() data: Object;
    @Output() dataChange: EventEmitter<Object>;
    @Output() phase3: EventEmitter<Boolean>;
    nodeData: any;
    displayingNode: string;
    nodes = [];
    CHECKBOX_COUNT = 6;
    NODES_COUNT = 8;
    years = [];
    trackingOptions = ['None', '1-axis (azimuth)', '2-axis (tilt & azimuth)'];
    capacity = 1;
    systemLoss = 10;
    tilt = 35;
    azimuth = 180;

    constructor() {
        for (let i = 2000; i <= 2016; i++) {
            this.years.push(i);
        }

        for (let i = 0; i < this.NODES_COUNT; i++) {
            this.checkVal['node.' + (i + 1)] = {};
            for (let j = 0; j < this.CHECKBOX_COUNT; j++) {
                this.checkVal['node.' + (i + 1)][j] = false;
            }
        }
        this.data = {};
        this.dataChange = new EventEmitter<Object>();
        this.phase3 = new EventEmitter<Boolean>();
        this.nodeData = {
            'node.1': {

                'PV': {
                    'nominal.electric.power': 100,
                },

                'WT': {
                    'nominal.electric.power': 150,
                },

                'CHP': {
                    'nominal.electric.power': 80,
                    'efficiency.electric': 40,
                    'efficiency.thermal': 45,
                },

                'P2H': {
                    'DH': {
                        'HP': {
                            'nominal.heat.power': 15,
                            'cop': 3,
                        },
                        'EH': {
                            'nominal.heat.power': 10,
                            'efficiency.thermal': 98,
                        },
                    },
                    'LHD': {
                        'HP': {
                            'nominal.heat.power': 15,
                            'cop': 3,
                        },
                        'EH': {
                            'nominal.heat.power': 10,
                            'efficiency.thermal': 98,
                        },
                    },
                },

                'P2G': {
                    'nominal.electric.power': 25,
                    'efficiency.electrolysis': 75,
                    'efficiency.methanation': 80,
                    'efficiency.thermal': 24,
                },

                'EB': {
                    'storage.electric.capacity': 100,
                    'efficiency.charge': 92.1,
                    'efficiency.discharge': 92.1,
                    'c.rate': 0.25,
                },

                'G2H': {
                    'DH': {
                        'nomial.heat.power': 180,
                        'efficiency.thermal': 90,
                    },

                    'LHD': {
                        'nomial.heat.power': 100,
                        'efficiency.thermal': 90,
                    },
                },
            },


            'node.2': {

                'PV': {
                    'nominal.electric.power': 100,
                },

                'WT': {
                    'nominal.electric.power': 130,
                },

                'CHP': {
                    'nominal.electric.power': 80,
                    'efficiency.electric': 40,
                    'efficiency.thermal': 45,
                },

                'P2H': {
                    'DH': {
                        'HP': {
                            'nominal.heat.power': 15,
                            'cop': 3,
                        },
                        'EH': {
                            'nominal.heat.power': 10,
                            'efficiency.thermal': 98,
                        },
                    },
                    'LHD': {
                        'HP': {
                            'nominal.heat.power': 15,
                            'cop': 3,
                        },
                        'EH': {
                            'nominal.heat.power': 10,
                            'efficiency.thermal': 98,
                        },
                    },
                },

                'P2G': {
                    'nominal.electric.power': 25,
                    'efficiency.electrolysis': 75,
                    'efficiency.methanation': 80,
                    'efficiency.thermal': 24,
                },

                'EB': {
                    'storage.electric.capacity': 100,
                    'efficiency.charge': 92.1,
                    'efficiency.discharge': 92.1,
                    'c.rate': 0.25,
                },

                'G2H': {
                    'DH': {
                        'nomial.heat.power': 180,
                        'efficiency.thermal': 90,
                    },

                    'LHD': {
                        'nomial.heat.power': 100,
                        'efficiency.thermal': 90,
                    },
                },
            },


            'node.3': {

                'PV': {
                    'nominal.electric.power': 100,
                },

                'WT': {
                    'nominal.electric.power': 120,
                },

                'CHP': {
                    'nominal.electric.power': 80,
                    'efficiency.electric': 40,
                    'efficiency.thermal': 45,
                },

                'P2H': {
                    'DH': {
                        'HP': {
                            'nominal.heat.power': 15,
                            'cop': 3,
                        },
                        'EH': {
                            'nominal.heat.power': 10,
                            'efficiency.thermal': 98,
                        },
                    },
                    'LHD': {
                        'HP': {
                            'nominal.heat.power': 15,
                            'cop': 3,
                        },
                        'EH': {
                            'nominal.heat.power': 10,
                            'efficiency.thermal': 98,
                        },
                    },
                },

                'P2G': {
                    'nominal.electric.power': 25,
                    'efficiency.electrolysis': 75,
                    'efficiency.methanation': 80,
                    'efficiency.thermal': 24,
                },

                'EB': {
                    'storage.electric.capacity': 100,
                    'efficiency.charge': 92.1,
                    'efficiency.discharge': 92.1,
                    'c.rate': 0.25,
                },

                'G2H': {
                    'DH': {
                        'nomial.heat.power': 180,
                        'efficiency.thermal': 90,
                    },

                    'LHD': {
                        'nomial.heat.power': 100,
                        'efficiency.thermal': 90,
                    },
                },
            },


            'node.4': {

                'PV': {
                    'nominal.electric.power': 100,
                },

                'WT': {
                    'nominal.electric.power': 180,
                },

                'CHP': {
                    'nominal.electric.power': 80,
                    'efficiency.electric': 40,
                    'efficiency.thermal': 45,
                },

                'P2H': {
                    'DH': {
                        'HP': {
                            'nominal.heat.power': 15,
                            'cop': 3,
                        },
                        'EH': {
                            'nominal.heat.power': 10,
                            'efficiency.thermal': 98,
                        },
                    },
                    'LHD': {
                        'HP': {
                            'nominal.heat.power': 15,
                            'cop': 3,
                        },
                        'EH': {
                            'nominal.heat.power': 10,
                            'efficiency.thermal': 98,
                        },
                    },
                },

                'P2G': {
                    'nominal.electric.power': 25,
                    'efficiency.electrolysis': 75,
                    'efficiency.methanation': 80,
                    'efficiency.thermal': 24,
                },

                'EB': {
                    'storage.electric.capacity': 100,
                    'efficiency.charge': 92.1,
                    'efficiency.discharge': 92.1,
                    'c.rate': 0.25,
                },

                'G2H': {
                    'DH': {
                        'nomial.heat.power': 180,
                        'efficiency.thermal': 90,
                    },

                    'LHD': {
                        'nomial.heat.power': 100,
                        'efficiency.thermal': 90,
                    },
                },
            },


            'node.5': {

                'PV': {
                    'nominal.electric.power': 100,
                },

                'WT': {
                    'nominal.electric.power': 150,
                },

                'CHP': {
                    'nominal.electric.power': 80,
                    'efficiency.electric': 40,
                    'efficiency.thermal': 45,
                },

                'P2H': {
                    'DH': {
                        'HP': {
                            'nominal.heat.power': 15,
                            'cop': 3,
                        },
                        'EH': {
                            'nominal.heat.power': 10,
                            'efficiency.thermal': 98,
                        },
                    },
                    'LHD': {
                        'HP': {
                            'nominal.heat.power': 15,
                            'cop': 3,
                        },
                        'EH': {
                            'nominal.heat.power': 10,
                            'efficiency.thermal': 98,
                        },
                    },
                },

                'P2G': {
                    'nominal.electric.power': 25,
                    'efficiency.electrolysis': 75,
                    'efficiency.methanation': 80,
                    'efficiency.thermal': 24,
                },

                'EB': {
                    'storage.electric.capacity': 100,
                    'efficiency.charge': 92.1,
                    'efficiency.discharge': 92.1,
                    'c.rate': 0.25,
                },

                'G2H': {
                    'DH': {
                        'nomial.heat.power': 180,
                        'efficiency.thermal': 90,
                    },

                    'LHD': {
                        'nomial.heat.power': 100,
                        'efficiency.thermal': 90,
                    },
                },
            },


            'node.6': {

                'PV': {
                    'nominal.electric.power': 100,
                },

                'WT': {
                    'nominal.electric.power': 150,
                },

                'CHP': {
                    'nominal.electric.power': 80,
                    'efficiency.electric': 40,
                    'efficiency.thermal': 45,
                },

                'P2H': {
                    'DH': {
                        'HP': {
                            'nominal.heat.power': 15,
                            'cop': 3,
                        },
                        'EH': {
                            'nominal.heat.power': 10,
                            'efficiency.thermal': 98,
                        },
                    },
                    'LHD': {
                        'HP': {
                            'nominal.heat.power': 15,
                            'cop': 3,
                        },
                        'EH': {
                            'nominal.heat.power': 10,
                            'efficiency.thermal': 98,
                        },
                    },
                },

                'P2G': {
                    'nominal.electric.power': 25,
                    'efficiency.electrolysis': 75,
                    'efficiency.methanation': 80,
                    'efficiency.thermal': 24,
                },

                'EB': {
                    'storage.electric.capacity': 100,
                    'efficiency.charge': 92.1,
                    'efficiency.discharge': 92.1,
                    'c.rate': 0.25,
                },

                'G2H': {
                    'DH': {
                        'nomial.heat.power': 180,
                        'efficiency.thermal': 90,
                    },

                    'LHD': {
                        'nomial.heat.power': 100,
                        'efficiency.thermal': 90,
                    },
                },
            },


            'node.7': {

                'PV': {
                    'nominal.electric.power': 100,
                },

                'WT': {
                    'nominal.electric.power': 150,
                },

                'CHP': {
                    'nominal.electric.power': 80,
                    'efficiency.electric': 40,
                    'efficiency.thermal': 45,
                },

                'P2H': {
                    'DH': {
                        'HP': {
                            'nominal.heat.power': 15,
                            'cop': 3,
                        },
                        'EH': {
                            'nominal.heat.power': 10,
                            'efficiency.thermal': 98,
                        },
                    },
                    'LHD': {
                        'HP': {
                            'nominal.heat.power': 15,
                            'cop': 3,
                        },
                        'EH': {
                            'nominal.heat.power': 10,
                            'efficiency.thermal': 98,
                        },
                    },
                },

                'P2G': {
                    'nominal.electric.power': 25,
                    'efficiency.electrolysis': 75,
                    'efficiency.methanation': 80,
                    'efficiency.thermal': 24,
                },

                'EB': {
                    'storage.electric.capacity': 100,
                    'efficiency.charge': 92.1,
                    'efficiency.discharge': 92.1,
                    'c.rate': 0.25,
                },

                'G2H': {
                    'DH': {
                        'nomial.heat.power': 180,
                        'efficiency.thermal': 90,
                    },

                    'LHD': {
                        'nomial.heat.power': 100,
                        'efficiency.thermal': 90,
                    },
                },
            },


            'node.8': {

                'PV': {
                    'nominal.electric.power': 100,
                },

                'WT': {
                    'nominal.electric.power': 150,
                },

                'CHP': {
                    'nominal.electric.power': 80,
                    'efficiency.electric': 40,
                    'efficiency.thermal': 45,
                },

                'P2H': {
                    'DH': {
                        'HP': {
                            'nominal.heat.power': 15,
                            'cop': 3,
                        },
                        'EH': {
                            'nominal.heat.power': 10,
                            'efficiency.thermal': 98,
                        },
                    },
                    'LHD': {
                        'HP': {
                            'nominal.heat.power': 15,
                            'cop': 3,
                        },
                        'EH': {
                            'nominal.heat.power': 10,
                            'efficiency.thermal': 98,
                        },
                    },
                },

                'P2G': {
                    'nominal.electric.power': 25,
                    'efficiency.electrolysis': 75,
                    'efficiency.methanation': 80,
                    'efficiency.thermal': 24,
                },

                'EB': {
                    'storage.electric.capacity': 100,
                    'efficiency.charge': 92.1,
                    'efficiency.discharge': 92.1,
                    'c.rate': 0.25,
                },

                'G2H': {
                    'DH': {
                        'nomial.heat.power': 180,
                        'efficiency.thermal': 90,
                    },

                    'LHD': {
                        'nomial.heat.power': 100,
                        'efficiency.thermal': 90,
                    },
                },
            },
        };
    }

    ngOnChanges(changes: SimpleChanges) {
        this.afterDataRecieved(changes.data.currentValue);
    }

    afterDataRecieved(data) {
        data.payload['technologies'] = this.nodeData;
        this.nodeData = data;
        if (this.nodeData.payload.technologies) {
            this.nodes = Object.getOwnPropertyNames(this.nodeData.payload.technologies);
            this.displayingNode = this.nodes[0];
        }
        this.dataChange.emit(this.nodeData);
    }

    setPeriodAngGetData(value: string): void {
        this.displayingNode = value;
    }

    changeCheckBoxVal(id) {
        this.checkVal[this.displayingNode][id] = !this.checkVal[this.displayingNode][id];
    }

    nextPhase() {
        this.phase3.emit(true);
    }

}
