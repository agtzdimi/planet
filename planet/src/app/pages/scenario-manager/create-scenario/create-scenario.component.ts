import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
/* Import for the timeseries profiles
import { sprintf } from 'sprintf-js';
*/

import { NbDialogService } from '@nebular/theme';

import { DialogInfoPromptComponent } from '../../../@theme/components/planet/dialogs/info-prompt-dialog.component';
import { Model2ParamInitService } from '../../../@theme/services/scenario-manager-services/model2-param-init.service';
import { GeneralParamsService } from '../../../@theme/services/scenario-manager-services/general-params.service';
import { Model1ParamInitService } from '../../../@theme/services/scenario-manager-services/model1-param-init.service';
import { ControlFileService } from '../../../@theme/services/scenario-manager-services/control-file.service';
import { EconomyFileService } from '../../../@theme/services/scenario-manager-services/economy-file.service';
import { UserProfileService } from '../../../@theme/services';


/**
 * Component responsible for the creation of a new scenario
 */
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
/**
 * @param {number} gotPhase2  Private variable to check whether the phase 2 of scenario-creation reached
 * @param {Object} paramInit Private variable holding the instance of a JSON model corresponding to the user selections.
 * @example The paramInit will hold the JSON structure of 8-node electricity grid, 3-node district heating and 1-node gas grid
 * @param {Subscription[]} subscriptions Private variable holding the custom Observables to unsubscribe when the component will be destroyed
 * @param {boolean} phase2 Variable holding the status of reaching phase2 [true|false]
 * @param {boolean} phase3 Variable holding the status of reaching phase3 [true|false]
 * @param {boolean} phase4 Variable holding the status of reaching phase4 [true|false]
 * @param {boolean} phase5 Variable holding the status of reaching phase5 [true|false]
 * @param {boolean} loading Variable used to define if the spinner of ```Save Scenario``` button will spin or not as a loader
 * @param {string} saveMessage Variable that will hold the status of Saving a Scenario after user submission
 * @param {TransitionController} transitionController2 Variable to animate the transition between phase 1 and phase 2
 * @param {TransitionController} transitionController3 Variable to animate the transition between phase 2 and phase 3
 * @param {TransitionController} transitionController4 Variable to animate the transition between phase 3 and phase 4
 * @param {TransitionController} transitionController5 Variable to animate the transition between phase 4 and phase 5
 * @param {Object} controlSystem Variable holding the JSON structure of ```Control_initialization.txt``` file
 * @param {Object} econEnv Variable holding the JSON structure of ```Economy_environment_initialization.txt``` file
 * @param {Object} genParams Variable that is used to shortcut the general parameters irrelevent to the grids i.e horizon / time step etc.
 * @param {Object} windParam Variable to hold the necessary information to make a request to renewables Ninja API to retrieve Wind timeseries
 * @param {Object} pvParam Variable to hold the necessary information to make a request to renewables Ninja API to retrieve PV timeseries
 *
 */
export class CreateScenarioComponent implements OnDestroy {

    private gotPhase2: number = 0;
    private paramInit: Object = {};
    private subscriptions: Subscription[] = [];
    public phase2: boolean = false;
    public phase3: boolean = false;
    public phase4: boolean = false;
    public phase5: boolean = false;
    public loading: boolean = false;
    public saveMessage: string = '';
    public transitionController2: TransitionController = new TransitionController();
    public transitionController3: TransitionController = new TransitionController();
    public transitionController4: TransitionController = new TransitionController();
    public transitionController5: TransitionController = new TransitionController();
    private controlSystem: Object = {};
    private econEnv: Object = {};
    private genParams: Object = {};

    public windParam: Object = {
        'file.name': 'Wind.xlsx',
        'payload': {
            'lat': this.generalParams.parameters['coordinates'][1],
            'lon': this.generalParams.parameters['coordinates'][0],
        },
    };

    public pvParam: Object = {
        'file.name': 'PV.xlsx',
        'payload': {
            'lat': this.generalParams.parameters['coordinates'][1],
            'lon': this.generalParams.parameters['coordinates'][0],
        },
    };
    // nodes: string;
    // profiles = [];
    // private showProfiles: boolean = false;

