import {
    Component,
    Input,
    EventEmitter,
    Output,
    SimpleChanges,
    OnChanges,
    OnInit,
    AfterContentChecked,
    OnDestroy,
    AfterViewInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Model1ParamInitService } from '../../../@theme/services/scenario-manager-services/model1-param-init.service';
import { Model2ParamInitService } from '../../../@theme/services/scenario-manager-services/model2-param-init.service';
import { GeneralParamsService } from '../../../@theme/services/scenario-manager-services/general-params.service';


/**
 * Component responsible for configuring the ```Parameters_initialization.txt``` file
 */
@Component({
    selector: 'ngx-tech-param',
    styleUrls: ['./tech-param.component.scss'],
    templateUrl: './tech-param.component.html',
})
/**
 * @param {Object[]} checkVal Array holding the `switches` state per node @example checkVal['node.1'] = true
 * @param {Object} pvParam Variable to hold the necessary information to make a request to renewables Ninja API to retrieve PV timeseries
 * @param {Object} windParam Variable to hold the necessary information to make a request to renewables Ninja API to retrieve Wind timeseries
 * @param {boolean} isLoadModule Input Variable declaring if the component started on load scenario or not
 * @param {Subscription[]} subscriptions Private variable holding the custom Observables to unsubscribe when the component will be destroyed
 * @param {EventEmitter<Object>} pvChange Variable to emit changes in PV configuration for the renewable Ninja module
 * @param {EventEmitter<Object>} windChange Variable to emit changes in Wind configuration for the renewable Ninja module
 * @param {EventEmitter<boolean>} phase3 Variable emit true when the user proceed to the next phase. Available only in create scenario
 * @param {Object} nodeWindParam Array holding the Wind configuration for the renewables Ninja per node. Every node can have different configuration.
 *  Currently this is not applied and all nodes are automatically take the same value, but this functionality could change in the future
 * @param {Object} nodePvParam Array holding the PV configuration for the renewables Ninja per node. Every node can have different configuration.
 *  Currently this is not applied and all nodes are automatically take the same value, but this functionality could change in the future
 * @param {string} displayingNode Variable holding the currently selected node by the user @example 'node.1'
 * @param {boolean} displayContent Variable that will reveal the HTML of tech-param component after the AfterContentChecked hook
 *
 * @param {string[]} nodes Array that will hold the nodes of the user selected model. @example model2 -> ['node.1','node.2'....,'node.8']
 * @param {Array<any>} registeredDevices Variable that will be populated with the registered units on PLANET System.
 *  The units are referring to the flexibility units created in unit-management tab
 * @param {Object[]} unitSelectedPerNode Array holding the units selected per node @example 'node.1' -> P2G1, 'node.8' -> P2G2
 * @param {string[]} currentNodes Replica of checkVal. Used to avoid angular error 'ExpressionChangedAfterItHasBeenCheckedError'
 * @param {Object[]} checkBoxStatus Replica of nodes. Used to avoid angular error 'ExpressionChangedAfterItHasBeenCheckedError'
 * @param {number} CHECKBOX_COUNT constant with the numbers of the checkboxes available in the component. With checkboxes we mean
 *  the different amount of technologies, currently [PV|Wind|CHP|P2H|P2G|ElectricLoad]
 * @param {string[]} turbineModels Array holding all the names of turbines available in Renewable Ninja module
 * @param {string} currentTab Variable holding the information of current tab selected by the user [ElectricGrid|CentralisedHeat|LocalisedHeat]
 * @param {Object} genParams Shortcut variable of generalParams instead of using this.generalParams.parameters
 * @param {Object} paramInit Variable holding the instance of a JSON model corresponding to the user selections.
 * @param {number} currentModel Variable holding which model the user has selected [model1|model2|model3|model4]
 * @param {Object} g2h Variable holding the configuration of G2H
 */
