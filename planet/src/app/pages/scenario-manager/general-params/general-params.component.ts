import { Component, AfterViewInit, Output, EventEmitter, Input, ViewChild, ElementRef, OnInit, AfterContentChecked } from '@angular/core';
import { Model1ParamInitService } from '../../../@theme/services/scenario-manager-services/model1-param-init.service';
import { Model2ParamInitService } from '../../../@theme/services/scenario-manager-services/model2-param-init.service';
import { GeneralParamsService } from '../../../@theme/services/scenario-manager-services/general-params.service';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { NbDialogService, NbDialogConfig } from '@nebular/theme';
import { DialogSubmitPromptComponent } from '../../../@theme/components/planet/dialogs/dialog-submit.component';

@Component({
  selector: 'ngx-general-params',
  templateUrl: './general-params.component.html',
  styleUrls: ['./general-params.component.scss'],
})
export class GeneralParamsComponent implements AfterViewInit, OnInit, AfterContentChecked {

  paramInit: Object;
  transitionController1 = new TransitionController();
  times = 1;
  currentTab = 'Electric Grid';
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

    // Subscribe to events
    this.generalParams.formDescriptionUpdated.subscribe(
      (data) => this.generalParams.formDescription = data,
    );

    this.generalParams.formNameUpdated.subscribe(
      (data) => this.generalParams.formName = data,
    );

    this.generalParams.showMapUpdate.subscribe(
      (data) => this.generalParams.showMap = data,
    );

    this.generalParams.areaPickedUpdate.subscribe(
      (data) => this.generalParams.areaPicked = data,
    );

    this.generalParams.gridImageUpdate.subscribe(
      (data) => this.generalParams.gridImage = data,
    );

    this.generalParams.errorMessageUpdate.subscribe(
      (data) => this.generalParams.errorMessage = data,
    );

    this.generalParams.dateRangeUpdate.subscribe(
      (data) => this.generalParams.dateRangeClicked = data,
    );

    this.generalParams.selectedModelUpdate.subscribe(
      (data) => this.generalParams.selectedModel = data,
    );

    this.generalParams.modelUpdate.subscribe(
      (data) => this.generalParams.model = data,
    );

    // In case it is loadModule we need to get generalParameters from the Database
    this.model1.paramUpdated.subscribe(
      (data) => {
        if (this.isLoadModule && !this.dataLoaded) {
          this.generalParams.updateFormName(data['payload']['formName']);
          this.generalParams.updateFormDescription(data['payload']['formDescription']);
          this.paramInit = data;
          this.nodesSelected = {
            '8 node el': false,
            '1 node el': true,
            '1 node dh': true,
            '1 node gas': true,
            '3 node dh': false,
          };
          this.generalParams.updateGridImage('assets/images/singleNodeElectric.png');
          if (this.paramInit['payload']['simulation']['time.step'] === 60) {
            this.timeStep['min60'] = true;
            this.timeStep['min15'] = false;
          }
          this.waitLoad = true;
        }
      },
    );

    this.model2.paramUpdated.subscribe(
      (data) => {
        if (this.isLoadModule && !this.dataLoaded) {
          this.dataLoaded = true;
          this.generalParams.updateFormName(data['payload']['formName']);
          this.generalParams.updateFormDescription(data['payload']['formDescription']);
          this.paramInit = data;
          this.nodesSelected = {
            '8 node el': true,
            '1 node el': false,
            '1 node dh': true,
            '1 node gas': true,
            '3 node dh': false,
          };
          this.generalParams.updateGridImage('assets/images/grid.png');
          if (this.paramInit['payload']['simulation']['time.step'] === 60) {
            this.timeStep['min60'] = true;
            this.timeStep['min15'] = false;
          }
          this.waitLoad = true;
        }
      },
    );
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
      switch (this.generalParams.model) {
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
    this.generalParams.updateFormDescription(event.target.value);
  }

  animateImage(transitionName: string = 'scale', event) {
    const context = {
      context: {
        title: 'Initialize with default simulation values?',
      },
    } as Partial<NbDialogConfig<string | Partial<DialogSubmitPromptComponent>>>;
    this.generalParams.updateAreaPicked(true);
    this.transitionController1.animate(
      new Transition(transitionName, 2000, TransitionDirection.In));
    this.dialogService.open(DialogSubmitPromptComponent, context)
      .onClose.subscribe(status => {
        this.generalParams.isDefault = status;
        this.generalParams.isDefaultUpdate(status);
        if (this.generalParams.isDefault) {
          // code if default values
        }
      });
  }

  animateInfo() {
    this.phaseOutput.emit(true);
  }

  resizeMap() {
    this.generalParams.updateShowMap(false);
    this.generalParams.updateShowMap(true);
  }

  changeTab(event) {
    if (this.times === 1 && !this.isLoadModule) {
      this.resizeMap();
      this.times++;
    }
    this.currentTab = event.tabTitle;

    if (event['tabTitle'] === 'Electric Grid') {
      if (this.nodesSelected['8 node el']) {
        this.generalParams.updateGridImage('assets/images/grid.png');
      } else {
        this.generalParams.updateGridImage('assets/images/singleNodeElectric.png');
      }
    } else if (event['tabTitle'] === 'District Heating') {
      if (this.nodesSelected['3 node dh']) {
        this.generalParams.updateGridImage('assets/images/3NodeDH.png');
      } else {
        this.generalParams.updateGridImage('assets/images/singleNodeDistrictHeating.png');
      }
    } else {
      this.generalParams.updateGridImage('assets/images/singleNodeGas.png');
    }
  }