    /**
     * @param {HttpClient} httpClient Angular service to make REST requests
     * @param {NbDialogService} dialogService Nebular service to open a new dialog screen over the current one
     * @param {GeneralParamsService} generalParams Custom service responsible on holding the general parameters of the scenario e.g horizon, timestep
     * @param {Model2ParamInitService} model2 Custom service holding the structure of model 2
     * @param {Model1ParamInitService} model1 Custom service holding the structure of model 2
     * @param {ControlFileService} controlFileService Custom service holding the structure of Control_initialization.txt
     * @param {EconomyFileService} economyFileService Custom service holding the structure of Economy_environment_initialization.txt
     * @param {UserProfileService} userProfile Custom service to get User's information like the email
     */
    constructor(private httpClient: HttpClient,
        private dialogService: NbDialogService,
        private generalParams: GeneralParamsService,
        private model2: Model2ParamInitService,
        private model1: Model1ParamInitService,
        private controlFileService: ControlFileService,
        private economyFileService: EconomyFileService,
        private userProfile: UserProfileService) {
        this.genParams = this.generalParams.parameters;

        // Subscribe to Events and get back the modified data
        this.subscriptions.push(this.model1.paramUpdated.subscribe(
            (data: Object) => this.paramInit = data,
        ));

        this.subscriptions.push(this.model2.paramUpdated.subscribe(
            (data: Object) => this.paramInit = data,
        ));

        this.subscriptions.push(this.generalParams.parametersSubject.subscribe(
            (data: Object) => {
                this.genParams['formName'] = data['formName'];
                this.genParams['startingDate'] = data['startingDate'];
                this.genParams['endingDate'] = data['endingDate'];
                this.genParams['formDescription'] = data['formDescription'];
                this.genParams['model'] = data['model'];
            },
        ));

        this.subscriptions.push(this.controlFileService.controlFileUpdated.subscribe(
            (data: Object) => this.controlSystem = data,
        ));

        this.subscriptions.push(this.economyFileService.economyFileUpdated.subscribe(
            (data: Object) => this.econEnv = data,
        ));
    }

