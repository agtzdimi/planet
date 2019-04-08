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
  styleUrls: ['./general-params.component.scss'],
})
export class GeneralParamsComponent implements OnInit, AfterViewInit {

  paramInit: Object;
  options: UploaderOptions;
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
    this.options = this.generalParams.options;
    for (let i = 0; i < 7; i++) {
      this.fileName.push('Upload File');
    }

    this.model.paramUpdated.subscribe(
      (data) => {
        // console.log(data)
        this.generalParams.formName = data['payload']['formName'];
        this.generalParams.formNameUpdated.emit(data['payload']['formName']);
        this.paramInit = data;

      },
    );
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.generalParams.showMap = !this.generalParams.showMap;
      this.generalParams.showMapUpdate.emit(this.generalParams.showMap);
    }, 500);
  }

  handleDescriptionChange(event) {
    this.generalParams.formDescription = event.target.value;
    this.generalParams.formDescriptionUpdated.emit(event.target.value);
  }

  animateImage(transitionName: string = 'scale', event) {
    this.generalParams.areaPicked = true;
    this.generalParams.areaPickedUpdate.emit(this.generalParams.areaPicked);
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
        this.generalParams.showMap = !this.generalParams.showMap;
        this.generalParams.showMapUpdate.emit(this.generalParams.showMap);
      }, 1000);
      this.times++;
    }
    this.currentTab = event.tabTitle;
  }

  onRadioButtonClicked(event) {
    if (event['target']['textContent'] === '8 Node') {
      this.generalParams.gridImage = 'assets/images/grid.png';
    } else if (event['target']['textContent'] === '3 Node') {
      this.generalParams.gridImage = 'assets/images/3NodeDH.png';
    } else if (this.currentTab === 'Electric Grid') {
      this.generalParams.gridImage = 'assets/images/singleNodeElectric.png';
    } else if (this.currentTab === 'Gas Network') {
      this.generalParams.gridImage = 'assets/images/singleNodeGas.png';
    } else {
      this.generalParams.gridImage = 'assets/images/singleNodeDistrictHeating.png';
    }
    this.generalParams.gridImageUpdate.emit(this.generalParams.gridImage);
  }

  handleTimeStep(event, type) {
    if (type === 'mins') {
      this.generalParams.timeStep['mins'] = event;
      this.generalParams.timeStep['hours'] = false;
      this.paramInit['payload']['simulation']['time.step'] = this.paramInit['payload']['simulation']['time.step'] * 60;
    } else {
      this.generalParams.timeStep['hours'] = event;
      this.generalParams.timeStep['mins'] = false;
      this.paramInit['payload']['simulation']['time.step'] = this.paramInit['payload']['simulation']['time.step'] / 60;
    }
    this.model.paramUpdated.emit(this.paramInit);
    this.generalParams.timeStepUpdate.emit(this.generalParams.timeStep);
  }

  handleDateChange(event) {
    if (event.end) {
      this.generalParams.startingDate = event.start;
      this.generalParams.endingDate = event.end;
      const daysTotal = Math.round(Math.abs((event.start.getTime() - event.end.getTime()) / (24 * 60 * 60 * 1000))) + 1;
      if (this.generalParams.simulationTime['days']) {
        this.paramInit['payload']['simulation']['simulation.time'] = daysTotal;
      } else {
        if (this.generalParams.timeStep['mins']) {
          const timeStepHour = this.paramInit['payload']['simulation']['time.step'] / 60;
          this.paramInit['payload']['simulation']['simulation.time'] = daysTotal * 24 /
            timeStepHour;
        } else {
          this.paramInit['payload']['simulation']['simulation.time'] = daysTotal * 24 /
            this.paramInit['payload']['simulation']['time.step'];
        }
      }

      this.model.paramUpdated.emit(this.paramInit);

    }

  }

  handleSimulationTime(event, type) {
    let timeStep: number;
    if (this.generalParams.timeStep['mins']) {
      timeStep = this.paramInit['payload']['simulation']['time.step'] / 60;
    } else {
      timeStep = this.paramInit['payload']['simulation']['time.step'];
    }
    if (type === 'days') {
      this.generalParams.simulationTime['days'] = event;
      this.generalParams.simulationTime['hours'] = false;
      this.paramInit['payload']['simulation']['simulation.time'] = this.paramInit['payload']['simulation']['simulation.time']
        * timeStep / 24;
    } else {
      this.generalParams.simulationTime['hours'] = event;
      this.generalParams.simulationTime['days'] = false;
      this.paramInit['payload']['simulation']['simulation.time'] = this.paramInit['payload']['simulation']['simulation.time']
        * 24 / timeStep;
    }

    this.model.paramUpdated.emit(this.paramInit);
    this.generalParams.simulationTimeUpdate.emit(this.generalParams.simulationTime);
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
    let status;
    if (this.generalParams.formDescription === '' || this.generalParams.formName === '' || this.generalParams.formName.includes('  -  ')) {
      this.generalParams.errorMessage = 'Please fill in/correct the Simulation Name and Description';
      status = false;
    } else if (this.getFileName(0) !== 'Electricity.xlsx') {
      this.generalParams.errorMessage = 'Please upload Electricity.xlsx';
      status = false;
    } else if (this.getFileName(1) !== 'Heat.xlsx') {
      this.generalParams.errorMessage = 'Please upload Heat.xlsx';
      status = false;
    } else if (!Number(+this.paramInit['payload']['simulation']['time.step'])) {
      this.generalParams.errorMessage = 'Please give a number for time.step';
      status = false;
    } else if (!Number(+this.paramInit['payload']['simulation']['simulation.time'])) {
      this.generalParams.errorMessage = 'Please give a number for simulation.time';
      status = false;
    } else if (!this.generalParams.timeStep['mins'] && !this.generalParams.timeStep['hours']) {
      this.generalParams.errorMessage = 'Please Specify if time step is given on Days or Hours';
      status = false;
    } else if (!this.generalParams.simulationTime['days'] && !this.generalParams.simulationTime['hours']) {
      this.generalParams.errorMessage = 'Please Specify if Simulation Horizon is given on Days or Hours';
      status = false;
    } else {
      status = true;
    }
    this.generalParams.errorMessageUpdate.emit(this.generalParams.errorMessage);
    return status;

  }

  setCoord(event) {
    this.generalParams.coordinates[0] = event[0];
    this.generalParams.coordinates[1] = event[1];
  }

  formNameChange(event) {
    this.generalParams.formName = event;
    this.generalParams.formNameUpdated.emit(event);
  }

  formDescriptionChange(event) {
    this.generalParams.formDescription = event;
    this.generalParams.formDescriptionUpdated.emit(event);
  }

  dateRangeChange() {
    this.generalParams.dateRangeClicked = !this.generalParams.dateRangeClicked;
    this.generalParams.dateRangeUpdate.emit(this.generalParams.dateRangeClicked);
  }
}