  onRadioButtonClicked(event) {
    if (event['target']['textContent'] === '8 Node') {
      this.generalParams.updateGridImage('assets/images/grid.png');
      this.nodesSelected['8 node el'] = true;
      this.nodesSelected['1 node el'] = false;
    } else if (event['target']['textContent'] === '3 Node') {
      this.generalParams.updateGridImage('assets/images/3NodeDH.png');
      this.nodesSelected['3 node dh'] = true;
      this.nodesSelected['1 node dh'] = false;
    } else if (this.currentTab === 'Electric Grid') {
      this.generalParams.updateGridImage('assets/images/singleNodeElectric.png');
      this.nodesSelected['1 node el'] = true;
      this.nodesSelected['8 node el'] = false;
    } else if (this.currentTab === 'Gas Network') {
      this.generalParams.updateGridImage('assets/images/singleNodeGas.png');
      this.nodesSelected['1 node gas'] = true;
    } else {
      this.generalParams.updateGridImage('assets/images/singleNodeDistrictHeating.png');
      this.nodesSelected['1 node dh'] = true;
      this.nodesSelected['8 node dh'] = false;
    }
    this.resizeMap();
  }

  updateModel() {
    switch (this.generalParams.model) {
      case 1:
        this.model1.paramUpdated.emit(this.paramInit);
        break;
      case 2:
        this.model2.paramUpdated.emit(this.paramInit);
        break;
    }
  }

  handleDateChange(event) {
    if (event.end) {
      this.generalParams.startingDate = event.start;
      this.generalParams.endingDate = event.end;
      this.generalParams.updateStartDate(this.generalParams.startingDate);
      this.generalParams.updateEndDate(this.generalParams.endingDate);
      const daysTotal = Math.round(Math.abs((event.start.getTime() - event.end.getTime()) / (24 * 60 * 60 * 1000))) + 1;
      this.paramInit['payload']['simulation']['simulation.time'] = Math.round(daysTotal * 24);
      this.updateModel();
    }

  }

  updateSelectedModel(event, modelType) {
    this.generalParams.selectedModel[modelType] = event;
    this.generalParams.updateSelectedModel(this.generalParams.selectedModel);
  }

  checkGrids() {
    if (!this.generalParams.selectedModel['dh'] || !this.generalParams.selectedModel['elec'] || !this.generalParams.selectedModel['gas']) {
      return false;
    } else {
      return true;
    }
  }

  checkDefaultData() {
    let status = false;
    if (this.generalParams.formDescription === '' || this.generalParams.formName === '' ||
      this.generalParams.formName.includes('  -  ') || this.generalParams.formName.includes('|')) {
      this.generalParams.updateErrorMessage('Please fill in/correct the Simulation Name and Description');
    } else if (!Number(+this.paramInit['payload']['simulation']['time.step'])) {
      this.generalParams.updateErrorMessage('Please give a number for time.step');
    } else if (+this.paramInit['payload']['simulation']['time.step'] !== 15 &&
      +this.paramInit['payload']['simulation']['time.step'] !== 60) {
      this.generalParams.updateErrorMessage('Time Step can only be 15Mins or 60Mins');
    } else if (!this.checkGrids()) {
      this.generalParams.updateErrorMessage('Please Specify the Electricity / District Heating / Gas Grid');
    } else if (this.formpicker && !this.formpicker['queue']) {
      this.generalParams.updateErrorMessage('Please Specify the period of the simulation');
    } else {
      status = true;
    }
    return status;
  }

  setCoord(event) {
    this.generalParams.coordinates[0] = event[0];
    this.generalParams.coordinates[1] = event[1];
  }

  formNameChange(event) {
    this.generalParams.updateFormName(event);
  }

  formDescriptionChange(event) {
    this.generalParams.updateFormDescription(event);
  }

  dateRangeChange() {
    this.generalParams.updateDateRange(!this.generalParams.dateRangeClicked);
  }

  openParams() {
    if (this.generalParams.areaPicked && this.checkGrids() || this.isLoadModule) {
      // Initialize model base on user input
      this.calculateModel();
      return true;
    } else {
      return false;
    }
  }

  calculateModel() {
    if (this.generalParams.selectedModel['elec'] === '1 Node' && this.generalParams.selectedModel['dh'] === '1 Node') {
      if (this.generalParams.model !== 1) {
        this.generalParams.updateModel(1);
        this.paramInit = this.model1.paramInit;
        this.model1.paramUpdated.emit(this.paramInit);
      }
    } else if (this.generalParams.selectedModel['elec'] === '8 Node' && this.generalParams.selectedModel['dh'] === '1 Node') {
      if (this.generalParams.model !== 2) {
        this.generalParams.updateModel(2);
        this.paramInit = this.model2.paramInit;
        this.model2.paramUpdated.emit(this.paramInit);
      }
    }
  }

  calculateDateInput() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[(this.generalParams.loadRangeDate.start.getMonth())] + ' ' + this.generalParams.loadRangeDate.start.getDate()
      + ', ' + this.generalParams.loadRangeDate.start.getFullYear() + ' - ' +
      monthNames[(this.generalParams.loadRangeDate.end.getMonth())] + ' ' + this.generalParams.loadRangeDate.end.getDate()
      + ', ' + this.generalParams.loadRangeDate.end.getFullYear();
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

}