export class TechParamComponent implements OnChanges,
    AfterViewInit,
    OnInit,
    AfterContentChecked,
    OnDestroy {

    public checkVal: Object[] = [];
    @Input() pvParam: Object;
    @Input() windParam: Object;
    @Input() isLoadModule: boolean;
    private subscriptions: Subscription[] = [];
    @Output() pvChange: EventEmitter<Object>;
    @Output() windChange: EventEmitter<Object>;
    @Output() phase3: EventEmitter<boolean>;
    public nodeWindParam: Object = {};
    public nodePvParam: Object = {};
    public displayingNode: string;
    public displayContent: boolean = false;
    public nodes: string[] = [];
    public registeredDevices: Array<any> = [];
    public unitSelectedPerNode: Object[] = [];
    public currentNodes: string[] = [];
    public checkBoxStatus: Object[] = [];
    private CHECKBOX_COUNT: number = 7;
    public turbineModels: string[] = [];
    public currentTab: string = 'Electric Grid';
    private genParams: Object = {};
    public paramInit: Object = {};
    private currentModel: number = 0;
    public g2h: Object = {
        'dh.connected.heat.load': true,
        'not.dh.connected.heat.load': true,
        'centralised': true,
        'localised': true,
    };

    /**
     * @param {HttpClient} httpClient Angular service to make REST requests
     * @param {GeneralParamsService} generalParams Custom service responsible on holding the general parameters of the scenario e.g horizon, timestep
     * @param {Model2ParamInitService} model2 Custom service holding the structure of model 2
     * @param {Model1ParamInitService} model1 Custom service holding the structure of model 2
     */
    constructor(private model2: Model2ParamInitService,
        private generalParams: GeneralParamsService,
        private model1: Model1ParamInitService,
        private httpClient: HttpClient) {
        this.genParams = this.generalParams.parameters;
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

        this.getNodesNames(false);
        this.pvChange = new EventEmitter<Object>();
        this.windChange = new EventEmitter<Object>();
        this.phase3 = new EventEmitter<boolean>();
        this.subscriptions.push(this.model2.paramUpdated.subscribe(
            (data) => {
                if (this.currentModel !== 2 || this.isLoadModule) {
                    this.getNodesNames(true);
                    this.paramInit = data;
                    this.initializeValues();
                    this.checkBoxStatus = { ...this.checkVal };
                    this.currentModel = 2;
                }
            },
        ));

        this.subscriptions.push(this.model1.paramUpdated.subscribe(
            (data) => {
                if (this.currentModel !== 1 || this.isLoadModule) {
                    this.getNodesNames(true);
                    this.paramInit = data;
                    this.initializeValues();
                    this.checkBoxStatus = { ...this.checkVal };
                    this.currentModel = 1;
                }
            },
        ));

        this.subscriptions.push(this.generalParams.parametersSubject.subscribe(
            (data) => {
                this.genParams['startingDate'] = data['startingDate'];
                this.genParams['endingDate'] = data['endingDate'];
                this.genParams['isDefault'] = data['isDefault'];
                this.genParams['model'] = data['model'];
            },
        ));
    }

    /**
  * Angular lifecycle hook used to initialize the paramInit variable based on the user selected model as well as
  * the varibale responsible for extracting data for renewable ninja module.
  * The hook is used also to initialize registeredDevices variable holding all the registered flexibility units
  */
    ngOnInit() {
        const url = '/planet/rest/get_devices';
        this.httpClient.get(url)
            .pipe(map((results) => {
                return results['results']['resources'];
            }),
            )
            .subscribe(
                (devices) => {
                    this.registeredDevices['P2G'] = devices.filter(value => value.unitType === 'P2G');
                    this.registeredDevices['P2H'] = devices.filter(value => value.unitType === 'P2H');
                    this.registeredDevices['VES'] = devices.filter(value => value.unitType === 'VES');
                },
                (error) => {
                    // console.log(error)
                },
            );

        this.nodePvParam = this.pvParam['payload'];
        this.nodeWindParam = this.windParam['payload'];

        if (this.isLoadModule) {
            const oldValue = JSON.stringify(this.nodeWindParam).replace(/\+/g, ' ');
            this.nodeWindParam = JSON.parse(oldValue);
            this.windParam['payload'] = this.nodeWindParam;
        }
        if (!this.paramInit['payload']) {
            if (this.genParams['model'] === 1) {
                this.paramInit = this.model1.paramInit;
            } else if (this.genParams['model'] === 2) {
                this.paramInit = this.model2.paramInit;
            }
        }
    }

    /**
* Angular lifecycle hook used initialize mandatory variables by calling the initializeValues() function
*/
    ngAfterViewInit() {
        this.initializeValues();
        this.checkBoxStatus = this.checkVal;
    }

    /**
  * Angular lifecycle hook used to as a checkpoint to reveal the component's html
  */
    ngAfterContentChecked() {
        this.currentNodes = this.nodes;
        if (this.checkBoxStatus['node.1'] !== undefined) {
            this.displayContent = true;
        }
    }

    /**
 * Angular lifecycle hook used in create scenario to get PV and Wind data from create component and update
 * default values based on the user selected model
 */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.pvParam && !this.isLoadModule) {
            this.afterWindDataRecieved(changes.windParam.currentValue);
            this.afterPvDataRecieved(changes.pvParam.currentValue);
            for (let i = 0; i < this.nodes.length; i++) {
                this.displayingNode = 'node.' + (i + 1);
                for (let j = 0; j < this.CHECKBOX_COUNT; j++) {
                    if (this.genParams['model'] === 1) {
                        if (this.genParams['isDefault']) {
                            this.model1.updateDefaultValues(j, true, this.displayingNode);
                        } else {
                            this.model1.updateDefaultValues(j, false, this.displayingNode);
                        }
                    } else if (this.genParams['model'] === 2) {
                        if (this.genParams['isDefault']) {
                            this.model2.updateDefaultValues(j, true, this.displayingNode);
                        } else {
                            this.model2.updateDefaultValues(j, false, this.displayingNode);
                        }
                    }
                }
            }
            this.displayingNode = 'node.1';
        }
    }

    /**
  * Function responsible to initialize information about nodes and PV / Wind parameters at component creation or
  * on model change
  * @example
  * getNodesNames(calledFromModel)
  *
  * @param {boolean} calledFromModel Parameter declaring if the function called from the model Observable or from
  * the component constructor at creation.
  */
    private getNodesNames(calledFromModel: boolean): void {
        if (!calledFromModel) {
            this.displayingNode = 'node.1';
        }
        if (this.genParams['model'] === 1) {
            this.nodes = Object.getOwnPropertyNames(this.model1.paramInit['payload']['electric.grid']);
        } else if (this.genParams['model'] === 2) {
            this.nodes = Object.getOwnPropertyNames(this.model2.paramInit['payload']['electric.grid']);
        }

        if (!calledFromModel) {
            for (let i = 0; i < this.nodes.length; i++) {
                this.checkVal['node.' + (i + 1)] = {};
            }
        }

        if (this.isLoadModule === false) {
            for (let i = 0; i < this.nodes.length; i++) {
                this.nodeWindParam['node.' + (i + 1)] = {
                    'capacity': 1,
                    'hub.height': 80,
                    'turbine.model': 'Vestas+V80+2000',
                };

                this.nodePvParam['node.' + (i + 1)] = {
                    'capacity': 1,
                    'system.loss': 0.1,
                    'tracking': 1,
                    'tilt': 35,
                    'azimuth': 180,
                };
            }
        }
    }

    /**
  * Function responsible to initialize Wind parameters and emit to parent component
  * @example
  * afterWindDataRecieved(windData)
  *
  * @param {Object} windData Parameter holding the Wind configuration.
  */
    private afterWindDataRecieved(windData: Object): void {
        this.nodeWindParam['lat'] = windData['payload']['lat'];
        this.nodeWindParam['lon'] = windData['payload']['lon'];
        windData['payload'] = this.nodeWindParam;
        this.windChange.emit(this.nodeWindParam);
    }

    /**
  * Function responsible to initialize PV parameters and emit to parent component
  * @example
  * afterPvDataRecieved(pvData)
  *
  * @param {Object} pvData Parameter holding the PV configuration.
  */
    private afterPvDataRecieved(pvData: Object): void {
        this.nodePvParam['lat'] = pvData['payload']['lat'];
        this.nodePvParam['lon'] = pvData['payload']['lon'];
        pvData['payload'] = this.nodePvParam;
        this.pvChange.emit(this.nodePvParam);
    }

    /**
  * Function responsible to update PV and Wind parameters when a user change their values
  * @example
  * updateWindPVParams('PV', 'system.loss', '0.2')
  *
  * @param {string} type Variable holding the type of the configuration [PV|Wind].
  * @param {string} attribute Parameter holding the attribute that has changed
  * @param {any} attributeValue Parameter holding the changed value of the attribute it can be either string or number
  */
    public updateWindPVParams(type: string, attribute: string, attributeValue: any): void {
        for (let i = 0; i < this.nodes.length; i++) {
            if (type === 'PV') {
                this.nodePvParam['node.' + (i + 1)][attribute] = attributeValue;
            } else {
                this.nodeWindParam['node.' + (i + 1)][attribute] = attributeValue;
            }
        }
    }

    /**
      * Function responsible to initialize the values of the checkboxes to [true|false] according to their nominal power per node
      * @example
      * initializeValues()
      *
      */
    initializeValues() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.unitSelectedPerNode['node.' + (i + 1)] = {};
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
                            this.unitSelectedPerNode['node.' + (i + 1)]['P2G'] = '';
                        } else {
                            this.checkVal['node.' + (i + 1)][j] = true;
                            this.unitSelectedPerNode['node.' + (i + 1)]['P2G'] =
                                this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['P2G']['name'];
                        }
                        break;
                    case 5:
                        if (this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['uncontrollable.load']['peak.load'] === 0
                            && this.checkVal['node.' + (i + 1)][j] !== true) {
                            this.checkVal['node.' + (i + 1)][j] = false;
                        } else {
                            this.checkVal['node.' + (i + 1)][j] = true;
                        }
                        break;
                    case 6:
                        if (this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['VES']['name']) {
                            this.checkVal['node.' + (i + 1)][j] = true;
                            this.unitSelectedPerNode['node.' + (i + 1)]['VES'] =
                                this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['VES']['name'];
                        } else {
                            this.unitSelectedPerNode['node.' + (i + 1)]['VES'] = '';
                        }
                        break;
                }
            }
        }
    }

    /**
  * Function responsible on updating the switces holding the different technologies and updating the main model the user has selected.
  * For example if the switch is true on PV and a 10MW power is applied. When the switch is toggled the updated value will be zero and
  * the function will update the model and emit the change to all the corresponding components
  * @example
  * changeCheckBoxVal(1): will change the Wind checkBox status to [true|false]
  *
  * @param {number} id The number indicating the changed checkbox
  *
  */
    public changeCheckBoxVal(id: number): void {
        this.checkVal[this.displayingNode][id] = !this.checkVal[this.displayingNode][id];
        let flag: boolean;
        if (this.checkVal[this.displayingNode][id] && this.genParams['isDefault']) {
            flag = true;
        } else {
            flag = false;
        }

        if (this.genParams['model'] === 1) {
            this.model1.updateDefaultValues(id, flag, this.displayingNode);
        } else if (this.genParams['model'] === 2) {
            this.model2.updateDefaultValues(id, flag, this.displayingNode);
        }
    }

    /**
  * Function responsible on updating the main configuration for ```Parameteres_initialazation.txt``` when a flexibility
  * unit has changed one of its attributes
  * @example
  * onUnitChange(p2gObject,'P2G')
  *
  * @param {Object} unitConfig The unit Object configuration
  * @param {string} unitType The unitType [P2G|P2H|VES]
  *
  */
    public onUnitChange(unitConfig: Object, unitType: string): void {
        let arr: Object[] = [];
        if (unitType === 'VES') {
            arr.push(unitConfig['payload']);
        } else {
            arr.push(unitConfig['payload']['parameters']['configuration']);
        }

        arr = arr.map(value => {
            return JSON.parse(JSON.stringify(value).replace(/_/g, '.'));
        });
        this.paramInit['payload']['electric.grid'][this.displayingNode][unitType] = arr[0];
    }

    /**
  * Function responsible on applying the registered flexibility values to the main configuration
  * @example
  * optionSelected('P2G1','P2G')
  *
  * @param {string} unitName The unit name
  * @param {string} unitType The unitType [P2G|P2H|VES]
  *
  */
    public optionSelected(unitName: string, unitType: string): void {
        if (unitName !== 'None') {
            this.unitSelectedPerNode[this.displayingNode][unitType] = unitName;
        } else {
            this.unitSelectedPerNode[this.displayingNode][unitType] = 'None';
        }
        const optionValue = this.registeredDevices[unitType].filter(value => {
            if (value['name'] === unitName) {
                return value['metadata'];
            }
        });
        if (unitName !== 'None') {
            this.paramInit['payload']['electric.grid'][this.displayingNode][unitType] = optionValue[0]['metadata'];
            this.paramInit['payload']['electric.grid'][this.displayingNode][unitType]['IP'] = optionValue[0]['IP'];
            this.paramInit['payload']['electric.grid'][this.displayingNode][unitType]['Port'] = optionValue[0]['Port'];
            this.paramInit['payload']['electric.grid'][this.displayingNode][unitType]['name'] = optionValue[0]['name'];
        } else {
            this.paramInit['payload']['electric.grid'][this.displayingNode][unitType] = [];
            this.paramInit['payload']['electric.grid'][this.displayingNode][unitType]['IP'] = '';
            this.paramInit['payload']['electric.grid'][this.displayingNode][unitType]['Port'] = '';
            this.paramInit['payload']['electric.grid'][this.displayingNode][unitType]['name'] = '';
        }

    }

    /**
    * Function responsible emitting [true] when a user wants to proceed to the next phase of configuration
    * @example
    * nextPhase()
    *
    */
    public nextPhase(): void {
        if (this.genParams['model'] === 1) {
            this.model1.paramUpdated.next(this.paramInit);
        } else if (this.genParams['model'] === 2) {
            this.model2.paramUpdated.next(this.paramInit);
        }
        this.phase3.emit(true);
    }

    /**
    * Function responsible to change the currently selected node.
    * @example
    * changeNode('node.1')
    *
    * @param {string} node The currently displayed node on the screen, selected by the user
    *
    */
    public changeNode(node: string): void {
        this.displayingNode = node;
    }

    /**
    * Function responsible to change the currently selected tab.
    * @example
    * changeTab('Electric Grid')
    *
    * @param {string} tabTitle The currently active tab on the screen, selected by the user
    *
    */
    public changeTab(tabTitle: Object): void {
        this.currentTab = tabTitle['tabTitle'];
    }

    /**
    * Function responsible to update the values for 'centralized.heat' and 'localized.heat' configuration
    * @example
    * changeG2H(1)
    *
    * @param {number} id The id corresponds to an indicator for an input tag that has its value changed
    *
    */
    public changeG2H(id: number): void {
        switch (id) {
            case 1:
                this.g2h['dh.connected.heat.load'] = !this.g2h['dh.connected.heat.load'];
                this.emitG2H(id, 'dh.connected.heat.load');
                break;
            case 2:
                this.g2h['centralised'] = !this.g2h['centralised'];
                this.emitG2H(id, 'centralised');
                break;
            case 3:
                this.g2h['not.dh.connected.heat.load'] = !this.g2h['not.dh.connected.heat.load'];
                this.emitG2H(id, 'not.dh.connected.heat.load');
                break;
            case 4:
                this.g2h['localised'] = !this.g2h['localised'];
                this.emitG2H(id, 'localised');
                break;
        }
    }

    /**
    * Function used from changeG2H(id) in order to emit the configuration values that has changed to the main model
    * @example
    * emitG2H(1,'dh.connected.heat.load')
    *
    * @param {number} id The id corresponds to an indicator for an input tag that has its value changed
    * @param {number} attributeHeatType The attribute ID of G2H that will be updated
    *
    */
    private emitG2H(id: number, attributeHeatType: string): void {
        if (this.genParams['model'] === 1) {
            this.model1.updateG2HValues(id, this.g2h[attributeHeatType]);
        } else if (this.genParams['model'] === 2) {
            this.model2.updateG2HValues(id, this.g2h[attributeHeatType]);
        }
    }

    /**
    * Angular lifecycle hook on Component destroyed. used to clear the Observable subscriptions
    */
    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

}
