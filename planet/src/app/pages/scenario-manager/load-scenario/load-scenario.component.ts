import { Component, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { UploadInput, humanizeBytes } from 'ngx-uploader';
import { HttpClient } from '@angular/common/http';
import { TransitionController } from 'ng2-semantic-ui';
import { NbDialogService, NbDateService } from '@nebular/theme';
import { DialogSelectFormPromptComponent } from '../../../@theme/components/planet/dialogs/select-form.component';
import { Model2ParamInitService } from '../../../@theme/services/scenario-manager-services/model2-param-init.service';
import { Model1ParamInitService } from '../../../@theme/services/scenario-manager-services/model1-param-init.service';
import { GeneralParamsService } from '../../../@theme/services/scenario-manager-services/general-params.service';
import { ControlFileService } from '../../../@theme/services/scenario-manager-services/control-file.service';
import { EconomyFileService } from '../../../@theme/services/scenario-manager-services/economy-file.service';
import { Router } from '@angular/router';
import { NbMenuService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ngx-load-scenario',
    styleUrls: ['../../../@theme/styles/scenario.component.scss'],
    providers: [Model2ParamInitService,
        GeneralParamsService,
        Model1ParamInitService,
        ControlFileService,
        EconomyFileService],
    templateUrl: './load-scenario.component.html',
})
export class LoadScenarioComponent implements OnInit, OnDestroy {

    loadPage: boolean = false;
    revealed = false;
    errorMessage: String = '';
    saveMessage: String = '';
    formData: FormData;
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    elecParam: any;
    private subscriptions: Subscription[] = [];
    heatParam: any;
    private alive = true;
    transitionController1 = new TransitionController();
    loading: boolean = false;
    genParams = {};

    paramInit = {};
    controlSystem = {};
    econEnv = {};

    windParam = {
        'file.name': 'Wind.xlsx',
        'payload': {
            'lat': this.genParams['coordinates'][1],
            'lon': this.genParams['coordinates'][0],
        },
    };

    pvParam = {
        'file.name': 'PV.xlsx',
        'payload': {
            'lat': this.genParams['coordinates'][1],
            'lon': this.genParams['coordinates'][0],
        },
    };

    constructor(private httpClient: HttpClient,
        private dialogService: NbDialogService,
        public generalParams: GeneralParamsService,
        private model2: Model2ParamInitService,
        private model1: Model1ParamInitService,
        private dateService: NbDateService<Date>,
        private controlFileService: ControlFileService,
        private economyFileService: EconomyFileService,
        protected router: Router,
        protected menuService: NbMenuService) {
        this.genParams = this.generalParams.parameters;
        this.menuService.onItemClick()
            .pipe(
                takeWhile(() => this.alive),
            )
            .subscribe(item => {
                if (item['item']['title'] === 'Load Scenario') {
                    setTimeout(() => {
                        return this.router.navigateByUrl('/pages/scenario-manager');
                    }, 2000);
                    setTimeout(() => {
                        return this.router.navigateByUrl('/pages/scenario-manager/load-scenario');
                    }, 2000);
                }
            });

        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;

        this.subscriptions.push(this.model2.paramUpdated.subscribe(
            (data) => this.paramInit = data,
        ));

        this.subscriptions.push(this.model1.paramUpdated.subscribe(
            (data) => this.paramInit = data,
        ));

        // Subscribe to events to get modified data
        this.subscriptions.push(this.generalParams.parametersSubject.subscribe(
            (data) => {
                this.generalParams['formName'] = data['formName'];
                this.generalParams['startingDate'] = data['startingDate'];
                this.generalParams['endingDate'] = data['endingDate'];
                this.generalParams['formDescription'] = data['formDescription'];
                this.generalParams['model'] = data['model'];
            },
        ));

        this.subscriptions.push(this.controlFileService.controlFileUpdated.subscribe(
            (data) => this.controlSystem = data,
        ));

        this.subscriptions.push(this.economyFileService.economyFileUpdated.subscribe(
            (data) => this.econEnv = data,
        ));
    }

    ngOnInit() {
        this.dialogService.open(DialogSelectFormPromptComponent)
            .onClose.subscribe(name => {
                if (name) {
                    // Update formName - formDescription based on user input in dialog box
                    this.genParams['formName'] = name['formName'];
                    let finalFormName = '';
                    finalFormName = this.genParams['formName'].toString();
                    this.genParams['formDescription'] = name['formDescription'];
                    this.generalParams.updateGeneralParameters(this.genParams['formDescription'], 'formDescription');
                    this.generalParams.updateGeneralParameters(this.genParams['formName'], 'formName');
                    const url = '/planet/rest/load_data';
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
                                this.paramInit['payload']['simulation']['simulation.time'] =
                                    this.paramInit['payload']['simulation']['simulation.time'] *
                                    this.paramInit['payload']['simulation']['time.step'];
                                this.paramInit['payload']['simulation']['time.step'] = 60 *
                                    this.paramInit['payload']['simulation']['time.step'];
                                this.generalParams.updateGeneralParameters(this.paramInit['payload']['model'], 'model');
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
                                this.genParams['startingDate'] = new Date(temp['payload']['startDate']);
                                this.genParams['endingDate'] = new Date(temp['payload']['endDate']);
                                this.generalParams.updateGeneralParameters(this.genParams['startingDate'], 'startingDate');
                                this.generalParams.updateGeneralParameters(this.genParams['endingDate'], 'endingDate');
                                this.genParams['loadRangeDate'] = {
                                    start: this.dateService.addDay(this.dateStart, 0),
                                    end: this.dateService.addDay(this.dateEnd, 0),
                                };
                                this.generalParams.updateGeneralParameters(this.genParams['loadRangeDate'], 'loadRangeDate');
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
                } else {
                    this.router.navigateByUrl('/pages/scenario-manager');
                }
            },
            );
    }

