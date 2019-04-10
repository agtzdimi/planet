import { Component, Input, EventEmitter, Output, SimpleChanges, OnChanges, AfterViewChecked, OnInit } from '@angular/core';
import { Model1ParamInitService } from '../services/model1-param-init.service';
import { Model2ParamInitService } from '../services/model2-param-init.service';
import { GeneralParamsService } from '../services/general-params.service';

@Component({
    selector: 'ngx-tech-param',
    styleUrls: ['./tech-param.component.scss'],
    templateUrl: './tech-param.component.html',
})
export class TechParamComponent implements OnChanges, AfterViewChecked, OnInit {

    checkVal: Object = {};
    @Input() pvParam: Object;
    @Input() windParam: Object;
    @Input() isLoadModule: Boolean;
    @Output() pvChange: EventEmitter<Object>;
    @Output() windChange: EventEmitter<Object>;
    @Output() phase3: EventEmitter<Boolean>;
    nodeWindParam: Object = {};
    nodePvParam: Object = {};
    displayingNode: string;
    nodes = [];
    CHECKBOX_COUNT = 7;
    hubHeight = 80;
    turbineModels = [];
    currentTab = 'Electric Grid';
    g2h = {
        'centralised': true,
        'localised': true,
    };
    paramInit = {};
    currentModel = 0;

    constructor(private model2: Model2ParamInitService,
        private generalParams: GeneralParamsService,
        private model1: Model1ParamInitService) {
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

        this.getNodesNames();
        this.pvChange = new EventEmitter<Object>();
        this.windChange = new EventEmitter<Object>();
        this.phase3 = new EventEmitter<Boolean>();
        this.model2.paramUpdated.subscribe(
            (data) => {
                if (this.currentModel !== 2 || this.isLoadModule) {
                    this.getNodesNames();
                    this.paramInit = data;
                    this.initializeValues();
                    this.currentModel = 2;
                }
            },
        );

        this.model1.paramUpdated.subscribe(
            (data) => {
                if (this.currentModel !== 1 || this.isLoadModule) {
                    this.getNodesNames();
                    this.paramInit = data;
                    this.initializeValues();
                    this.currentModel = 1;
                }
            },
        );

        this.generalParams.startingDateUpdate.subscribe(
            (data) => this.generalParams.startingDate = data,
        );

        this.generalParams.endingDateUpdate.subscribe(
            (data) => this.generalParams.endingDate = data,
        );

        this.generalParams.updateIsDefault.subscribe(
            (data) => this.generalParams.isDefault = data,
        );

        this.generalParams.modelUpdate.subscribe(
            (data) => this.generalParams.model = data,
        );

    }

    ngOnInit() {
        if (!this.paramInit['payload']) {
            if (this.generalParams.model === 1) {
                this.paramInit = this.model1.paramInit;
            } else if (this.generalParams.model === 2) {
                this.paramInit = this.model2.paramInit;
            }

        }
    }

