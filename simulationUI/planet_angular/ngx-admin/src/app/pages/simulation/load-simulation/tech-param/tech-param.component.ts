import { Component, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';

@Component({
    selector: 'ngx-tech-param',
    styleUrls: ['./tech-param.component.scss'],
    templateUrl: './tech-param.component.html',
})
export class TechParamComponent implements OnChanges {

    checkVal: Object = {};
    @Input() data: Object;
    @Input() defaultValues: boolean;
    @Input() pvParam: Object;
    @Input() windParam: Object;
    @Output() dataChange: EventEmitter<Object>;
    @Output() pvChange: EventEmitter<Object>;
    @Output() windChange: EventEmitter<Object>;
    @Output() phase3: EventEmitter<Boolean>;
    nodeData: Object = {};
    nodeWindParam: Object = {};
    nodePvParam: Object = {};
    displayingNode: string;
    nodes = [];
    CHECKBOX_COUNT = 7;
    NODES_COUNT = 8;
    trackingOptions = ['None', '1-axis (azimuth)', '2-axis (tilt & azimuth)'];
    pvCapacity = 1;
    hubHeight = 80;
    windCapacity = 1;
    systemLoss = 10;
    tilt = 35;
    azimuth = 180;
    turbineModels = [];

    constructor() {
        this.turbineModels = ['Vestas V90 2000', 'Vestas V47 660', 'Vestas V164 7000', 'Siemens SWT 2.3 93',
            'REpower 5M', 'GE 1.5sle', 'Enercon E82 2000', 'Enercon E126 6500', 'Acciona AW77 1500',
            'Alstom Eco 74', 'Alstom Eco 80', 'Alstom Eco 110', 'Bonus B23 150', 'Bonus B33 300',
            'Bonus B37 450', 'Bonus B41 500', 'Bonus B44 600', 'Bonus B54 1000', 'Bonus B62 1300',
            'Bonus B82 2300', 'Dewind D4 41 500', 'Dewind D6 1000', 'Enercon E40 500', 'Enercon E40 600',
            'Enercon E44 900', 'Enercon E48 800', 'Enercon E53 800', 'Enercon E66 1500', 'Enercon E66 1800',
            'Enercon E66 2000', 'Enercon E70 2000', 'Enercon E70 2300', 'Enercon E82 1800', 'Enercon E82 2300',
            'Enercon E82 3000', 'Enercon E92 2300', 'Enercon E92 2350', 'Enercon E101 3000', 'Enercon E112 4500',
            'Enercon E126 7000', 'Enercon E126 7500', 'EWT DirectWind 52 900', 'Gamesa G47 660', 'Gamesa G52 850',
            'Gamesa G58 850', 'Gamesa G80 2000', 'Gamesa G87 2000', 'Gamesa G90 2000', 'Gamesa G128 4500',
            'GE 900S', 'GE 1.5s', 'GE 1.5se', 'GE 1.5sl', 'GE 1.5xle', 'GE 1.6', 'GE 1.7', 'GE 2.5xl', 'GE 2.75 103',
            'Goldwind GW82 1500', 'NEG Micon M1500 500', 'NEG Micon M1500 750', 'NEG Micon NM48 750',
            'NEG Micon NM52 900', 'NEG Micon NM60 1000', 'NEG Micon NM64c 1500',
            'NEG Micon NM80 2750', 'Nordex N27 150', 'Nordex N29 250', 'Nordex N43 600', 'Nordex N50 800',
            'Nordex N60 1300', 'Nordex N80 2500', 'Nordex N90 2300', 'Nordex N90 2500', 'Nordex N100 2500',
            'Nordex N131 3000', 'Nordex N131 3300', 'Nordtank NTK500', 'Nordtank NTK600', 'PowerWind 56 900',
            'REpower MD70 1500', 'REPower MD77 1500', 'REpower MM70 2000', 'REpower MM82 2000',
            'REpower MM92 2000', 'REpower 3 4M', 'REpower 6M', 'Siemens SWT 1.3 62', 'Siemens SWT 2.3',
            'Siemens SWT 2.3 101', 'Siemens SWT 3.0 101', 'Siemens SWT 3.6 107', 'Siemens SWT 3.6 120',
            'Siemens SWT 4.0 130', 'Suzlon S88 2100', 'Suzlon S97 2100', 'Tacke TW600 43', 'Vestas V27 225',
            'Vestas V29 225', 'Vestas V39 500', 'Vestas V42 600', 'Vestas V44 600', 'Vestas V52 850',
            'Vestas V66 1650', 'Vestas V66 1750', 'Vestas V66 2000', 'Vestas V80 1800', 'Vestas V80 2000',
            'Vestas V90 1800', 'Vestas V90 3000', 'Vestas V100 1800', 'Vestas V100 2000', 'Vestas V110 2000',
            'Vestas V112 3000', 'Vestas V112 3300', 'Wind World W3700', 'Wind World W4200', 'Windmaster WM28 300',
            'Windmaster WM43 750', 'Windflow 500', 'XANT M21 100'];

        for (let i = 0; i < this.NODES_COUNT; i++) {
            this.checkVal['node.' + (i + 1)] = {};
            for (let j = 0; j < this.CHECKBOX_COUNT; j++) {
                this.checkVal['node.' + (i + 1)][j] = false;
            }
        }

        for (let i = 0; i < this.NODES_COUNT; i++) {
            this.nodeWindParam['node.' + (i + 1)] = {
                'year': 2016,
                'capacity': 1,
                'hub.height': 80,
                'turbine.model': 'Vestas+V80+2000',
            };
            this.nodePvParam['node.' + (i + 1)] = {
                'year': 2016,
                'capacity': 1,
                'system.loss': 10,
                'tracking': 0,
                'tilt': 35,
                'azimuth': 180,
            };
        }
        this.data = {};
        this.dataChange = new EventEmitter<Object>();
        this.pvChange = new EventEmitter<Object>();
        this.windChange = new EventEmitter<Object>();
        this.phase3 = new EventEmitter<Boolean>();
        for (let i = 0; i < this.NODES_COUNT; i++) {
            this.nodeData['node.' + (i + 1)] = {};
            this.nodeData['node.' + (i + 1)]['PV'] = {
                'nominal.electric.power': 0,
            };
            this.nodeData['node.' + (i + 1)]['WT'] = {
                'nominal.electric.power': 0,
            };
            this.nodeData['node.' + (i + 1)]['CHP'] = {
                'nominal.electric.power': 0,
                'efficiency.electric': 0,
                'efficiency.thermal': 0,
            };
            this.nodeData['node.' + (i + 1)]['P2H'] = { 'DH': {}, 'LHD': {} };
            this.nodeData['node.' + (i + 1)]['P2H']['DH']['HP'] = {
                'nominal.heat.power': 0,
                'cop': 0,
            };
            this.nodeData['node.' + (i + 1)]['P2H']['DH']['EH'] = {
                'nominal.heat.power': 0,
                'efficiency.thermal': 0,
            };
            this.nodeData['node.' + (i + 1)]['P2H']['LHD']['HP'] = {
                'nominal.heat.power': 0,
                'cop': 0,
            };
            this.nodeData['node.' + (i + 1)]['P2H']['LHD']['EH'] = {
                'nominal.heat.power': 0,
                'efficiency.thermal': 0,
            };
            this.nodeData['node.' + (i + 1)]['P2G'] = {
                'nominal.electric.power': 0,
                'efficiency.electrolysis': 0,
                'efficiency.methanation': 0,
                'efficiency.thermal': 0,
            };
            this.nodeData['node.' + (i + 1)]['EB'] = {
                'storage.electric.capacity': 0,
                'efficiency.charge': 0,
                'efficiency.discharge': 0,
                'c.rate': 0,
            };
            this.nodeData['node.' + (i + 1)]['G2H'] = { 'DH': {}, 'LHD': {} };
            this.nodeData['node.' + (i + 1)]['G2H']['DH'] = {
                'nomial.heat.power': 0,
                'efficiency.thermal': 0,
            };
            this.nodeData['node.' + (i + 1)]['G2H']['LHD'] = {
                'nomial.heat.power': 0,
                'efficiency.thermal': 0,
            };
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.afterNodeDataRecieved(changes.data.currentValue);
        this.afterWindDataRecieved(changes.windParam.currentValue);
        this.afterPvDataRecieved(changes.pvParam.currentValue);
        if (this.defaultValues) {
            for (let i = 0; i < this.NODES_COUNT; i++) {
                this.displayingNode = 'node.' + (i + 1);
                for (let j = 0; j < this.CHECKBOX_COUNT; j++) {
                    this.checkVal['node.' + (i + 1)][j] = true;
                    this.updateDefaultValues(j, true);
                }
            }
            this.displayingNode = 'node.1';
        }
    }

    afterWindDataRecieved(data) {
        this.nodeWindParam['lat'] = data.payload['lat'];
        this.nodeWindParam['lon'] = data.payload['lon'];
        data.payload = this.nodeWindParam;
        this.pvChange.emit(this.nodeWindParam);
    }

    afterPvDataRecieved(data) {
        this.nodePvParam['lat'] = data.payload['lat'];
        this.nodePvParam['lon'] = data.payload['lon'];
        data.payload = this.nodePvParam;
        this.pvChange.emit(this.nodePvParam);
    }

    afterNodeDataRecieved(data) {
        data.payload['technologies'] = this.nodeData;
        this.nodeData = data;
        if (this.nodeData['payload'].technologies) {
            this.nodes = Object.getOwnPropertyNames(this.nodeData['payload'].technologies);
            this.displayingNode = this.nodes[0];
        }
        this.dataChange.emit(this.nodeData);
    }

    setPeriodAngGetData(value: string): void {
        this.displayingNode = value;
    }

    changeCheckBoxVal(id) {
        this.checkVal[this.displayingNode][id] = !this.checkVal[this.displayingNode][id];
        if (this.checkVal[this.displayingNode][id] && this.defaultValues) {
            this.updateDefaultValues(id, true);
        } else {
            this.updateDefaultValues(id, false);
        }
    }

    updateDefaultValues(id, flag) {
        switch (id) {
            case 0:
                if (flag) {
                    this.nodeData['payload']['technologies'][this.displayingNode]['PV'] = {
                        'nominal.electric.power': 100,
                    };
                } else {
                    this.nodeData['payload']['technologies'][this.displayingNode]['PV'] = {
                        'nominal.electric.power': 0,
                    };
                }
                break;
            case 1:
                if (flag) {
                    this.nodeData['payload']['technologies'][this.displayingNode]['WT'] = {
                        'nominal.electric.power': 100,
                    };
                } else {
                    this.nodeData['payload']['technologies'][this.displayingNode]['WT'] = {
                        'nominal.electric.power': 0,
                    };
                }
                break;
            case 2:
                if (flag) {
                    this.nodeData['payload']['technologies'][this.displayingNode]['CHP'] = {
                        'nominal.electric.power': 80,
                        'efficiency.electric': 40,
                        'efficiency.thermal': 45,
                    };
                } else {
                    this.nodeData['payload']['technologies'][this.displayingNode]['CHP'] = {
                        'nominal.electric.power': 0,
                        'efficiency.electric': 0,
                        'efficiency.thermal': 0,
                    };
                }
                break;
            case 3:
                if (flag) {
                    this.nodeData['payload']['technologies'][this.displayingNode]['P2H']['DH']['HP'] = {
                        'nominal.heat.power': 15,
                        'cop': 3,
                    };
                    this.nodeData['payload']['technologies'][this.displayingNode]['P2H']['DH']['EH'] = {
                        'nominal.heat.power': 10,
                        'efficiency.thermal': 98,
                    };
                    this.nodeData['payload']['technologies'][this.displayingNode]['P2H']['LHD']['HP'] = {
                        'nominal.heat.power': 15,
                        'cop': 3,
                    };
                    this.nodeData['payload']['technologies'][this.displayingNode]['P2H']['LHD']['EH'] = {
                        'nominal.heat.power': 10,
                        'efficiency.thermal': 98,
                    };
                } else {
                    this.nodeData['payload']['technologies'][this.displayingNode]['P2H']['DH']['HP'] = {
                        'nominal.heat.power': 0,
                        'cop': 0,
                    };
                    this.nodeData['payload']['technologies'][this.displayingNode]['P2H']['DH']['EH'] = {
                        'nominal.heat.power': 0,
                        'efficiency.thermal': 0,
                    };
                    this.nodeData['payload']['technologies'][this.displayingNode]['P2H']['LHD']['HP'] = {
                        'nominal.heat.power': 0,
                        'cop': 0,
                    };
                    this.nodeData['payload']['technologies'][this.displayingNode]['P2H']['LHD']['EH'] = {
                        'nominal.heat.power': 0,
                        'efficiency.thermal': 0,
                    };
                }
                break;
            case 4:
                if (flag) {
                    this.nodeData['payload']['technologies'][this.displayingNode]['P2G'] = {
                        'nominal.electric.power': 25,
                        'efficiency.electrolysis': 75,
                        'efficiency.methanation': 80,
                        'efficiency.thermal': 24,
                    };
                } else {
                    this.nodeData['payload']['technologies'][this.displayingNode]['P2G'] = {
                        'nominal.electric.power': 0,
                        'efficiency.electrolysis': 0,
                        'efficiency.methanation': 0,
                        'efficiency.thermal': 0,
                    };
                }
                break;
            case 5:
                if (flag) {
                    this.nodeData['payload']['technologies'][this.displayingNode]['EB'] = {
                        'storage.electric.capacity': 100,
                        'efficiency.charge': 92.1,
                        'efficiency.discharge': 92.1,
                        'c.rate': 0.25,
                    };
                } else {
                    this.nodeData['payload']['technologies'][this.displayingNode]['EB'] = {
                        'storage.electric.capacity': 0,
                        'efficiency.charge': 0,
                        'efficiency.discharge': 0,
                        'c.rate': 0,
                    };
                }
                break;
            case 6:
                if (flag) {
                    this.nodeData['payload']['technologies'][this.displayingNode]['G2H']['DH'] = {
                        'nomial.heat.power': 180,
                        'efficiency.thermal': 90,
                    };
                    this.nodeData['payload']['technologies'][this.displayingNode]['G2H']['LHD'] = {
                        'nomial.heat.power': 100,
                        'efficiency.thermal': 90,
                    };
                } else {
                    this.nodeData['payload']['technologies'][this.displayingNode]['G2H']['DH'] = {
                        'nomial.heat.power': 0,
                        'efficiency.thermal': 0,
                    };
                    this.nodeData['payload']['technologies'][this.displayingNode]['G2H']['LHD'] = {
                        'nomial.heat.power': 0,
                        'efficiency.thermal': 0,
                    };
                }
                break;
        }
    }

    nextPhase() {
        this.phase3.emit(true);
    }

}
