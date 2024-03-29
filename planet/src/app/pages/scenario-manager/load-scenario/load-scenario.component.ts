import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { takeWhile } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import {
    NbDialogService,
    NbDateService,
    NbMenuService,
} from '@nebular/theme';

import { GeneralParamsService } from '../../../@theme/services/scenario-manager-services/general-params.service';
import { UserProfileService } from '../../../@theme/services';
import { ScenarioPanelComponent } from '../../../@theme/components';
import { TurinGridInitService } from '../../../@theme/services/scenario-manager-services/turin-grid-init.service';


/**
 * Component responsible for the loading of a saved scenario
 */
@Component({
    selector: 'ngx-load-scenario',
    styleUrls: ['../../../@theme/styles/scenario.component.scss'],
    providers: [GeneralParamsService],
    templateUrl: './load-scenario.component.html',
})
/**
 * @param {boolean} loadPage  Private variable to check whether the data has retrieved from the GET request
 * @param {string} saveMessage Variable that will hold the status of Saving a Scenario after user submission
 * @param {Object} paramInit Private variable holding the instance of a JSON model corresponding to the user selections.
 * @example The paramInit will hold the JSON structure of 8-node electricity grid, 3-node district heating and 1-node gas grid
 * @param {Subscription[]} subscriptions Private variable holding the custom Observables to unsubscribe when the component will be destroyed
 * @param {boolean} alive Variable indicating that the component exists
 * @param {boolean} loading Variable used to define if the spinner of ```Save Scenario``` button will spin or not as a loader
 * @param {Object} genParams Variable that is used to shortcut the general parameters irrelevent to the grids i.e horizon / time step etc.
 * @param {Object} elecParam Variable to hold the electricity timeseries values that was used in the loaded scenario
 * @param {Object} heatParam Variable to hold the electricity timeseries values that was used in the loaded scenario
 * @param {Object} windParam Variable to hold the necessary information to make a request to renewables Ninja API to retrieve Wind timeseries
 * @param {Object} pvParam Variable to hold the necessary information to make a request to renewables Ninja API to retrieve PV timeseries
 *
 */
export class LoadScenarioComponent implements OnInit, OnDestroy {

    public loadPage: boolean = false;
    public saveMessage: string = '';
    private paramInit: Object = {};
    private subscriptions: Subscription[] = [];
    private alive: boolean = true;
    public loading: boolean = false;
    public genParams: Object = {};
    private elecParam: Object;
    private heatParam: Object;

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

    /**
    * @param {HttpClient} httpClient Angular service to make REST requests
    * @param {NbDialogService} dialogService Nebular service to open a new dialog screen over the current one
    * @param {GeneralParamsService} generalParams Custom service responsible on holding the general parameters of the scenario e.g horizon, timestep
    * @param {NbDateService<Date>} dateService Nebular date service to handle the date ranges
    * @param {Router} router Angular service to apply navigation
    * @param {NbMenuService} menuService Nebular service to get access to the Menu service i.e the sidebar menu
    * @param {UserProfileService} userProfile Custom service to get User's information like the email
    */
    constructor(private httpClient: HttpClient,
        private dialogService: NbDialogService,
        public generalParams: GeneralParamsService,
        private turinGrid: TurinGridInitService,
        private dateService: NbDateService<Date>,
        protected router: Router,
        protected menuService: NbMenuService,
        private userProfile: UserProfileService) {
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

        // Subscribe to events to get modified data
        this.subscriptions.push(this.generalParams.parametersSubject.subscribe(
            (data: Object) => {
                this.generalParams['startingDate'] = data['startingDate'];
                this.generalParams['endingDate'] = data['endingDate'];
            },
        ));
    }

