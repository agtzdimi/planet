import { Component, AfterViewInit, Output, EventEmitter, Input, ViewChild, ElementRef, OnInit, AfterContentChecked, OnDestroy } from '@angular/core';
import { Model1ParamInitService } from '../../../@theme/services/scenario-manager-services/model1-param-init.service';
import { Model2ParamInitService } from '../../../@theme/services/scenario-manager-services/model2-param-init.service';
import { GeneralParamsService } from '../../../@theme/services/scenario-manager-services/general-params.service';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { NbDialogService, NbDialogConfig } from '@nebular/theme';
import { DialogSubmitPromptComponent } from '../../../@theme/components/planet/dialogs/dialog-submit.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-general-params',
  templateUrl: './general-params.component.html',
  styleUrls: ['./general-params.component.scss'],
})
export class GeneralParamsComponent implements AfterViewInit, OnInit, AfterContentChecked, OnDestroy {

  paramInit: Object;
  transitionController1 = new TransitionController();
  times = 1;
  currentTab = 'Electric Grid';
  private subscriptions: Subscription[] = [];
  dataLoaded = false;
  showButton = false;
  loadedSelections = {
    'elec': '',
    'dh': '',
    'gas': '',
  };
  min: Date;
  max: Date;
  timeStep = {
    'min15': true,
    'min60': false,
  };
  nodesSelected = {
    '8 node el': false,
    '1 node el': false,
    '1 node dh': false,
    '1 node gas': false,
    '3 node dh': false,
  };
  waitLoad = false;
  genParams = {};

  @Input() isLoadModule: boolean;
  @Output() phaseOutput = new EventEmitter<boolean>();
  @ViewChild('elecRadio', { 'static': false }) elecRadio: ElementRef;
  @ViewChild('dhRadio', { 'static': false }) dhRadio: ElementRef;
  @ViewChild('gasRadio', { 'static': false }) gasRadio: ElementRef;
  @ViewChild('formpicker', { 'static': false }) formpicker: ElementRef;
  @ViewChild('checkbox2', { 'static': false }) checkbox2: ElementRef;

