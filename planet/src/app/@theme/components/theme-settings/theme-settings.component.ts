import { Component } from '@angular/core';
import { SendScenarioService } from '../../../pages/simulation-run/simulation-start/sendScenarioName.service';
import { StateService } from '../../../@core/utils';
import { EnvService } from '../../../env.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ngx-theme-settings',
  styleUrls: ['./theme-settings.component.scss'],
  template: `
    <h4>{{scenarioName}}</h4>
    <h6>( {{startingDate}} - {{endingDate}} )</h6>
    <hr>
    <h6>Technologies</h6>
    <div class="settings-row">
        <ng2-smart-table [settings]="settings">
        </ng2-smart-table>
    </div>

    <h6>Economy Parameters</h6>
    <div class="settings-row">
    </div>

    <h6>Dispatch Priority Order</h6>
    <div class="settings-row">

    </div>
  `,
})
export class ThemeSettingsComponent {
  settings = {
    columns: {
      pv: {
        title: 'PV',
        editable: false,
      },
      wind: {
        title: 'Wind',
        editable: false,
      },
      chp: {
        title: 'CHP',
        editable: false,
      },
      p2h: {
        title: 'P2H',
        editable: false,
      },
      p2g: {
        title: 'P2G',
        editable: false,
      },
      eb: {
        title: 'EB',
        editable: false,
      },
      uncontrollableLoad: {
        title: 'Uncontrollable Load',
      },
    },
  };
  layouts = [];
  sidebars = [];
  scenarioName: string;
  paramInit: Object;
  econEnv: Object;
  controlSystem: Object;
  startingDate;
  endingDate;

  constructor(protected stateService: StateService,
    private sendScenarioService: SendScenarioService,
    private env: EnvService,
    private httpClient: HttpClient) {
    this.stateService.getLayoutStates()
      .subscribe((layouts: any[]) => this.layouts = layouts);

    this.sendScenarioService.formNameUpdated.subscribe(
      (data) => {
        this.scenarioName = data;

        const url = 'http://' + this.env.planet + ':' + this.env.planetRESTPort + '/load_data';
        this.httpClient.get(url, {
          params: {
            'formName': this.scenarioName,
          },
        })
          .subscribe(
            res => {
              let temp = JSON.parse(res['paramInit']);
              this.paramInit = temp;
              temp = JSON.parse(res['econEnv']);
              this.econEnv = temp;
              temp = JSON.parse(res['controlSystem']);
              this.controlSystem = temp;
              temp = JSON.parse(res['windParam']);
              this.startingDate = temp['payload']['startDate'].replace(/T.*/, '').replace(/-/g, '/');
              this.endingDate = temp['payload']['endDate'].replace(/T.*/, '').replace(/-/g, '/');
            },
            error => {
              // console.log('Error', error);
            },
          );
      },
    );

    this.stateService.getSidebarStates()
      .subscribe((sidebars: any[]) => this.sidebars = sidebars);
  }

  layoutSelect(layout: any): boolean {
    this.layouts = this.layouts.map((l: any) => {
      l.selected = false;
      return l;
    });

    layout.selected = true;
    this.stateService.setLayoutState(layout);
    return false;
  }

  sidebarSelect(sidebars: any): boolean {
    this.sidebars = this.sidebars.map((s: any) => {
      s.selected = false;
      return s;
    });

    sidebars.selected = true;
    this.stateService.setSidebarState(sidebars);
    return false;
  }
}
