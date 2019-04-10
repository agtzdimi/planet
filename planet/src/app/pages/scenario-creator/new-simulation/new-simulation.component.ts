import { Component, EventEmitter } from '@angular/core';
import { UploadInput, humanizeBytes } from 'ngx-uploader';
import { HttpClient } from '@angular/common/http';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { NbDialogService } from '@nebular/theme';
import { DialogControlSystemPromptComponent } from '../dialog-prompt/control-system-dialog.component';
import { DialogTechParamPromptComponent } from '../dialog-prompt/tech-param-dialog.component';
import { DialogEconomyPromptComponent } from '../dialog-prompt/economy-dialog.component';
import { EnvService } from '../../../env.service';
import { Model2ParamInitService } from '../services/model2-param-init.service';
import { GeneralParamsService } from '../services/general-params.service';
import { Model1ParamInitService } from '../services/model1-param-init.service';

@Component({
    selector: 'ngx-new-simulation',
    styleUrls: ['./new-simulation.component.scss'],
    providers: [GeneralParamsService, Model2ParamInitService, Model1ParamInitService],
    templateUrl: './new-simulation.component.html',
})
export class NewSimulationFilesComponent {

    formData: FormData;
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;
    gotPhase2 = 0;
    paramInit = {};
    phase2: boolean = false;
    phase3: boolean = false;
    phase4: boolean = false;
    phase5: boolean = false;
    loading: boolean = false;
    revealed = false;
    saveMessage: String = '';
    transitionController2 = new TransitionController();
    transitionController3 = new TransitionController();
    transitionController4 = new TransitionController();
    transitionController5 = new TransitionController();
    transitionController6 = new TransitionController();
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
        private generalParams: GeneralParamsService,
        private model2: Model2ParamInitService,
        private model1: Model1ParamInitService) {
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;

        // Subscribe to Events and get back the modified data
        this.model1.paramUpdated.subscribe(
            (data) => this.paramInit = data,
        );

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

        this.generalParams.filesUpdate.subscribe(
            (data) => this.generalParams.files = data,
        );

        this.generalParams.modelUpdate.subscribe(
            (data) => this.generalParams.model = data,
        );
    }

    startUpload(): void {
        // Start spinner
        this.loading = true;
        const formData: FormData = new FormData();

        // Add files to formData and transform the time step to the form that the model works
        for (let i = 0; i < this.generalParams.files.length; i++) {
            const file: File = this.generalParams.files[i];
            formData.append('file', file, file.name);
        }

        if (this.generalParams.timeStep['mins']) {
            this.paramInit['payload']['simulation']['time.step'] = this.paramInit['payload']['simulation']['time.step'] / 60;
        }
        if (this.generalParams.simulationTime['days']) {
            this.paramInit['payload']['simulation']['simulation.time'] =
                this.paramInit['payload']['simulation']['simulation.time']
                * 24 / this.paramInit['payload']['simulation']['time.step'];
        }

        // Update Parameters in case the user will save another scenario in the same instance
        this.generalParams.simulationTime['days'] = false;
        this.generalParams.simulationTime['hours'] = true;
        this.generalParams.timeStep['mins'] = false;
        this.generalParams.timeStep['hours'] = true;
        this.paramInit['payload']['formName'] = this.generalParams.formName;
        this.paramInit['payload']['formDescription'] = this.generalParams.formDescription;
        this.updateModel();
        this.generalParams.updateTimestep(this.generalParams.timeStep);
        this.generalParams.updateSimulationTime(this.generalParams.simulationTime);

        this.controlSystem['payload']['formName'] = this.generalParams.formName;
        this.controlSystem['payload']['formDescription'] = this.generalParams.formDescription;
        this.econEnv['payload']['formName'] = this.generalParams.formName;
        this.econEnv['payload']['formDescription'] = this.generalParams.formDescription;
        formData.append('param1', JSON.stringify(this.paramInit));
        formData.append('param2', JSON.stringify(this.controlSystem));
        formData.append('param3', JSON.stringify(this.econEnv));
        formData.append('method', 'NEW');
        let url = 'http://' + this.env.planet + ':' + this.env.planetRESTPort + '/upload';
        this.httpClient.post(url, formData,
        )
            .subscribe(
                () => {
                    this.windParam['payload']['formName'] = this.generalParams.formName;
                    this.windParam['payload']['formDescription'] = this.generalParams.formDescription;
                    this.pvParam['payload']['formName'] = this.generalParams.formName;
                    this.pvParam['payload']['formDescription'] = this.generalParams.formDescription;
                    url = 'http://' + this.env.planet + ':' + this.env.planetRESTPort + '/save_data';
                    this.httpClient.post(url, {
                        'windPayload': JSON.stringify(this.windParam),
                        'pvPayload': JSON.stringify(this.pvParam),
                    },
                    )
                        .subscribe(
                            data => {
                                this.loading = false;
                                this.saveMessage = '';
                            },
                            error => {
                                this.loading = false;
                                this.saveMessage = error.error.text;
                                // console.log("2", error.error);
                            },
                        );
                },
                error => {
                    this.loading = false;
                    this.saveMessage = '';
                    // console.log("3", error);
                },
            );
    }

    openDialogBox(component) {
        // Function to open a new dialog box given its corresponding component
        this.dialogService.open(component)
            .onClose.subscribe(value => { });
    }

    checkPhase2() {
        // Check if the general parameters are set to continue
        if (this.phase2) {
            if (this.gotPhase2 === 0) {
                this.animateInfo(this.transitionController2, 'transitionName2', 2);
                this.gotPhase2++;
            }
            return true;
        } else {
            return false;
        }
    }

    public animateInfo(controller, transitionName: string = 'slide down', id) {
        // Switcher to call the correct dialog component based on the phase of configuration
        switch (id) {
            case 2:
                this.openDialogBox(DialogTechParamPromptComponent);
                break;
            case 3:
                this.phase3 = true;
                this.openDialogBox(DialogControlSystemPromptComponent);
                break;
            case 4:
                this.phase4 = true;
                if (controller === this.transitionController4) {
                    this.openDialogBox(DialogEconomyPromptComponent);
                }
                break;
            case 5:
                this.phase5 = true;
                break;
        }
        controller.animate(
            new Transition(transitionName, 2000, TransitionDirection.In));
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
}
