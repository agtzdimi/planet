import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { GetJWTService } from '../../../unit-management/services/get-jwt.service';
import { GetDeviceByTypeService } from '../../../unit-management/services/get-deviceByType.service';

@Component({
    selector: 'nb-select-form-prompt',
    template: `
<div *ngIf="loaded">
    <nb-card>
        <nb-card-header>Select one of the following Simulators</nb-card-header>
    </nb-card>
  <div class="row">
    <div class="col-md-6" *ngFor="let simulator of simUnit; let i = index">
        <div class="imageCard">

        <nb-card [nbSpinner]="loading" nbSpinnerStatus="danger" nbSpinnerSize="xlarge" accent="active">
            <nb-card-body (click)="handleUnit(simulator)">
                <div *ngIf="simulator['metadata']['Simulink'] === 'true'">
                    <img class="component-icon" src="assets/images/Simulink.jpg"
                        [ngStyle]="{'width': '100px', 'height': '80px'}">
                </div>
                <div *ngIf="simulator['metadata']['OpalRT'] === 'true'">
                    <img class="component-icon" src="assets/images/Sim.jpg"
                        [ngStyle]="{'width': '100px', 'height': '80px'}">
                </div>
            <label class="component-name">{{simUnit[i]['comments']}}</label>
            </nb-card-body>
        </nb-card>

        </div>
    </div>
  </div>
</div>
  `,
    styleUrls: ['./select-simulator.component.scss'],
    providers: [GetJWTService, GetDeviceByTypeService],
})
export class DialogSelectSimulatorComponent implements OnInit {
    jwtToken: any;
    simUnit: Object = [{}];
    modelType: string;
    loaded = false;

    constructor(protected dialogRef: NbDialogRef<DialogSelectSimulatorComponent>,
        private getJWTService: GetJWTService,
        private getDeviceByType: GetDeviceByTypeService) {
        this.getJWTService.getToken()
            .then((data: any) => {
                this.jwtToken = data;
                this.getDeviceByType.getDeviceByType(this.jwtToken, 'SimToken')
                    .then(devices => {
                        this.simUnit = devices['results'];
                        this.loaded = true;
                    });
            });
    }

    ngOnInit() {
    }

    handleUnit(simulator) {
        // console.log(simulator)
    }

    submit(form) {
        this.dialogRef.close(form);
    }
}