    ngAfterViewChecked() {
        this.initializeValues();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.pvParam) {
            this.afterWindDataRecieved(changes.windParam.currentValue);
            this.afterPvDataRecieved(changes.pvParam.currentValue);
            if (this.generalParams.isDefault) {
                for (let i = 0; i < this.nodes.length; i++) {
                    this.displayingNode = 'node.' + (i + 1);
                    for (let j = 0; j < this.CHECKBOX_COUNT; j++) {
                        if (this.generalParams.model === 1) {
                            this.model1.updateDefaultValues(j, true, this.displayingNode);
                        } else if (this.generalParams.model === 2) {
                            this.model2.updateDefaultValues(j, true, this.displayingNode);
                        }
                    }
                }
                this.displayingNode = 'node.1';
            }
        }
    }

    getNodesNames() {
        this.displayingNode = 'node.1';
        if (this.generalParams.model === 1) {
            this.nodes = Object.getOwnPropertyNames(this.model1.paramInit['payload']['electric.grid']);
        } else if (this.generalParams.model === 2) {
            this.nodes = Object.getOwnPropertyNames(this.model2.paramInit['payload']['electric.grid']);
        }

        for (let i = 0; i < this.nodes.length; i++) {
            this.checkVal['node.' + (i + 1)] = {};
        }

        for (let i = 0; i < this.nodes.length; i++) {
            this.nodeWindParam['node.' + (i + 1)] = {
                'startDate': this.generalParams.startingDate,
                'endDate': this.generalParams.endingDate,
                'capacity': 1,
                'hub.height': 80,
                'turbine.model': 'Vestas+V80+2000',
            };
            this.nodePvParam['node.' + (i + 1)] = {
                'startDate': this.generalParams.startingDate,
                'endDate': this.generalParams.endingDate,
                'capacity': 1,
                'system.loss': 10,
                'tracking': 0,
                'tilt': 35,
                'azimuth': 180,
            };
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

    initializeValues() {
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = 0; j < this.CHECKBOX_COUNT; j++) {
                switch (j) {
                    case 0:
                        if (this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['PV']['nominal.electric.power'] === 0
                            && this.checkVal['node.' + (i + 1)][j] !== true) {
                            this.checkVal['node.' + (i + 1)][j] = false;
                        } else {
                            this.checkVal['node.' + (i + 1)][j] = true;
                        }
                        break;
                    case 1:
                        if (this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['WT']['nominal.electric.power'] === 0
                            && this.checkVal['node.' + (i + 1)][j] !== true) {
                            this.checkVal['node.' + (i + 1)][j] = false;
                        } else {
                            this.checkVal['node.' + (i + 1)][j] = true;
                        }
                        break;
                    case 2:
                        if (this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['CHP']['nominal.electric.power'] === 0
                            && this.checkVal['node.' + (i + 1)][j] !== true) {
                            this.checkVal['node.' + (i + 1)][j] = false;
                        } else {
                            this.checkVal['node.' + (i + 1)][j] = true;
                        }
                        break;
                    case 3:
                        if (this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['P2H']['DH']['HP']['nominal.heat.power']
                            === 0 &&
                            this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['P2H']['DH']['EH']['nominal.heat.power']
                            === 0 &&
                            this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['P2H']['LHD']['HP']['nominal.heat.power']
                            === 0 &&
                            this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['P2H']['LHD']['EH']['nominal.heat.power']
                            === 0
                            && this.checkVal['node.' + (i + 1)][j] !== true) {
                            this.checkVal['node.' + (i + 1)][j] = false;
                        } else {
                            this.checkVal['node.' + (i + 1)][j] = true;
                        }
                        break;
                    case 4:
                        if (this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['P2G']['nominal.electric.power'] === 0
                            && this.checkVal['node.' + (i + 1)][j] !== true) {
                            this.checkVal['node.' + (i + 1)][j] = false;
                        } else {
                            this.checkVal['node.' + (i + 1)][j] = true;
                        }
                        break;
                    case 5:
                        if (this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['EB']['storage.electric.capacity'] === 0
                            && this.checkVal['node.' + (i + 1)][j] !== true) {
                            this.checkVal['node.' + (i + 1)][j] = false;
                        } else {
                            this.checkVal['node.' + (i + 1)][j] = true;
                        }
                        break;
                }
            }
        }
    }

    changeCheckBoxVal(id) {
        this.checkVal[this.displayingNode][id] = !this.checkVal[this.displayingNode][id];
        let flag: boolean;
        if (this.checkVal[this.displayingNode][id] && this.generalParams.isDefault) {
            flag = true;
        } else {
            flag = false;
        }

        if (this.generalParams.model === 1) {
            this.model1.updateDefaultValues(id, flag, this.displayingNode);
        } else if (this.generalParams.model === 2) {
            this.model2.updateDefaultValues(id, flag, this.displayingNode);
        }
    }

    nextPhase() {
        if (this.generalParams.model === 1) {
            this.model1.paramUpdated.emit(this.paramInit);
        } else if (this.generalParams.model === 2) {
            this.model2.paramUpdated.emit(this.paramInit);
        }
        this.phase3.emit(true);
    }

    changeNode(node: string): void {
        this.displayingNode = node;
    }

    changeTab(event) {
        this.currentTab = event.tabTitle;
    }

    changeG2H(id) {
        if (id === 1) {
            this.g2h['centralised'] = !this.g2h['centralised'];
            this.emitG2H(1, 'centralised');
        } else {
            this.g2h['localised'] = !this.g2h['localised'];
            this.emitG2H(2, 'localised');
        }
    }

    emitG2H(id, heatType) {
        if (this.generalParams.model === 1) {
            this.model1.updateG2HValues(id, this.g2h[heatType]);
        } else if (this.generalParams.model === 2) {
            this.model2.updateG2HValues(id, this.g2h[heatType]);
        }
    }

}