  constructor(private model1: Model1ParamInitService,
    private model2: Model2ParamInitService,
    public generalParams: GeneralParamsService,
    private dialogService: NbDialogService) {

    this.min = new Date(2016, 0, 1);
    this.max = new Date(2016, 11, 31);
    this.genParams = this.generalParams.parameters;

    // Subscribe to events
    this.subscriptions.push(this.generalParams.parametersSubject.subscribe(
      (data) => {
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
      (data) => {
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
      (data) => {
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

  ngAfterContentChecked() {
    this.showButton = this.checkDefaultData();
  }

  ngOnInit() {
    if (!this.paramInit) {
      this.paramInit = this.model1.paramInit;
    }
  }

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

  handleDescriptionChange(event) {
    this.generalParams.updateGeneralParameters(event.target.value, 'formDescription');
  }

  animateImage(transitionName: string = 'scale', event) {
    const context = {
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

  animateInfo() {
    this.phaseOutput.emit(true);
  }

  resizeMap() {
    this.generalParams.updateGeneralParameters(false, 'showMap');
    this.generalParams.updateGeneralParameters(true, 'showMap');
  }

  changeTab(event) {
    if (this.times === 1 && !this.isLoadModule) {
      this.resizeMap();
      this.times++;
    }
    this.currentTab = event.tabTitle;

    if (event['tabTitle'] === 'Electric Grid') {
      if (this.nodesSelected['8 node el']) {
        this.generalParams.updateGeneralParameters('assets/images/grid.png', 'gridImage');
      } else {
        this.generalParams.updateGeneralParameters('assets/images/singleNodeElectric.png', 'gridImage');
      }
    } else if (event['tabTitle'] === 'District Heating') {
      if (this.nodesSelected['3 node dh']) {
        this.generalParams.updateGeneralParameters('assets/images/3NodeDH.png', 'gridImage');
      } else {
        this.generalParams.updateGeneralParameters('assets/images/singleNodeDistrictHeating.png', 'gridImage');
      }
    } else {
      this.generalParams.updateGeneralParameters('assets/images/singleNodeGas.png', 'gridImage');
    }
  }

  onRadioButtonClicked(event) {
    if (event['target']['textContent'] === '8 Node') {
      this.generalParams.updateGeneralParameters('assets/images/grid.png', 'gridImage');
      this.nodesSelected['8 node el'] = true;
      this.nodesSelected['1 node el'] = false;
    } else if (event['target']['textContent'] === '3 Node') {
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

  updateModel() {
    switch (this.genParams['model']) {
      case 1:
        this.model1.paramUpdated.next(this.paramInit);
        break;
      case 2:
        this.model2.paramUpdated.next(this.paramInit);
        break;
    }
  }

  handleDateChange(event) {
    if (event.end) {
      this.genParams['startingDate'] = event.start;
      this.genParams['endingDate'] = event.end;
      this.generalParams.updateGeneralParameters(this.genParams['startingDate'], 'startingDate');
      this.generalParams.updateGeneralParameters(this.genParams['endingDate'], 'endingDate');
      const daysTotal = Math.round(Math.abs((event.start.getTime() - event.end.getTime()) / (24 * 60 * 60 * 1000))) + 1;
      this.paramInit['payload']['simulation']['simulation.time'] = Math.round(daysTotal * 24);
      this.updateModel();
    }

  }

  updateSelectedModel(event, modelType) {
    this.genParams['selectedModel'][modelType] = event;
    this.generalParams.updateGeneralParameters(this.genParams['selectedModel'], 'selectedModel');
  }

  checkGrids() {
    if (!this.genParams['selectedModel']['dh'] || !this.genParams['selectedModel']['elec'] || !this.genParams['selectedModel']['gas']) {
      return false;
    } else {
      return true;
    }
  }

  checkDefaultData() {
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

  setCoord(event) {
    this.genParams['coordinates'][0] = event[0];
    this.genParams['coordinates'][1] = event[1];
  }

  formNameChange(event) {
    this.generalParams.updateGeneralParameters(event, 'formName');
  }

  formDescriptionChange(event) {
    this.generalParams.updateGeneralParameters(event, 'formDescription');
  }

  dateRangeChange() {
    this.generalParams.updateGeneralParameters(!this.genParams['dateRangeClicked'], 'dateRangeClicked');
  }

  openParams() {
    if (this.genParams['areaPicked'] && this.checkGrids() || this.isLoadModule) {
      // Initialize model base on user input
      this.calculateModel();
      return true;
    } else {
      return false;
    }
  }

  calculateModel() {
    if (this.genParams['selectedModel']['elec'] === '1 Node' && this.genParams['selectedModel']['dh'] === '1 Node') {
      if (this.genParams['model'] !== 1) {
        this.generalParams.updateGeneralParameters(1, 'model');
        this.paramInit = this.model1.paramInit;
        this.model1.paramUpdated.next(this.paramInit);
      }
    } else if (this.genParams['selectedModel']['elec'] === '8 Node' && this.genParams['selectedModel']['dh'] === '1 Node') {
      if (this.genParams['model'] !== 2) {
        this.generalParams.updateGeneralParameters(2, 'model');
        this.paramInit = this.model2.paramInit;
        this.model2.paramUpdated.next(this.paramInit);
      }
    }
  }

  calculateDateInput() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[(this.genParams['loadRangeDate'].start.getMonth())] + ' ' + this.genParams['loadRangeDate'].start.getDate()
      + ', ' + this.genParams['loadRangeDate'].start.getFullYear() + ' - ' +
      monthNames[(this.genParams['loadRangeDate'].end.getMonth())] + ' ' + this.genParams['loadRangeDate'].end.getDate()
      + ', ' + this.genParams['loadRangeDate'].end.getFullYear();
  }

  handleTimeStep(event, checkBox) {
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
