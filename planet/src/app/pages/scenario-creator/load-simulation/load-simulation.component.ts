import { Component, EventEmitter, AfterViewInit, OnInit } from '@angular/core';
import { UploadInput, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { HttpClient } from '@angular/common/http';
import { TransitionController } from 'ng2-semantic-ui';
import { NbDialogService, NbCalendarRange, NbDateService } from '@nebular/theme';
import { DialogSelFormPromptComponent } from '../dialog-prompt/select-form.component';
import { EnvService } from '../../../env.service';
import { Model2ParamInitService } from '../services/model2-param-init.service';
import { GeneralParamsService } from '../services/general-params.service';

@Component({
    selector: 'ngx-load-simulation',
    styleUrls: ['./load-simulation.component.scss'],
    providers: [Model2ParamInitService, GeneralParamsService],
    templateUrl: './load-simulation.component.html',
})
export class LoadSimulationFilesComponent implements AfterViewInit, OnInit {

    options: UploaderOptions;
    formName: String;
    loadPage: boolean = false;
    formDescription: String;
    errorMessage: String = '';
    saveMessage: String = '';
    formData: FormData;
    files: File[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;
    fileName: string[] = [];
    text: any;
    timeStep: Object;
    simulationTime: Object;
    showMap = false;
    coordinates: number[] = [7.6825, 45.0678];
    capacity = 1;
    elecParam: any;
    heatParam: any;
    systemLoss = 10;
    areaPicked: boolean = true;
    transitionController1 = new TransitionController();
    area: string = 'Turin';
    loading: boolean = false;
    dateRangeClicked: boolean = false;
    range: NbCalendarRange<Date>;
    startingDate: Date;
    endingDate: Date;

    ngOnInit() {
        this.dialogService.open(DialogSelFormPromptComponent)
            .onClose.subscribe(name => {
                if (name) {
                    this.formName = name['formName'];
                    let finalFormName = '';
                    finalFormName = this.formName.toString();
                    this.formDescription = name['formDescription'];
                    const url = 'http://' + this.env.planet + ':' + this.env.planetRESTPort + '/load_data';
                    this.httpClient.get(url, {
                        params: {
                            'formName': finalFormName,
                        },
                    })
                        .subscribe(
                            data => {
                                let temp = JSON.parse(data['paramInit']);
                                this.model2.paramUpdated.emit(temp);
                                temp = JSON.parse(data['econEnv']);
                                this.econEnv['payload'] = temp['payload'];
                                temp = JSON.parse(data['controlSystem']);
                                this.controlSystem['payload']['control'] = temp['payload']['control'];
                                this.elecParam = data['elecParam'];
                                this.heatParam = data['heatParam'];
                                temp = JSON.parse(data['date']);
                                this.startingDate = temp['payload']['startDate'];
                                this.endingDate = temp['payload']['endDate'];
                                this.range = {
                                    start: this.dateService.addDay(this.dateStart, 0),
                                    end: this.dateService.addDay(this.dateEnd, 0),
                                };
                            },
                            error => {
                                // console.log('Error', error);
                            },
                        );
                }
                this.loadPage = true;
            },
            );
    }

    paramInit = {
    };

    controlSystem = {
        'file.name': 'Control_initialization',
        'payload': {
            'control': 5,
            'RES.curtailment': 0,
        },
    };

    econEnv = {
        'file.name': '',
        'payload': {
            'technologies.cost': {
            },
        },
    };

    windParam = {
        'file.name': 'Wind.xlsx',
        'payload': {
            'lat': this.coordinates[1],
            'lon': this.coordinates[0],
        },
    };

    pvParam = {
        'file.name': 'PV.xlsx',
        'payload': {
            'lat': this.coordinates[1],
            'lon': this.coordinates[0],
        },
    };

    revealed = false;

    constructor(private httpClient: HttpClient,
        private dialogService: NbDialogService,
        private env: EnvService,
        private generalParams: GeneralParamsService,
        private model2: Model2ParamInitService,
        private dateService: NbDateService<Date>) {
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
        this.coordinates = this.generalParams.coordinates;

        this.model2.paramUpdated.subscribe(
            (data) => this.paramInit = data,
        );

        this.generalParams.formNameUpdated.subscribe(
            (data) => this.generalParams.formName = data,
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
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.showMap = !this.showMap;
        }, 500);
    }

    startUpload(): void {
        this.loading = true;
        const formData: FormData = new FormData();

        for (let i = 0; i < this.files.length; i++) {
            const file: File = this.files[i];
            formData.append('file', file, file.name);
        }
        if (this.timeStep['mins']) {
            this.paramInit['payload']['simulation']['time.step'] = this.paramInit['payload']['simulation']['time.step'] / 60;
        }
        if (this.simulationTime['days']) {
            this.paramInit['payload']['simulation']['simulation.time'] = this.paramInit['payload']['simulation']['simulation.time']
                * 24 / this.paramInit['payload']['simulation']['time.step'];
        }
        this.simulationTime['days'] = false;
        this.simulationTime['hours'] = true;
        this.timeStep['mins'] = false;
        this.timeStep['hours'] = true;
        this.paramInit['payload']['formName'] = this.formName;
        this.paramInit['payload']['formDescription'] = this.formDescription;
        this.controlSystem['payload']['formName'] = this.formName;
        this.controlSystem['payload']['formDescription'] = this.formDescription;
        this.econEnv['payload']['formName'] = this.formName;
        this.econEnv['payload']['formDescription'] = this.formDescription;
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
                    this.windParam['payload']['formName'] = this.formName;
                    this.windParam['payload']['formDescription'] = this.formDescription;
                    this.pvParam['payload']['formName'] = this.formName;
                    this.pvParam['payload']['formDescription'] = this.formDescription;
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
        if (!this.startingDate) {
            this.startingDate = new Date(2016, 1, 1);
        }
        return new Date(this.startingDate);
    }

    get dateEnd(): Date {
        if (!this.endingDate) {
            this.endingDate = new Date(2016, 12, 31);
        }
        return new Date(this.endingDate);
    }

    getDateFormat() {
        let temp: string = '';
        if (this.range) {
            if (this.range.start && this.range.end) {
                temp = ('0' + this.range.start.getDate()).slice(-2) + '/' +
                    ('0' + (this.range.start.getUTCMonth() + 1)).slice(-2) + '/' +
                    this.range.start.getUTCFullYear() + ' - ' + ('0' + this.range.end.getDate()).slice(-2) + '/' +
                    ('0' + (this.range.end.getUTCMonth() + 1)).slice(-2) + '/' +
                    this.range.end.getUTCFullYear();
            }
        }

        return temp;
    }
}
