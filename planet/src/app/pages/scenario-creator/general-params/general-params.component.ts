import { Component, AfterViewInit, Output, EventEmitter, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Model1ParamInitService } from '../services/model1-param-init.service';
import { Model2ParamInitService } from '../services/model2-param-init.service';
import { GeneralParamsService } from '../services/general-params.service';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { NbDialogService } from '@nebular/theme';
import { DialogNamePromptComponent } from '../dialog-prompt/dialog-prompt.component';

@Component({
  selector: 'ngx-general-params',
  templateUrl: './general-params.component.html',
  styleUrls: ['./general-params.component.scss'],
})
export class GeneralParamsComponent implements AfterViewInit, OnInit {

  paramInit: Object;
  transitionController1 = new TransitionController();
  times = 1;
  currentTab = 'Electric Grid';
  dataLoaded = false;
  loadedSelections = {
    'elec': '',
    'dh': '',
    'gas': '',
  };

  @Input() isLoadModule: boolean;
  @Output() phaseOutput = new EventEmitter<boolean>();
  @ViewChild('elecRadio') elecRadio: ElementRef;
  @ViewChild('dhRadio') dhRadio: ElementRef;
  @ViewChild('gasRadio') gasRadio: ElementRef;
  @ViewChild('formpicker') formpicker: ElementRef;
  @ViewChild('checkbox2') checkbox2: ElementRef;

  constructor(private model1: Model1ParamInitService,
    private model2: Model2ParamInitService,
    public generalParams: GeneralParamsService,
    private dialogService: NbDialogService) {

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
        }
      },
    );
  }

  ngOnInit() {
    if (!this.paramInit) {
      this.paramInit = this.model1.paramInit;
    }
  }

  ngAfterViewInit() {
    this.generalParams.updateShowMap(false);
    this.generalParams.updateShowMap(true);
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
  }

  handleDescriptionChange(event) {
    this.generalParams.updateFormDescription(event.target.value);
  }

  animateImage(transitionName: string = 'scale', event) {
    this.generalParams.updateAreaPicked(true);
    this.transitionController1.animate(
      new Transition(transitionName, 2000, TransitionDirection.In));
    this.dialogService.open(DialogNamePromptComponent)
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

  openDialogBox(component) {
    this.dialogService.open(component)
      .onClose.subscribe(value => { });
  }

  changeTab(event) {
    if (this.times === 1 && !this.isLoadModule) {
      this.generalParams.updateShowMap(false);
      this.generalParams.updateShowMap(true);
      this.times++;
    }
    this.currentTab = event.tabTitle;
  }

  onRadioButtonClicked(event) {
    if (event['target']['textContent'] === '8 Node') {
      this.generalParams.updateGridImage('assets/images/grid.png');
    } else if (event['target']['textContent'] === '3 Node') {
      this.generalParams.updateGridImage('assets/images/3NodeDH.png');
    } else if (this.currentTab === 'Electric Grid') {
      this.generalParams.updateGridImage('assets/images/singleNodeElectric.png');
    } else if (this.currentTab === 'Gas Network') {
      this.generalParams.updateGridImage('assets/images/singleNodeGas.png');
    } else {
      this.generalParams.updateGridImage('assets/images/singleNodeDistrictHeating.png');
    }
    this.generalParams.updateShowMap(false);
    this.generalParams.updateShowMap(true);
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

}
