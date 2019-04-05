import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { UploaderOptions, UploadOutput } from 'ngx-uploader';
import { Model2ParamInitService } from '../services/model2-param-init.service';
import { GeneralParamsService } from '../services/general-params.service';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { NbDialogService } from '@nebular/theme';
import { DialogNamePromptComponent } from '../dialog-prompt/dialog-prompt.component';

@Component({
  selector: 'ngx-general-params',
  templateUrl: './general-params.component.html',
  providers: [GeneralParamsService, Model2ParamInitService],
  styleUrls: ['./general-params.component.scss'],
})
export class GeneralParamsComponent implements OnInit, AfterViewInit {

  formName: string;
  formDescription: string;
  areaPicked: boolean;
  paramInit: Object;
  timeStep: Object;
  dateRangeClicked: boolean;
  simulationTime: Object;
  options: UploaderOptions;
  errorMessage: String;
  gridImage: string;
  showMap: boolean;
  coordinates: number[];
  transitionController1 = new TransitionController();

  times = 1;
  currentTab = 'Electric Grid';
  fileName: string[] = [];
  files: File[];

  phase2 = false;
  @Output() phaseOutput = new EventEmitter<boolean>();

  constructor(private model: Model2ParamInitService,
    private generalParams: GeneralParamsService,
    private dialogService: NbDialogService) {
    this.paramInit = this.model.paramInit;
    this.formName = this.generalParams.formName;
    this.areaPicked = this.generalParams.areaPicked;
    this.formDescription = this.generalParams.formDescription;
    this.timeStep = this.generalParams.timeStep;
    this.dateRangeClicked = this.generalParams.dateRangeClicked;
    this.simulationTime = this.generalParams.simulationTime;
    this.options = this.generalParams.options;
    this.errorMessage = this.generalParams.errorMessage;
    this.gridImage = this.generalParams.gridImage;
    this.coordinates = this.generalParams.coordinates;
    this.showMap = this.generalParams.showMap;
    for (let i = 0; i < 7; i++) {
      this.fileName.push('Upload File');
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.showMap = !this.showMap;
    }, 500);
  }

  handleDescriptionChange(event) {
    this.formDescription = event.target.value;
  }

  animateImage(transitionName: string = 'scale', event) {
    this.areaPicked = true;
    this.transitionController1.animate(
      new Transition(transitionName, 2000, TransitionDirection.In));
    this.dialogService.open(DialogNamePromptComponent)
      .onClose.subscribe(status => {
        this.generalParams.isDefault = status;
        if (this.generalParams.isDefault) {
          this.paramInit['payload']['simulation']['simulation.time'] = 1;
        }
      });
  }

  animateInfo() {
    this.phase2 = true;
    this.phaseOutput.emit(this.phase2);
  }

  openDialogBox(component) {
    this.dialogService.open(component)
      .onClose.subscribe(value => { });
  }

  changeTab(event) {
    if (this.times === 1) {
      setTimeout(() => {
        this.showMap = !this.showMap;
      }, 500);
      setTimeout(() => {
        this.showMap = !this.showMap;
      }, 500);
      this.times++;
    }
    this.currentTab = event.tabTitle;
  }

  onRadioButtonClicked(event) {
    if (event['target']['textContent'] === '8 Node') {
      this.gridImage = 'assets/images/grid.png';
    } else if (event['target']['textContent'] === '3 Node') {
      this.gridImage = 'assets/images/3NodeDH.png';
    } else if (this.currentTab === 'Electric Grid') {
      this.gridImage = 'assets/images/singleNodeElectric.png';
    } else if (this.currentTab === 'Gas Network') {
      this.gridImage = 'assets/images/singleNodeGas.png';
    } else {
      this.gridImage = 'assets/images/singleNodeDistrictHeating.png';
    }
  }

  handleTimeStep(event, type) {
    if (type === 'mins') {
      this.timeStep['mins'] = event;
      this.timeStep['hours'] = false;
      this.paramInit['payload']['simulation']['time.step'] = this.paramInit['payload']['simulation']['time.step'] * 60;
    } else {
      this.timeStep['hours'] = event;
      this.timeStep['mins'] = false;
      this.paramInit['payload']['simulation']['time.step'] = this.paramInit['payload']['simulation']['time.step'] / 60;
    }
  }

  handleDateChange(event) {
    if (event.end) {
      this.generalParams.startingDate = event.start;
      this.generalParams.endingDate = event.end;
      const daysTotal = Math.round(Math.abs((event.start.getTime() - event.end.getTime()) / (24 * 60 * 60 * 1000))) + 1;
      if (this.simulationTime['days']) {
        this.paramInit['payload']['simulation']['simulation.time'] = daysTotal;
      } else {
        if (this.timeStep['mins']) {
          const timeStepHour = this.paramInit['payload']['simulation']['time.step'] / 60;
          this.paramInit['payload']['simulation']['simulation.time'] = daysTotal * 24 /
            timeStepHour;
        } else {
          this.paramInit['payload']['simulation']['simulation.time'] = daysTotal * 24 /
            this.paramInit['payload']['simulation']['time.step'];
        }
      }

    }

  }

  handleSimulationTime(event, type) {
    let timeStep: number;
    if (this.timeStep['mins']) {
      timeStep = this.paramInit['payload']['simulation']['time.step'] / 60;
    } else {
      timeStep = this.paramInit['payload']['simulation']['time.step'];
    }
    if (type === 'days') {
      this.simulationTime['days'] = event;
      this.simulationTime['hours'] = false;
      this.paramInit['payload']['simulation']['simulation.time'] = this.paramInit['payload']['simulation']['simulation.time']
        * timeStep / 24;
    } else {
      this.simulationTime['hours'] = event;
      this.simulationTime['days'] = false;
      this.paramInit['payload']['simulation']['simulation.time'] = this.paramInit['payload']['simulation']['simulation.time']
        * 24 / timeStep;
    }
  }

  onUploadOutput(output: UploadOutput, id): void {
    switch (output.type) {
      case 'rejected':
        if (typeof output.file !== 'undefined') {
          this.generalParams.files = [];
          this.generalParams.files.push(output.file.nativeFile);
          this.updateFilename(id, output);
        }
        break;
      case 'addedToQueue':
        if (typeof output.file !== 'undefined') {
          if (output.file.name === this.fileName[id]) {
            this.generalParams.files[id] = output.file.nativeFile;
          } else {
            this.generalParams.files[id] = output.file.nativeFile;
          }
          this.updateFilename(id, output);
        }
        break;
    }
  }

  updateFilename(id, output) {
    this.fileName[id] = output.file.name;
  }

  getFileName(id) {
    return this.fileName[id];
  }

  checkDefaultData() {
    if (this.formDescription === '' || this.formName === '' || this.formName.includes('  -  ')) {
      this.errorMessage = 'Please fill in/correct the Simulation Name and Description';
      return false;
    } else if (this.getFileName(0) !== 'Electricity.xlsx') {
      this.errorMessage = 'Please upload Electricity.xlsx';
      return false;
    } else if (this.getFileName(1) !== 'Heat.xlsx') {
      this.errorMessage = 'Please upload Heat.xlsx';
      return false;
    } else if (!Number(+this.paramInit['payload']['simulation']['time.step'])) {
      this.errorMessage = 'Please give a number for time.step';
      return false;
    } else if (!Number(+this.paramInit['payload']['simulation']['simulation.time'])) {
      this.errorMessage = 'Please give a number for simulation.time';
      return false;
    } else if (!this.timeStep['mins'] && !this.timeStep['hours']) {
      this.errorMessage = 'Please Specify if time step is given on Days or Hours';
      return false;
    } else if (!this.simulationTime['days'] && !this.simulationTime['hours']) {
      this.errorMessage = 'Please Specify if Simulation Horizon is given on Days or Hours';
      return false;
    } else {
      return true;
    }

  }

  setCoord(event) {
    this.coordinates[0] = event[0];
    this.coordinates[1] = event[1];
  }
}
