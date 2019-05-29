import { Component, EventEmitter, OnInit } from '@angular/core';
import { UploadInput, humanizeBytes } from 'ngx-uploader';
import { HttpClient } from '@angular/common/http';
import { TransitionController } from 'ng2-semantic-ui';
import { NbDialogService, NbDateService } from '@nebular/theme';
import { DialogSelFormPromptComponent } from '../dialog-prompt/select-form.component';
import { EnvService } from '../../../env.service';
import { Model2ParamInitService } from '../services/model2-param-init.service';
import { Model1ParamInitService } from '../services/model1-param-init.service';
import { GeneralParamsService } from '../services/general-params.service';
import { ControlFileService } from '../services/control-file.service';
import { EconomyFileService } from '../services/economy-file.service';

@Component({
    selector: 'ngx-load-simulation',
    styleUrls: ['./load-simulation.component.scss'],
    providers: [Model2ParamInitService,
        GeneralParamsService,
        Model1ParamInitService,
        ControlFileService,
        EconomyFileService],
    templateUrl: './load-simulation.component.html',
})
export class LoadSimulationFilesComponent implements OnInit {

    loadPage: boolean = false;
    revealed = false;
    errorMessage: String = '';
    saveMessage: String = '';
    formData: FormData;
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    elecParam: any;
    heatParam: any;
    transitionController1 = new TransitionController();
    loading: boolean = false;

    paramInit = {};
    controlSystem = {};
    econEnv = {};

    windParam = {
        'file.name': 'Wind.xlsx',
        'payload': {
            'lat': this.generalParams.coordinates[1],
            'lon': this.generalParams.coordinates[0],
        },
    };

    pvParam = {
        'file.name': 'PV.xlsx',
        'payload': {
            'lat': this.generalParams.coordinates[1],
            'lon': this.generalParams.coordinates[0],
        },
    };

    constructor(private httpClient: HttpClient,
        private dialogService: NbDialogService,
        private env: EnvService,
        public generalParams: GeneralParamsService,
        private model2: Model2ParamInitService,
        private model1: Model1ParamInitService,
        private dateService: NbDateService<Date>,
        private controlFileService: ControlFileService,
        private economyFileService: EconomyFileService) {
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;

        this.model2.paramUpdated.subscribe(
            (data) => this.paramInit = data,
        );

        this.model1.paramUpdated.subscribe(
            (data) => this.paramInit = data,
        );

        // Subscribe to events to get modified data
        this.generalParams.formNameUpdated.subscribe(
            (data) => this.generalParams.formName = data,
        );

        this.generalParams.startingDateUpdate.subscribe(
            (data) => this.generalParams.startingDate = data,
        );

        this.generalParams.endingDateUpdate.subscribe(
            (data) => this.generalParams.endingDate = data,
        );

        this.generalParams.formDescriptionUpdated.subscribe(
            (data) => this.generalParams.formDescription = data,
        );

        this.generalParams.simulationTimeUpdate.subscribe(
            (data) => this.generalParams.simulationTime = data,
        );

        this.generalParams.timeStepUpdate.subscribe(
            (data) => this.generalParams.timeStep = data,
        );

        this.generalParams.modelUpdate.subscribe(
            (data) => this.generalParams.model = data,
        );

        this.controlFileService.controlFileUpdated.subscribe(
            (data) => this.controlSystem = data,
        );

        this.economyFileService.economyFileUpdated.subscribe(
            (data) => this.econEnv = data,
        );
    }

    ngOnInit() {
        this.dialogService.open(DialogSelFormPromptComponent)
            .onClose.subscribe(name => {
                if (name) {
                    // Update formName - formDescription based on user input in dialog box
                    this.generalParams.formName = name['formName'];
                    let finalFormName = '';
                    finalFormName = this.generalParams.formName.toString();
                    this.generalParams.formDescription = name['formDescription'];
                    this.generalParams.updateFormDescription(this.generalParams.formDescription);
                    this.generalParams.updateFormName(this.generalParams.formName);
                    const url = 'http://' + this.env.planet + ':' + this.env.planetRESTPort + '/load_data';
                    this.httpClient.get(url, {
                        params: {
                            'formName': finalFormName,
                        },
                    })
                        .subscribe(
                            data => {
                                // Load and emit the data coming from Database

                                this.loadPage = true;
                                let temp = JSON.parse(data['paramInit']);
                                this.paramInit = temp;
                                this.generalParams.updateModel(this.paramInit['payload']['model']);
                                temp = JSON.parse(data['econEnv']);
                                this.econEnv = temp;
                                this.economyFileService.changeModel(this.econEnv);
                                temp = JSON.parse(data['controlSystem']);
                                this.controlSystem = temp;
                                this.controlFileService.changeModel(this.controlSystem);
                                this.elecParam = data['elecParam'];
                                this.heatParam = data['heatParam'];
                                temp = JSON.parse(data['windParam']);
                                this.windParam['payload'] = temp['payload'];
                                this.generalParams.startingDate = new Date(temp['payload']['startDate']);
                                this.generalParams.endingDate = new Date(temp['payload']['endDate']);
                                this.generalParams.updateStartDate(this.generalParams.startingDate);
                                this.generalParams.updateEndDate(this.generalParams.endingDate);
                                this.generalParams.loadRangeDate = {
                                    start: this.dateService.addDay(this.dateStart, 0),
                                    end: this.dateService.addDay(this.dateEnd, 0),
                                };
                                this.generalParams.updateLoadRangeDate(this.generalParams.loadRangeDate);
                                temp = JSON.parse(data['pvParam']);
                                this.pvParam['payload'] = temp['payload'];
                                setTimeout(() => {
                                    this.updateModel();
                                }, 2500);
                            },
                            error => {
                                // console.log('Error', error);
                            },
                        );
                }
            },
            );
    }