    /**
    *
    * Function responsible for uploading the user configuration to server and save them to the Database
    * @example
    * startUpload()
    *
    * @returns A message to the user on the screen with the outcome of the server response
    */
    public startUpload(): void {
        // Start spinner
        this.loading = true;
        this.updateVES();
        const formData: FormData = new FormData();

        // Add files to formData and transform the time step to the form that the model works

        const originalTimestep: number = this.paramInit['payload']['simulation']['time.step'];
        const originalHorizon: number = this.paramInit['payload']['simulation']['simulation.time'];
        this.paramInit['payload']['simulation']['time.step'] = this.paramInit['payload']['simulation']['time.step'] / 60;
        this.paramInit['payload']['simulation']['simulation.time'] =
            Math.round(this.paramInit['payload']['simulation']['simulation.time']
                / this.paramInit['payload']['simulation']['time.step']);

        // Update Parameters in case the user will save another scenario in the same instance
        const startDate: string = this.genParams['startingDate'].getFullYear().toString() +
            '-' + (this.genParams['startingDate'].getMonth() + 1).toString() +
            '-' + this.genParams['startingDate'].getDate().toString();
        const endDate: string = this.genParams['endingDate'].getFullYear().toString() +
            '-' + (this.genParams['endingDate'].getMonth() + 1).toString() +
            '-' + this.genParams['endingDate'].getDate().toString();
        this.paramInit['payload']['formName'] = this.genParams['formName'];
        this.paramInit['payload']['formDescription'] = this.genParams['formDescription'];
        this.paramInit['payload']['model'] = this.genParams['model'];
        this.paramInit['payload']['startDate'] = startDate;
        this.paramInit['payload']['endDate'] = endDate;
        const today = new Date();
        this.paramInit['payload']['eventDate'] = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${
            today.getDate().toString().padStart(2, '0')}/${
            today.getFullYear().toString().padStart(4, '0')} ${
            today.getHours().toString().padStart(2, '0')}:${
            today.getMinutes().toString().padStart(2, '0')}`;
        this.paramInit['payload']['owner'] = this.userProfile.getName();
        this.updateModel();
        this.controlSystem['payload']['formName'] = this.genParams['formName'];
        this.controlSystem['payload']['formDescription'] = this.genParams['formDescription'];
        this.updateControlFile();
        this.econEnv['payload']['formName'] = this.genParams['formName'];
        this.econEnv['payload']['formDescription'] = this.genParams['formDescription'];
        this.updateEconomyFile();
        formData.append('param1', JSON.stringify(this.paramInit));
        formData.append('param2', JSON.stringify(this.controlSystem));
        formData.append('param3', JSON.stringify(this.econEnv));
        formData.append('method', 'NEW');
        formData.append('email', this.userProfile.getEmail());
        let url: string = '/planet/rest/upload';
        this.httpClient.post(url, formData,
        )
            .subscribe(
                (timeStamp) => {
                    const oldWindValue: string = JSON.stringify(this.windParam['payload']).replace(/ /g, '+');
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
                        'email': this.userProfile.getEmail(),
                        'timeStamp': timeStamp['timeStamp'],
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
                                // console.log('2', error.error);
                            },
                        );
                },
                error => {
                    this.loading = false;
                    this.saveMessage = '';
                    // console.log('3', error);
                },
            );
    }

    /**
    *
    * Function responsible for Opening a dialog box over the current screen
    * @example
    * openDialogBox(context)
    * context = { context: { title: 'This is a title passed to the dialog component'}}
    *
    * @param {Object} context Object holding the title for the dialog box
    * @returns A dialog box with some information for the user
    */
    private openDialogBox(context: Object): void {
        // Function to open a new dialog box given its corresponding component
        this.dialogService.open(DialogInfoPromptComponent, context)
            .onClose.subscribe(value => { });
    }

    /**
    *
    * Function to check whether the phase 2 is active or not
    * @example
    * checkPhase2()
    *
    * @returns [true|false]
    */
    public checkPhase2(): boolean {
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

    /* TODO when profiles charts will be visible for the users in scenario creation

     getProfiles() {
        const url = '/planet/rest/get_profiles';
        const startDate = this.genParams['startingDate'].getFullYear().toString() +
            '-' + (this.genParams['startingDate'].getMonth() + 1).toString() +
            '-' + this.genParams['startingDate'].getDate().toString();
        const endDate = this.genParams['endingDate'].getFullYear().toString() +
            '-' + (this.genParams['endingDate'].getMonth() + 1).toString() +
            '-' + this.genParams['endingDate'].getDate().toString();
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
        switch (this.genParams['model']) {
            case 1:
                this.nodes = '1';
                break;
            case 2:
                this.nodes = '8';
                break;
        }
        this.httpClient.get(url, {
            params: {
                'windPayload': JSON.stringify(this.windParam),
                'pvPayload': JSON.stringify(this.pvParam),
                'nodes': this.nodes,
                'timeStep': String(this.paramInit['payload']['simulation']['time.step'] / 60),
                'email': this.userProfile.getEmail(),
            },
        })
            .subscribe(
                (res) => {

                    const lines = res['electricity'].split('\n');
                    const headers = lines[0].split(',');
                    for (let index = 0; index < headers.length; index++) {
                        this.profiles.push(this.getColumnData(lines, index));
                    }
                    const hours = ['Hours'];
                    headers[headers.length] = 'Hours';
                    const date = this.genParams['startingDate'];
                    for (let i = 1; i < this.profiles[0].length; i++) {
                        if ((this.paramInit['payload']['simulation']['time.step'] / 60) %
                            (Math.round(24 / this.paramInit['payload']['simulation']['time.step'])) === 0) {
                            const val = date.getFullYear().toString() +
                                '/' + (date.getMonth() + 1).toString() +
                                '/' + date.getDate().toString();
                            hours.push(val);
                        } else {
                            const val = sprintf('%02d', date.getHours()) + ':' + sprintf('%02d', date.getMinutes());
                            hours.push(val);
                            date.setMinutes(date.getMinutes() + this.paramInit['payload']['simulation']['time.step']);
                        }
                    }
                    this.profiles.push(hours);
                    // this.showProfiles = true;
                },
            );
    }

    getColumnData(lines, column: number) {
        let result = lines.map(val => {
            const value = val.split(',');
            return value[column];
        },
        );
        if (result[result.length - 1] === undefined) {
            result = result.slice(0, -1);
        }
        return result;
    }
    */

    /**
   *
   * Function to initialize the title of the dialog box for each phase and call the necessary function to open the box
   * @example
   * animateInfo(transitionController, transitionName, id)
   *
   * @param {TransitionController} controller Every phase will pass a different transitionController to add an animation
   * @param {string} transitionName The type of the animation e.g slide down / scale etc complete list
   * on https://edcarroll.github.io/ng2-semantic-ui/#/modules/transition|SemanticUI
   * @param {number} id The id corresponding to the phase number
   *
   */
    public animateInfo(controller: TransitionController, transitionName: string = 'slide down', id: number): void {
        // Switcher to call the correct dialog component based on the phase of configuration
        const context: Object = {
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

    /**
    *
    * Function responsible to initialize VES time.step
    * @example
    * updateVES()
    *
    */
    private updateVES(): void {
        let nodes = 1;
        if (this.genParams['model'] === 2) {
            nodes = 8;
        }
        for (let i = 0; i < nodes; i++) {
            if (this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['VES']['name']) {
                this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['VES']['parameters']['timeStep'] = this.paramInit['payload']['simulation']['time.step'];
                this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['VES']['simulationID'] = this.genParams['formName'];
                this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['VES']['nodeID'] = 'node.' + (i + 1);
                this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['VES']['VESPortfolioID'] = this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['VES']['name'];
            }
        }
    }

    /**
   *
   * Function to update the user selected model [model1|model2]
   * @example
   * updateModel()
   *
   */
    private updateModel(): void {
        switch (this.genParams['model']) {
            case 1:
                this.model1.paramUpdated.next(this.paramInit);
                break;
            case 2:
                this.model2.paramUpdated.next(this.paramInit);
                break;
        }
    }

    /**
    *
    * Function to update the Control_initialazation.txt parameters
    * @example
    * updateControlFile()
    *
    */
    private updateControlFile() {
        this.controlFileService.controlFileUpdated.next(this.controlSystem);
    }

    /**
    *
    * Function to update the Economy_environment_initialization.txt parameters
    * @example
    * updateEconomyFile()
    *
    */
    private updateEconomyFile() {
        this.economyFileService.economyFileUpdated.next(this.econEnv);
    }

    /**
    * Angular lifecycle hook on Component destroyed. used to clear the Observable subscriptions
    */
    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
