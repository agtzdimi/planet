import { Component } from '@angular/core';
import { SendScenarioService } from '../../../pages/simulation-run/simulation-start/sendScenarioName.service';
import { StateService } from '../../../@core/utils';
import { EnvService } from '../../../env.service';
import { HttpClient } from '@angular/common/http';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'ngx-theme-settings',
  styleUrls: ['./theme-settings.component.scss'],
  templateUrl: './theme-settings.component.html',
})
export class ThemeSettingsComponent {
  techSettings = {
    hideSubHeader: true,
    actions: false,
    sort: false,
    columns: {
      nodes: {
        title: '-',
        editable: false,
        filter: false,
      },
      PV: {
        title: 'PV',
        editable: false,
        filter: false,
      },
      WT: {
        title: 'Wind',
        editable: false,
        filter: false,
      },
      CHP: {
        title: 'CHP',
        editable: false,
        filter: false,
      },
      p2h1: {
        title: 'P2H.DH.EH',
        editable: false,
        filter: false,
      },
      p2h2: {
        title: 'P2H.DH.HP',
        editable: false,
        filter: false,
      },
      p2h3: {
        title: 'P2H.LHD.EH',
        editable: false,
        filter: false,
      },
      p2h4: {
        title: 'P2H.LHD.HP',
        editable: false,
        filter: false,
      },
      P2G: {
        title: 'P2G',
        editable: false,
        filter: false,
      },
      EB: {
        title: 'EB',
        editable: false,
        filter: false,
      },
      uncontrollableLoad: {
        title: 'Uncontrollable Load',
        editable: false,
        filter: false,
      },
    },
  };

  econSettings = {
    hideSubHeader: true,
    actions: false,
    sort: false,
    columns: {
      params: {
        title: '-',
        editable: false,
        filter: false,
      },
      PV: {
        title: 'PV',
        editable: false,
        filter: false,
      },
      WT: {
        title: 'Wind',
        editable: false,
        filter: false,
      },
      CHP: {
        title: 'CHP',
        editable: false,
        filter: false,
      },
      EH: {
        title: 'EH',
        editable: false,
        filter: false,
      },
      HP: {
        title: 'HP',
        editable: false,
        filter: false,
      },
      P2G: {
        title: 'P2G',
        editable: false,
        filter: false,
      },
      EB: {
        title: 'EB',
        editable: false,
        filter: false,
      },
    },
  };

  econ2Settings = {
    hideSubHeader: true,
    actions: false,
    sort: false,
    columns: {
      'NG.cost': {
        title: 'NG cost',
        editable: false,
        filter: false,
      },
      'SNG.cost': {
        title: 'SNG cost',
        editable: false,
        filter: false,
      },
      'heat.cost': {
        title: 'Heat cost',
        editable: false,
        filter: false,
      },
      'carbon.tax': {
        title: 'Carbon tax',
        editable: false,
        filter: false,
      },
      'NG.emission.factor': {
        title: 'NG emission factor',
        editable: false,
        filter: false,
      },
    },
  };

  controlSettings = {
    hideSubHeader: true,
    actions: false,
    sort: false,
    columns: {
      'RES.curtailment': {
        title: 'RES Curtailment',
        editable: false,
        filter: false,
      },
      'control': {
        title: 'Dispatch Priority Order',
        editable: false,
        filter: false,
      },
    },
  };

  techData = [];
  econData = [];
  econ2Data = [];
  controlData = [];
  layouts = [];
  sidebars = [];
  scenarioName: string;
  paramInit: Object = {
    'payload': {
      'model': '',
    },
  };
  econEnv: Object;
  controlSystem: Object;
  startingDate;
  endingDate;
  techSource: LocalDataSource = new LocalDataSource();
  econSource: LocalDataSource = new LocalDataSource();
  econ2Source: LocalDataSource = new LocalDataSource();
  controlSource: LocalDataSource = new LocalDataSource();

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
              this.techData = [];
              this.econData = [];
              this.econ2Data = [];
              this.controlData = [];
              let temp = JSON.parse(res['paramInit']);
              this.paramInit = temp;
              temp = JSON.parse(res['econEnv']);
              this.econEnv = temp;
              temp = JSON.parse(res['controlSystem']);
              this.controlSystem = temp;
              temp = JSON.parse(res['windParam']);
              this.startingDate = temp['payload']['startDate'].replace(/T.*/, '').replace(/-/g, '/');
              this.endingDate = temp['payload']['endDate'].replace(/T.*/, '').replace(/-/g, '/');