    /**
  * Angular lifecycle hook used to retrive all the data from the backend and spread it to the components
  */
    ngOnInit() {
        this.dialogService.open(ScenarioPanelComponent)
            .onClose.subscribe(name => {
                if (name) {
                    // Update formName - formDescription based on user input in dialog box
                    this.genParams['formName'] = name['formName'];
                    let finalFormName: string = '';
                    finalFormName = this.genParams['formName'].toString();
                    this.genParams['formDescription'] = name['formDescription'];
                    this.generalParams.updateGeneralParameters(this.genParams['formDescription'], 'formDescription');
                    this.generalParams.updateGeneralParameters(this.genParams['formName'], 'formName');
                    const url: string = '/planet/rest/load_data';
                    this.httpClient.get(url, {
                        params: {
                            'formName': finalFormName,
                            'email': this.userProfile.getEmail(),
                        },
                    })
                        .subscribe(
                            data => {
                                // Load and emit the data coming from Database
                                this.loadPage = true;
                                let temp: Object = JSON.parse(data['paramInit']);
                                this.paramInit = temp;
                                this.turinGrid.changeModel(this.paramInit);
                                this.paramInit['payload']['simulation']['simulation.time'] =
                                    this.paramInit['payload']['simulation']['simulation.time'] *
                                    this.paramInit['payload']['simulation']['time.step'];
                                this.paramInit['payload']['simulation']['time.step'] = 60 *
                                    this.paramInit['payload']['simulation']['time.step'];
                                this.generalParams.updateGeneralParameters(this.paramInit['payload']['model'], 'model');
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
        const originalTimestep: number = this.paramInit['payload']['simulation']['time.step'];
        const originalHorizon: number = this.paramInit['payload']['simulation']['simulation.time'];

        this.paramInit['payload']['simulation']['time.step'] = this.paramInit['payload']['simulation']['time.step'] / 60;
        this.paramInit['payload']['simulation']['simulation.time'] =
            Math.round(this.paramInit['payload']['simulation']['simulation.time']
                / this.paramInit['payload']['simulation']['time.step']);
        // Update values in case current instance will be used to save another scenario
        const startDate: string = this.genParams['startingDate'].getFullYear().toString() +
            '-' + (this.genParams['startingDate'].getMonth() + 1).toString() +
            '-' + this.genParams['startingDate'].getDate().toString();
        const endDate: string = this.genParams['endingDate'].getFullYear().toString() +
            '-' + (this.genParams['endingDate'].getMonth() + 1).toString() +
            '-' + this.genParams['endingDate'].getDate().toString();
        delete this.paramInit['_id'];
        this.paramInit['payload']['startDate'] = startDate;
        this.paramInit['payload']['endDate'] = endDate;
        const today = new Date();
        this.paramInit['payload']['eventDate'] = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${
            today.getDate().toString().padStart(2, '0')}/${
            today.getFullYear().toString().padStart(4, '0')} ${
            today.getHours().toString().padStart(2, '0')}:${
            today.getMinutes().toString().padStart(2, '0')}`;
        this.paramInit['payload']['owner'] = this.userProfile.getName();
        formData.append('param1', JSON.stringify(this.paramInit));
        formData.append('param2', JSON.stringify(this.elecParam));
        formData.append('param3', JSON.stringify(this.heatParam));
        formData.append('method', 'LOAD');
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
                        'method': 'LOAD',
                        'email': this.userProfile.getEmail(),
                        'timeStamp': timeStamp['timeStamp'],
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
    openDialogBox(component) {
        this.dialogService.open(component)
            .onClose.subscribe();
    }

    /**
  *
  * Function to set up a and return a new Date for starting period
  * @example
  * dateStart()
  *
  * @returns starting date [Date]
  */
    get dateStart(): Date {
        if (!this.genParams['startingDate']) {
            this.genParams['startingDate'] = new Date(2016, 0, 1);
        }
        return new Date(this.genParams['startingDate']);
    }

    /**
   *
   * Function to set up a and return a new Date for ending period
   * @example
   * dateEnd()
   *
   * @returns ending date [Date]
   */
    get dateEnd(): Date {
        if (!this.genParams['endingDate']) {
            this.genParams['endingDate'] = new Date(2016, 11, 31);
        }
        return new Date(this.genParams['endingDate']);
    }

    /**
    *
    * Function responsible to initialize VES time.step
    * @example
    * updateVES()
    *
    */
    private updateVES(): void {
        const nodes = 43;
        for (let i = 0; i < nodes; i++) {
            if (this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['VES']['name']) {
                this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['VES']['parameters']['timeStep'] = this.paramInit['payload']['simulation']['time.step'];
                this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['VES']['simulationID'] = this.paramInit['payload']['formName'];
                this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['VES']['parameters']['noSteps'] = this.paramInit['payload']['simulation']['simulation.time'];
                this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['VES']['nodeID'] = 'node.' + (i + 1);
                this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['VES']['VESPortfolioID'] = this.paramInit['payload']['electric.grid']['node.' + (i + 1)]['VES']['name'];
            }
        }
    }

    /**
    * Angular lifecycle hook on Component destroyed. used to clear the Observable subscriptions
    */
    ngOnDestroy() {
        this.alive = false;
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
