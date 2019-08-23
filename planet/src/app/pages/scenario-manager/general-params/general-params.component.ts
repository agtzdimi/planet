import {
  Component,
  AfterViewInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  AfterContentChecked,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { NbDialogService, NbDialogConfig } from '@nebular/theme';

import { Model1ParamInitService } from '../../../@theme/services/scenario-manager-services/model1-param-init.service';
import { Model2ParamInitService } from '../../../@theme/services/scenario-manager-services/model2-param-init.service';
import { GeneralParamsService } from '../../../@theme/services/scenario-manager-services/general-params.service';
import { DialogSubmitPromptComponent } from '../../../@theme/components/planet/dialogs/dialog-submit.component';

/**
 * Component to handle all the general parameters that exist at the first phase of creating/loading a scenario
 */
@Component({
  selector: 'ngx-general-params',
  templateUrl: './general-params.component.html',
  styleUrls: ['./general-params.component.scss'],
})
/**
 * @param {Object} paramInit Private variable holding the instance of a JSON model corresponding to the user selections.
 * @param {TransitionController} transitionController1 Variable to animate the transition inside phase 1
 * @param {number} times Used only in create scenario to resize the map next to the parameters the first time
 * @param {string} currentTab Variable holding the name of the currently selected tab [Electric|DH|Gas]
 * @param {Subscription[]} subscriptions Private variable holding the custom Observables to unsubscribe when the component will be destroyed
 * @param {boolean} dataLoaded Variable to declare if the data are loaded in the component, used only in load-scenario [true|false]
 * @param {boolean} showButton The continue button between phases, visible only in scenario-creation [true|false]
 * @param {Object} loadedSelections Object holding the structure of the grid currently selected e.g elecGrid - 8node, DH - 3node, Gas - 1node
 * @param {Date} min The minimum Date to be used to restrict the horizon on a certain date range combined with max
 * @param {Date} max The maximum Date to be used to restrict the horizon on a certain date range combined with min
 * @param {Object} timeStep Variable holding the information about the time step. Accepted values [min15|min60]
 * @param {Object} nodesSelected Object holding [true|false] values for the different nodes per grid @example nodesSelected['8 node el'] = true
 * @param {boolean} waitLoad Variable for smoothing the loading screen, when the data are ready [true|false]
 * @param {Object} genParams Variable holding the instance of general parameters inside the component
 * @param {boolean} isLoadModule Input variable from parent component indicating if we are in load mode or create [true|false]
 * @param {EventEmitter<boolean>} phaseOutput EventEmitter to pass to parent component the information of changing phase. Used only in create scenario
 * @param {ElementRef} elecRadio Element Referrence in electricity radio button.
 * Used to track the user value and adjust the correct schema next to the parameters
 * @param {ElementRef} dhRadio Element Referrence in district heating radio button.
 * Used to track the user value and adjust the correct schema next to the parameters
 * @param {ElementRef} gasRadio Element Referrence in gas radio button.
 * Used to track the user value and adjust the correct schema next to the parameters
 * @param {ElementRef} formpicker Element Referrence to date range. Used to notify user this is a mandatory input
 *
 */
export class GeneralParamsComponent implements AfterViewInit, OnInit, AfterContentChecked, OnDestroy {

  private paramInit: Object;
  public transitionController1: TransitionController = new TransitionController();
  private times: number = 1;
  private currentTab: string = 'Electric Grid';
  private subscriptions: Subscription[] = [];
  private dataLoaded: boolean = false;
  public showButton: boolean = false;
  public loadedSelections: Object = {
    'elec': '',
    'dh': '',
    'gas': '',
  };
  public min: Date;
  public max: Date;
  public timeStep: Object = {
    'min15': true,
    'min60': false,
  };
  private nodesSelected: Object = {
    '8 node el': false,
    '1 node el': false,
    '1 node dh': false,
    '1 node gas': false,
    '3 node dh': false,
  };
  public waitLoad: boolean = false;
  public genParams: Object = {};

  @Input() isLoadModule: boolean;
  @Output() phaseOutput = new EventEmitter<boolean>();
  @ViewChild('elecRadio', { 'static': false }) elecRadio: ElementRef;
  @ViewChild('dhRadio', { 'static': false }) dhRadio: ElementRef;
  @ViewChild('gasRadio', { 'static': false }) gasRadio: ElementRef;
  @ViewChild('formpicker', { 'static': false }) formpicker: ElementRef;

  /**
 * @param {Model1ParamInitService} model1 Custom service holding the structure of model 2
 * @param {Model2ParamInitService} model2 Custom service holding the structure of model 2
 * @param {GeneralParamsService} generalParams Custom service responsible on holding the general parameters of the scenario e.g horizon, timestep
 * @param {NbDialogService} dialogService Nebular service to open a new dialog screen over the current one
 *
 */
  constructor(private model1: Model1ParamInitService,
    private model2: Model2ParamInitService,
    public generalParams: GeneralParamsService,
    private dialogService: NbDialogService) {

    this.min = new Date(2016, 0, 1);
    this.max = new Date(2016, 11, 31);
    this.genParams = this.generalParams.parameters;

    // Subscribe to events
    this.subscriptions.push(this.generalParams.parametersSubject.subscribe(
      (data: Object) => {
        this.genParams['formDescription'] = data['formDescription'];
        this.genParams['formName'] = data['formName'];
        this.genParams['showMap'] = data['showMap'];
        this.genParams['areaPicked'] = data['areaPicked'];
        this.genParams['gridImage'] = data['gridImage'];
        this.genParams['errorMessage'] = data['errorMessage'];
        this.genParams['dateRangeClicked'] = data['dateRangeClicked'];
        this.genParams['selectedModel'] = data['selectedModel'];
        this.genParams['model'] = data['model'];
      },
    ));
    // In case it is loadModule we need to get generalParameters from the Database
    this.subscriptions.push(this.model1.paramUpdated.subscribe(
      (data: Object) => {
        if (this.isLoadModule && !this.dataLoaded) {
          this.generalParams.updateGeneralParameters(data['payload']['formName'], 'formName');
          this.generalParams.updateGeneralParameters(data['payload']['formDescription'], 'formDescription');
          this.paramInit = data;
          this.nodesSelected = {
            '8 node el': false,
            '1 node el': true,
            '1 node dh': true,
            '1 node gas': true,
            '3 node dh': false,
          };
          this.generalParams.updateGeneralParameters('assets/images/singleNodeElectric.png', 'gridImage');
          if (this.paramInit['payload']['simulation']['time.step'] === 60) {
            this.timeStep['min60'] = true;
            this.timeStep['min15'] = false;
          }
          this.waitLoad = true;
        }
      },
    ));

    this.subscriptions.push(this.model2.paramUpdated.subscribe(
      (data: Object) => {
        if (this.isLoadModule && !this.dataLoaded) {
          this.dataLoaded = true;
          this.generalParams.updateGeneralParameters(data['payload']['formName'], 'formName');
          this.generalParams.updateGeneralParameters(data['payload']['formDescription'], 'formDescription');
          this.paramInit = data;
          this.nodesSelected = {
            '8 node el': true,
            '1 node el': false,
            '1 node dh': true,
            '1 node gas': true,
            '3 node dh': false,
          };
          this.generalParams.updateGeneralParameters('assets/images/grid.png', 'gridImage');
          if (this.paramInit['payload']['simulation']['time.step'] === 60) {
            this.timeStep['min60'] = true;
            this.timeStep['min15'] = false;
          }
          this.waitLoad = true;
        }
      },
    ));
  }

  /**
  * Angular lifecycle used to check the Default Values once
  */
  ngAfterContentChecked() {
    this.showButton = this.checkDefaultData();
  }

  /**
  * Angular lifecycle hook used to initialize the paramInit variable in case it is empty.
  * This is useful in load-scenario, because we neet to wait for the request to finish but have an initial Object
  */
  ngOnInit() {
    if (!this.paramInit) {
      this.paramInit = this.model1.paramInit;
    }
  }

  /**
  * Angular lifecycle hook used to initialize the radio buttons in load mode and resize the map accordingly.
  */
  ngAfterViewInit() {
    if (this.isLoadModule) {
      switch (this.genParams['model']) {
        case 1:
          this.loadedSelections['elec'] = '1 Node';
          this.loadedSelections['dh'] = '1 Node';
          this.loadedSelections['gas'] = '1 Node';
          break;
        case 2:
          this.loadedSelections['elec'] = '8 Node';
          this.loadedSelections['dh'] = '1 Node';
          this.loadedSelections['gas'] = '1 Node';
          break;
      }
    }
    this.resizeMap();
  }

  /**
  * Function responsible for Opening a dialog box over the current screen
  * @example
  * handleDescriptionChange(newDescription)
  *
  * @param {Object} newDescription Parameter to hold the updated value of the scenario description
  */
  public handleDescriptionChange(newDescription: Object): void {
    this.generalParams.updateGeneralParameters(newDescription['target']['value'], 'formDescription');
  }

  /**
  * Function responsible for Opening a dialog box over the current screen
  * @example
  * animateImage(transitionName)
  *
  * @param {string} transitionName Parameter to hold animated value type.
  * The available types are described in detail on: https://edcarroll.github.io/ng2-semantic-ui/#/modules/transition
  */
  public animateImage(transitionName: string = 'scale'): void {
    const context: Object = {
      context: {
        title: 'Initialize with default simulation values?',
      },
    } as Partial<NbDialogConfig<string | Partial<DialogSubmitPromptComponent>>>;
    this.generalParams.updateGeneralParameters(true, 'areaPicked');
    this.transitionController1.animate(
      new Transition(transitionName, 2000, TransitionDirection.In));
    this.dialogService.open(DialogSubmitPromptComponent, context)
      .onClose.subscribe(status => {
        this.genParams['isDefault'] = status;
        this.generalParams.updateGeneralParameters(status, 'isDefault');
        if (this.genParams['isDefault']) {
          // code if default values
        }
      });
  }

  /**
  * Function used to emit the phase change to trigger the animation
  * @example
  * animateInfo()
  */
  public animateInfo(): void {
    this.phaseOutput.emit(true);
  }

  /**
  * Function used resize the mapBox map based on the new height of the neighbor components
  * @example
  * resizeMap()
  */
  private resizeMap(): void {
    this.generalParams.updateGeneralParameters(false, 'showMap');
    setTimeout(() => {
      this.generalParams.updateGeneralParameters(true, 'showMap');
    }, 100);
  }

  /**
  * Function used to change the corresponding grid Image based on the tab that the user clicked
  * @example
  * changeTab(tabTitle)
  *
  * @param {Object} tabTitle the title corresponding to the user selected tab
  */
  public changeTab(tabTitle: Object): void {
    if (this.times === 1 && !this.isLoadModule) {
      this.resizeMap();
      this.times++;
    }
    this.currentTab = tabTitle['tabTitle'];

    if (tabTitle['tabTitle'] === 'Electric Grid') {
      if (this.nodesSelected['8 node el']) {
        this.generalParams.updateGeneralParameters('assets/images/grid.png', 'gridImage');
      } else {
        this.generalParams.updateGeneralParameters('assets/images/singleNodeElectric.png', 'gridImage');
      }
    } else if (tabTitle['tabTitle'] === 'District Heating') {
      if (this.nodesSelected['3 node dh']) {
        this.generalParams.updateGeneralParameters('assets/images/3NodeDH.png', 'gridImage');
      } else {
        this.generalParams.updateGeneralParameters('assets/images/singleNodeDistrictHeating.png', 'gridImage');
      }
    } else {
      this.generalParams.updateGeneralParameters('assets/images/singleNodeGas.png', 'gridImage');
    }
  }

  /**
  * Function used to keep track of which node number is used per grid e.g 8 node electrical grid
  * @example
  * onRadioButtonClicked(radioButtonText)
  *
  * @param {Object} radioButtonText the title corresponding to the radio button being clicked
  */
  public onRadioButtonClicked(radioButtonText: Object): void {
    if (radioButtonText['target']['textContent'] === '8 Node') {
      this.generalParams.updateGeneralParameters('assets/images/grid.png', 'gridImage');
      this.nodesSelected['8 node el'] = true;
      this.nodesSelected['1 node el'] = false;
    } else if (radioButtonText['target']['textContent'] === '3 Node') {
      this.generalParams.updateGeneralParameters('assets/images/3NodeDH.png', 'gridImage');
      this.nodesSelected['3 node dh'] = true;
      this.nodesSelected['1 node dh'] = false;
    } else if (this.currentTab === 'Electric Grid') {
      this.generalParams.updateGeneralParameters('assets/images/singleNodeElectric.png', 'gridImage');
      this.nodesSelected['1 node el'] = true;
      this.nodesSelected['8 node el'] = false;
    } else if (this.currentTab === 'Gas Network') {
      this.generalParams.updateGeneralParameters('assets/images/singleNodeGas.png', 'gridImage');
      this.nodesSelected['1 node gas'] = true;
    } else {
      this.generalParams.updateGeneralParameters('assets/images/singleNodeDistrictHeating.png', 'gridImage');
      this.nodesSelected['1 node dh'] = true;
      this.nodesSelected['8 node dh'] = false;
    }
    this.resizeMap();
  }

  /**
  * Function to update the user selected model [model1|model2]
  * @example
  * updateModel()
  */
  private updateModel(): void {
    switch (this.genParams['model']) {
      case 1:
        this.model1.paramUpdated.next(this.paramInit);
        break;
      case 2:
        this.model2.paramUpdated.next(this.paramInit);
        break;
    }
  }

  /**
  * Function to calculate the simulation horizon based on the date range of the user selection
  * @example
  * dateRange = {start: '2016-01-01', end: '2016-01-02'}
  * handleDateChange(dateRange)
  * In this example the model will be update with 48 as simulation horizon (2days*24hours)
  *
  * @param {Object} dateRange The currently user selected date range
  */
  public handleDateChange(dateRange: Object): void {
    if (dateRange['end']) {
      this.genParams['startingDate'] = dateRange['start'];
      this.genParams['endingDate'] = dateRange['end'];
      this.generalParams.updateGeneralParameters(this.genParams['startingDate'], 'startingDate');
      this.generalParams.updateGeneralParameters(this.genParams['endingDate'], 'endingDate');
      const daysTotal: number = Math.round(Math.abs((dateRange['start'].getTime() - dateRange['end'].getTime()) / (24 * 60 * 60 * 1000))) + 1;
      this.paramInit['payload']['simulation']['simulation.time'] = Math.round(daysTotal * 24);
      this.updateModel();
    }

  }

  /**
  * Function to update the attribute `model` of the general parameters
  * @example
  * updateSelectedModel(selectedModel,modelType)
  *
  * @param {string} modelType Variable used to define in which radio group the user is. [elec|dh|gas]
  * @param {Object} selectedModel Object holding the model type and the text value corresponding to the radio button
  */
  public updateSelectedModel(selectedModel: Object, modelType: string): void {
    this.genParams['selectedModel'][modelType] = selectedModel;
    this.generalParams.updateGeneralParameters(this.genParams['selectedModel'], 'selectedModel');
  }

  /**
* Function to check if the user has defined any value for grid nodes
* @example
* checkGrids()
*
* @returns [true|false]
*/
  private checkGrids(): boolean {
    if (!this.genParams['selectedModel']['dh'] || !this.genParams['selectedModel']['elec'] || !this.genParams['selectedModel']['gas']) {
      return false;
    } else {
      return true;
    }
  }

  /**
  * Function to check if the user input is correct
  * @example
  * checkDefaultData()
  *
  * @returns [true|false]
  */
  private checkDefaultData(): boolean {
    let status = false;
    if (this.genParams['formDescription'] === '' || this.genParams['formName'] === '' ||
      this.genParams['formName'].includes('  -  ') || this.genParams['formName'].includes('|')) {
      this.generalParams.updateGeneralParameters('Please fill in/correct the Simulation Name and Description', 'errorMessage');
    } else if (!Number(+this.paramInit['payload']['simulation']['time.step'])) {
      this.generalParams.updateGeneralParameters('Please give a number for time.step', 'errorMessage');
    } else if (+this.paramInit['payload']['simulation']['time.step'] !== 15 &&
      +this.paramInit['payload']['simulation']['time.step'] !== 60) {
      this.generalParams.updateGeneralParameters('Time Step can only be 15Mins or 60Mins', 'errorMessage');
    } else if (!this.checkGrids()) {
      this.generalParams.updateGeneralParameters('Please Specify the Electricity / District Heating / Gas Grid', 'errorMessage');
    } else if (this.formpicker && !this.formpicker['queue']) {
      this.generalParams.updateGeneralParameters('Please Specify the period of the simulation', 'errorMessage');
    } else {
      status = true;
    }
    return status;
  }

  /**
  * Function to change the coordinates based on user input (currently unavaliable)
  * @example
  * setCoord(coordinates)
  *
  * @param {number[]} coordinates variable holding the lat and lot of the map spot
  */
  public setCoord(coordinates: number[]): void {
    this.genParams['coordinates'][0] = coordinates[0];
    this.genParams['coordinates'][1] = coordinates[1];
  }

  /**
  * Function to update the scenario name with a new value
  * @example
  * formNameChange(scenarioName)
  *
  * @param {string} scenarioName variable holding the scenario name
  */
  public formNameChange(scenarioName: string): void {
    this.generalParams.updateGeneralParameters(scenarioName, 'formName');
  }

  /**
  * Function to update the scenario name with a new value
  * @example
  * formDescriptionChange(scenarioDescription)
  *
  * @param {string} scenarioDescription variable holding the scenario description
  */
  public formDescriptionChange(scenarioDescription: string): void {
    this.generalParams.updateGeneralParameters(scenarioDescription, 'formDescription');
  }

  /**
  * Function to update the date range of the horizon
  * @example
  * dateRangeChange()
  *
  */
  public dateRangeChange(): void {
    this.generalParams.updateGeneralParameters(!this.genParams['dateRangeClicked'], 'dateRangeClicked');
  }

  /**
  * Function to check if the parameters shall open if the grid is selected and formName initialized or it is on load mode
  * @example
  * openParams()
  *
  */
  public openParams(): boolean {
    if (this.genParams['areaPicked'] && this.checkGrids() || this.isLoadModule) {
      // Initialize model base on user input
      this.calculateModel();
      return true;
    } else {
      return false;
    }
  }

  /**
  * Function to check which model the user selected based on his input in the radio group
  * @example
  * calculateModel()
  *
  */
  private calculateModel(): void {
    if (this.genParams['selectedModel']['elec'] === '1 Node' && this.genParams['selectedModel']['dh'] === '1 Node') {
      if (this.genParams['model'] !== 1) {
        this.generalParams.updateGeneralParameters(1, 'model');
        this.paramInit = this.model1.paramInit;
        this.model1.paramUpdated.next(this.paramInit);
        this.resizeMap();
      }
    } else if (this.genParams['selectedModel']['elec'] === '8 Node' && this.genParams['selectedModel']['dh'] === '1 Node') {
      if (this.genParams['model'] !== 2) {
        this.generalParams.updateGeneralParameters(2, 'model');
        this.paramInit = this.model2.paramInit;
        this.model2.paramUpdated.next(this.paramInit);
        this.resizeMap();
      }
    }
  }

  /**
 * Function to return the date selected in format: MMMM dd,yyyy e.g Jun 30, 2016
 * @example
 * calculateDateInput()
 *
 */
  public calculateDateInput(): string {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[(this.genParams['loadRangeDate'].start.getMonth())] + ' ' + this.genParams['loadRangeDate'].start.getDate()
      + ', ' + this.genParams['loadRangeDate'].start.getFullYear() + ' - ' +
      monthNames[(this.genParams['loadRangeDate'].end.getMonth())] + ' ' + this.genParams['loadRangeDate'].end.getDate()
      + ', ' + this.genParams['loadRangeDate'].end.getFullYear();
  }

  /**
* Function to keep track the number of minutes per time step
* @example
* handleTimeStep('min15')
*
* @param {string} checkBox The checkBox string representation of the time step
*
*/
  public handleTimeStep(checkBox: string): void {
    if (checkBox === 'min15') {
      this.paramInit['payload']['simulation']['time.step'] = 15;
      this.timeStep['min15'] = true;
      this.timeStep['min60'] = false;
    } else if (checkBox === 'min60') {
      this.paramInit['payload']['simulation']['time.step'] = 60;
      this.timeStep['min60'] = true;
      this.timeStep['min15'] = false;
    }
    this.updateModel();
  }

  /**
* Angular lifecycle hook on Component destroyed. used to clear the Observable subscriptions
*/
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