    startUpload(): void {
        // Start spinner
        this.loading = true;
        const formData: FormData = new FormData();

        for (let i = 0; i < this.generalParams.files.length; i++) {
            const file: File = this.generalParams.files[i];
            formData.append('file', file, file.name);
        }
        if (this.generalParams.timeStep['mins']) {
            this.paramInit['payload']['simulation']['time.step'] = this.paramInit['payload']['simulation']['time.step'] / 60;
        }
        if (this.generalParams.simulationTime['days']) {
            this.paramInit['payload']['simulation']['simulation.time'] = this.paramInit['payload']['simulation']['simulation.time']
                * 24 / this.paramInit['payload']['simulation']['time.step'];
        }
        // Update values in case current instance will be used to save another scenario
        this.generalParams.simulationTime['days'] = false;
        this.generalParams.simulationTime['hours'] = true;
        this.generalParams.updateSimulationTime(this.generalParams.simulationTime);
        this.generalParams.timeStep['mins'] = false;
        this.generalParams.timeStep['hours'] = true;
        this.generalParams.updateTimestep(this.generalParams.timeStep);
        delete this.paramInit['_id'];
        this.paramInit['payload']['formName'] = this.generalParams.formName;
        this.paramInit['payload']['formDescription'] = this.generalParams.formDescription;
        this.paramInit['payload']['model'] = this.generalParams.model;
        this.updateModel();
        this.generalParams.updateTimestep(this.generalParams.timeStep);
        this.generalParams.updateSimulationTime(this.generalParams.simulationTime);

        delete this.controlSystem['_id'];
        this.controlSystem['payload']['formName'] = this.generalParams.formName;
        this.controlSystem['payload']['formDescription'] = this.generalParams.formDescription;
        this.updateControlFile();
        delete this.econEnv['_id'];
        this.econEnv['payload']['formName'] = this.generalParams.formName;
        this.econEnv['payload']['formDescription'] = this.generalParams.formDescription;
        this.updateEconomyFile();
        formData.append('param1', JSON.stringify(this.paramInit));
        formData.append('param2', JSON.stringify(this.controlSystem));
        formData.append('param3', JSON.stringify(this.econEnv));
        formData.append('param4', JSON.stringify(this.elecParam));
        formData.append('param5', JSON.stringify(this.heatParam));
        formData.append('method', 'LOAD');
        let url = 'http://' + this.env.planet + ':' + this.env.planetRESTPort + '/upload';
        this.httpClient.post(url, formData,
        )
            .subscribe(
                () => {
                    const oldWindValue = JSON.stringify(this.windParam['payload']).replace(/ /g, '+');
                    this.windParam['payload'] = JSON.parse(oldWindValue);
                    this.windParam['payload']['formName'] = this.generalParams.formName;
                    this.windParam['payload']['formDescription'] = this.generalParams.formDescription;
                    const startDate = this.generalParams.startingDate.getFullYear().toString() +
                        '-' + (this.generalParams.startingDate.getMonth() + 1).toString() +
                        '-' + this.generalParams.startingDate.getDate().toString();
                    const endDate = this.generalParams.endingDate.getFullYear().toString() +
                        '-' + (this.generalParams.endingDate.getMonth() + 1).toString() +
                        '-' + this.generalParams.endingDate.getDate().toString();
                    this.windParam['payload']['startDate'] = startDate;
                    this.windParam['payload']['endDate'] = endDate;
                    this.pvParam['payload']['formName'] = this.generalParams.formName;
                    this.pvParam['payload']['formDescription'] = this.generalParams.formDescription;
                    this.pvParam['payload']['startDate'] = startDate;
                    this.pvParam['payload']['endDate'] = endDate;
                    url = 'http://' + this.env.planet + ':' + this.env.planetRESTPort + '/save_data';
                    this.httpClient.post(url, {
                        'windPayload': JSON.stringify(this.windParam),
                        'pvPayload': JSON.stringify(this.pvParam),
                        'method': 'LOAD',
                    },
                    )
                        .subscribe(
                            data => {
                                this.loading = false;
                            },
                            error => {
                                // console.log('Error', error);
                                this.loading = false;
                                this.saveMessage = error.error.text;
                            },
                        );
                },
                error => {
                    // console.log('Error', error);
                    this.loading = false;
                },
            );
    }

    openDialogBox(component) {
        this.dialogService.open(component)
            .onClose.subscribe();
    }

    get dateStart(): Date {
        if (!this.generalParams.startingDate) {
            this.generalParams.startingDate = new Date(2016, 1, 1);
        }
        return new Date(this.generalParams.startingDate);
    }

    get dateEnd(): Date {
        if (!this.generalParams.endingDate) {
            this.generalParams.endingDate = new Date(2016, 12, 31);
        }
        return new Date(this.generalParams.endingDate);
    }

    updateModel() {
        switch (this.generalParams.model) {
            case 1:
                this.model1.changeModel(this.paramInit);
                this.model1.paramUpdated.emit(this.paramInit);
                break;
            case 2:
                this.model2.changeModel(this.paramInit);
                this.model2.paramUpdated.emit(this.paramInit);
                break;
        }
    }

    updateControlFile() {
        this.controlFileService.controlFileUpdated.emit(this.controlSystem);
    }

    updateEconomyFile() {
        this.economyFileService.economyFileUpdated.emit(this.econEnv);
    }
}
