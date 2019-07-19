import { Component, EventEmitter } from '@angular/core';
import { UploadInput, humanizeBytes } from 'ngx-uploader';
import { HttpClient } from '@angular/common/http';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { NbDialogService } from '@nebular/theme';
import { DialogInfoPromptComponent } from '../../../@theme/components/planet/dialogs/info-prompt-dialog.component';
import { Model2ParamInitService } from '../../../@theme/services/scenario-manager-services/model2-param-init.service';
import { GeneralParamsService } from '../../../@theme/services/scenario-manager-services/general-params.service';
import { Model1ParamInitService } from '../../../@theme/services/scenario-manager-services/model1-param-init.service';
import { ControlFileService } from '../../../@theme/services/scenario-manager-services/control-file.service';
import { EconomyFileService } from '../../../@theme/services/scenario-manager-services/economy-file.service';

@Component({
    selector: 'ngx-create-scenario',
    styleUrls: ['../../../@theme/styles/scenario.component.scss'],
    providers: [GeneralParamsService,
        Model2ParamInitService,
        Model1ParamInitService,
        ControlFileService,
        EconomyFileService],
    templateUrl: './create-scenario.component.html',
})
export class CreateScenarioComponent {

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
        private generalParams: GeneralParamsService,
        private model2: Model2ParamInitService,
        private model1: Model1ParamInitService,
        private controlFileService: ControlFileService,
        private economyFileService: EconomyFileService) {
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

        this.generalParams.startingDateUpdate.subscribe(
            (data) => this.generalParams.startingDate = data,
        );

        this.generalParams.endingDateUpdate.subscribe(
            (data) => this.generalParams.endingDate = data,
        );

        this.generalParams.formDescriptionUpdated.subscribe(
            (data) => this.generalParams.formDescription = data,
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

    startUpload(): void {
        // Start spinner
        this.loading = true;
        const formData: FormData = new FormData();

        // Add files to formData and transform the time step to the form that the model works

        const originalTimestep = this.paramInit['payload']['simulation']['time.step'];
        const originalHorizon = this.paramInit['payload']['simulation']['simulation.time'];
        this.paramInit['payload']['simulation']['time.step'] = this.paramInit['payload']['simulation']['time.step'] / 60;
        this.paramInit['payload']['simulation']['simulation.time'] =
            Math.round(this.paramInit['payload']['simulation']['simulation.time']
                / this.paramInit['payload']['simulation']['time.step']);

        // Update Parameters in case the user will save another scenario in the same instance
        const startDate = this.generalParams.startingDate.getFullYear().toString() +
            '-' + (this.generalParams.startingDate.getMonth() + 1).toString() +
            '-' + this.generalParams.startingDate.getDate().toString();
        const endDate = this.generalParams.endingDate.getFullYear().toString() +
            '-' + (this.generalParams.endingDate.getMonth() + 1).toString() +
            '-' + this.generalParams.endingDate.getDate().toString();
        this.paramInit['payload']['formName'] = this.generalParams.formName;
        this.paramInit['payload']['formDescription'] = this.generalParams.formDescription;
        this.paramInit['payload']['model'] = this.generalParams.model;
        this.paramInit['payload']['startDate'] = startDate;
        this.paramInit['payload']['endDate'] = endDate;
        this.updateModel();
        this.controlSystem['payload']['formName'] = this.generalParams.formName;
        this.controlSystem['payload']['formDescription'] = this.generalParams.formDescription;
        this.updateControlFile();
        this.econEnv['payload']['formName'] = this.generalParams.formName;
        this.econEnv['payload']['formDescription'] = this.generalParams.formDescription;
        this.updateEconomyFile();
        formData.append('param1', JSON.stringify(this.paramInit));
        formData.append('param2', JSON.stringify(this.controlSystem));
        formData.append('param3', JSON.stringify(this.econEnv));
        formData.append('method', 'NEW');
        let url = '/planet/rest/upload';
        this.httpClient.post(url, formData,
        )
            .subscribe(
                () => {
                    const oldWindValue = JSON.stringify(this.windParam['payload']).replace(/ /g, '+');
                    this.windParam['payload'] = JSON.parse(oldWindValue);
                    this.windParam['payload']['formName'] = this.generalParams.formName;
                    this.windParam['payload']['formDescription'] = this.generalParams.formDescription;
                    this.windParam['payload']['startDate'] = startDate;
                    this.windParam['payload']['endDate'] = endDate;
                    this.pvParam['payload']['formName'] = this.generalParams.formName;
                    this.pvParam['payload']['formDescription'] = this.generalParams.formDescription;
                    this.pvParam['payload']['startDate'] = startDate;
                    this.pvParam['payload']['endDate'] = endDate;
                    url = '/planet/rest/save_data';
                    this.httpClient.post(url, {
                        'windPayload': JSON.stringify(this.windParam),
                        'pvPayload': JSON.stringify(this.pvParam),
                    },
                    )
                        .subscribe(
                            data => {
                                this.loading = false;
                                this.saveMessage = '';
                                this.paramInit['payload']['simulation']['time.step'] = originalTimestep;
                                this.paramInit['payload']['simulation']['simulation.time'] = originalHorizon;
                            },
                            error => {
                                this.loading = false;
                                this.saveMessage = error.error.text;
                                this.paramInit['payload']['simulation']['time.step'] = originalTimestep;
                                this.paramInit['payload']['simulation']['simulation.time'] = originalHorizon;
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

    openDialogBox(context) {
        // Function to open a new dialog box given its corresponding component
        this.dialogService.open(DialogInfoPromptComponent, context)
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
        const context = {
            context: {
                title: 'This is a title passed to the dialog component',
            },
        };
        switch (id) {
            case 2:
                context['context']['title'] = 'Enter the technologies and their parameters for each of the nodes';
                this.openDialogBox(context);
                break;
            case 3:
                this.phase3 = true;
                context['context']['title'] = 'Enter the control mode';
                this.openDialogBox(context);
                break;
            case 4:
                this.phase4 = true;
                context['context']['title'] = 'Enter the economy and cost parameters';
                if (controller === this.transitionController4) {
                    this.openDialogBox(context);
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

    updateControlFile() {
        this.controlFileService.controlFileUpdated.emit(this.controlSystem);
    }

    updateEconomyFile() {
        this.economyFileService.economyFileUpdated.emit(this.econEnv);
    }
}