    startUpload(): void {
        // Start spinner
        this.loading = true;
        const formData: FormData = new FormData();
        const originalTimestep = this.paramInit['payload']['simulation']['time.step'];
        const originalHorizon = this.paramInit['payload']['simulation']['simulation.time'];

        this.paramInit['payload']['simulation']['time.step'] = this.paramInit['payload']['simulation']['time.step'] / 60;
        this.paramInit['payload']['simulation']['simulation.time'] =
            Math.round(this.paramInit['payload']['simulation']['simulation.time']
                / this.paramInit['payload']['simulation']['time.step']);
        // Update values in case current instance will be used to save another scenario
        const startDate = this.genParams['startingDate'].getFullYear().toString() +
            '-' + (this.genParams['startingDate'].getMonth() + 1).toString() +
            '-' + this.genParams['startingDate'].getDate().toString();
        const endDate = this.genParams['endingDate'].getFullYear().toString() +
            '-' + (this.genParams['endingDate'].getMonth() + 1).toString() +
            '-' + this.genParams['endingDate'].getDate().toString();
        delete this.paramInit['_id'];
        this.paramInit['payload']['formName'] = this.genParams['formName'];
        this.paramInit['payload']['formDescription'] = this.genParams['formDescription'];
        this.paramInit['payload']['model'] = this.genParams['model'];
        this.paramInit['payload']['startDate'] = startDate;
        this.paramInit['payload']['endDate'] = endDate;
        this.updateModel();

        delete this.controlSystem['_id'];
        this.controlSystem['payload']['formName'] = this.genParams['formName'];
        this.controlSystem['payload']['formDescription'] = this.genParams['formDescription'];
        this.updateControlFile();
        delete this.econEnv['_id'];
        this.econEnv['payload']['formName'] = this.genParams['formName'];
        this.econEnv['payload']['formDescription'] = this.genParams['formDescription'];
        this.updateEconomyFile();
        formData.append('param1', JSON.stringify(this.paramInit));
        formData.append('param2', JSON.stringify(this.controlSystem));
        formData.append('param3', JSON.stringify(this.econEnv));
        formData.append('param4', JSON.stringify(this.elecParam));
        formData.append('param5', JSON.stringify(this.heatParam));
        formData.append('method', 'LOAD');
        let url = '/planet/rest/upload';
        this.httpClient.post(url, formData,
        )
            .subscribe(
                () => {
                    const oldWindValue = JSON.stringify(this.windParam['payload']).replace(/ /g, '+');
                    this.windParam['payload'] = JSON.parse(oldWindValue);
                    this.windParam['payload']['formName'] = this.genParams['formName'];
                    this.windParam['payload']['formDescription'] = this.genParams['formDescription'];
                    this.windParam['payload']['startDate'] = startDate;
                    this.windParam['payload']['endDate'] = endDate;
                    this.pvParam['payload']['formName'] = this.genParams['formName'];
                    this.pvParam['payload']['formDescription'] = this.genParams['formDescription'];
                    this.pvParam['payload']['startDate'] = startDate;
                    this.pvParam['payload']['endDate'] = endDate;
                    url = '/planet/rest/save_data';
                    this.httpClient.post(url, {
                        'windPayload': JSON.stringify(this.windParam),
                        'pvPayload': JSON.stringify(this.pvParam),
                        'method': 'LOAD',
                    },
                    )
                        .subscribe(
                            data => {
                                this.loading = false;
                                this.paramInit['payload']['simulation']['time.step'] = originalTimestep;
                                this.paramInit['payload']['simulation']['simulation.time'] = originalHorizon;
                            },
                            error => {
                                // console.log('Error', error);
                                this.loading = false;
                                this.saveMessage = error.error.text;
                                this.paramInit['payload']['simulation']['time.step'] = originalTimestep;
                                this.paramInit['payload']['simulation']['simulation.time'] = originalHorizon;
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
        if (!this.genParams['startingDate']) {
            this.genParams['startingDate'] = new Date(2016, 0, 1);
        }
        return new Date(this.genParams['startingDate']);
    }

    get dateEnd(): Date {
        if (!this.genParams['endingDate']) {
            this.genParams['endingDate'] = new Date(2016, 11, 31);
        }
        return new Date(this.genParams['endingDate']);
    }

    updateModel() {
        switch (this.genParams['model']) {
            case 1:
                this.model1.changeModel(this.paramInit);
                this.model1.paramUpdated.next(this.paramInit);
                break;
            case 2:
                this.model2.changeModel(this.paramInit);
                this.model2.paramUpdated.next(this.paramInit);
                break;
        }
    }

    updateControlFile() {
        this.controlFileService.controlFileUpdated.next(this.controlSystem);
    }

    updateEconomyFile() {
        this.economyFileService.economyFileUpdated.next(this.econEnv);
    }

    ngOnDestroy() {
        this.alive = false;
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