              // Generate Technologies Values
              let tempTechData = {};
              for (const node of Object.keys(this.paramInit['payload']['electric.grid'])) {
                for (const tech of Object.keys(this.paramInit['payload']['electric.grid'][node])) {
                  if (tech === 'P2H') {
                    tempTechData['p2h1'] = this.paramInit['payload']['electric.grid'][node][tech]['DH']['EH']['nominal.heat.power'];
                    tempTechData['p2h2'] = this.paramInit['payload']['electric.grid'][node][tech]['DH']['HP']['nominal.heat.power'];
                    tempTechData['p2h3'] = this.paramInit['payload']['electric.grid'][node][tech]['LHD']['EH']['nominal.heat.power'];
                    tempTechData['p2h4'] = this.paramInit['payload']['electric.grid'][node][tech]['LHD']['HP']['nominal.heat.power'];
                  } else if (tech === 'uncontrollable.load') {
                    tempTechData['uncontrollableLoad'] =
                      this.paramInit['payload']['electric.grid'][node]['uncontrollable.load']['peak.load'];
                  } else if (tech === 'EB') {
                    tempTechData[tech] = this.paramInit['payload']['electric.grid'][node][tech]['storage.electric.capacity'];
                  } else {
                    tempTechData[tech] = this.paramInit['payload']['electric.grid'][node][tech]['nominal.electric.power'];
                  }
                }
                tempTechData['nodes'] = node;
                this.techData.push(tempTechData);
                tempTechData = {};
              }
              this.techSource.load(this.techData);
              // Generate Economy Values
              const tempEconData = [{}, {}, {}];
              for (const tech of Object.keys(this.econEnv['payload']['technologies.cost'])) {
                for (const param of Object.keys(this.econEnv['payload']['technologies.cost'][tech])) {

                  switch (param) {
                    case 'CAPEX':
                      tempEconData[0]['params'] = param;
                      tempEconData[0][tech] = this.econEnv['payload']['technologies.cost'][tech][param];
                      break;
                    case 'OPEX':
                      tempEconData[1]['params'] = param;
                      tempEconData[1][tech] = this.econEnv['payload']['technologies.cost'][tech][param];
                      break;
                    case 'life.time':
                      tempEconData[2]['params'] = param;
                      tempEconData[2][tech] = this.econEnv['payload']['technologies.cost'][tech][param];
                      break;
                  }

                }
              }
              this.econData = [...tempEconData];
              this.econSource.load(this.econData);

              const tempEcon2Data = {};
              for (const tech of Object.keys(this.econEnv['payload'])) {
                if (tech === 'NG.cost' || tech === 'SNG.cost' || tech === 'heat.cost' ||
                  tech === 'carbon.tax' || tech === 'NG.emission.factor') {
                  tempEcon2Data[tech] = this.econEnv['payload'][tech];
                }
              }
              this.econ2Data.push(tempEcon2Data);

              this.econ2Source.load(this.econ2Data);

              let controlVal: string;
              switch (this.controlSystem['payload']['control']) {
                case 1:
                  controlVal = '1 -> P2H - EB - P2G';
                  break;
                case 2:
                  controlVal = '2 -> P2H - P2G - EB';
                  break;
                case 3:
                  controlVal = '3 -> EB - P2H - P2G';
                  break;
                case 4:
                  controlVal = '4 -> P2G - P2H - EB';
                  break;
                case 5:
                  controlVal = '5 -> P2G - P2H - EB';
                  break;
                case 6:
                  controlVal = '6 -> P2G - EB - P2H';
                  break;
              }
              this.controlData = [
                {
                  'RES.curtailment': this.controlSystem['payload']['RES.curtailment'],
                  'control': controlVal,
                },
              ];

              this.controlSource.load(this.controlData);
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
