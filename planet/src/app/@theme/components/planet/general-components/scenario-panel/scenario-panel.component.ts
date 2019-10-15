import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { ScenPanelCheckBoxComponent } from './scenario-panel-checkbox.component';
import { ScenPanelSimIconComponent } from './scenario-panel-sim-icon.component';
import { CheckBoxesService } from './scenario-panel-checkboxes-values.service';

@Component({
  selector: 'ngx-scenario-panel',
  templateUrl: './scenario-panel.component.html',
  styleUrls: ['./scenario-panel.component.scss'],
})
export class ScenarioPanelComponent implements OnInit {

  scenarios = [];

  scenarioSettings = {
    hideSubHeader: true,
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      id: {
        title: 'ID',
      },
      formName: {
        title: 'Scenario Name',
      },
      formDescription: {
        title: 'Scenario Description',
      },
      owner: {
        title: 'Creator',
      },
      eventDate: {
        title: 'Date Created',
      },
      simulated: {
        title: 'Simulated',
        type: 'custom',
        renderComponent: ScenPanelSimIconComponent,
      },
      chosen: {
        title: 'Chosen Scenario',
        type: 'custom',
        renderComponent: ScenPanelCheckBoxComponent,
      },
    },
  };

  scenarioSource: LocalDataSource = new LocalDataSource();
  public status: string = '';
  private scenarioNameID;
  comparisonNames: any;

  constructor(protected dialogRef: NbDialogRef<ScenarioPanelComponent>,
    private httpClient: HttpClient,
    private checkBoxesService: CheckBoxesService) {
    this.checkBoxesService.initializeService();
    this.checkBoxesService.checkboxesUpdated.subscribe(
      (data) => {
        if (!data['scenarioType']) {
          let checkboxes;
          checkboxes = data;
          this.scenarioNameID = checkboxes.filter(row => {
            if (row['value']) {
              return row;
            }
          });
        }
      },
    );
  }

  cancel() {
    this.dialogRef.close(false);
  }

  submit() {
    if (this.scenarioNameID && !this['scenarioType']) {
      this.dialogRef.close({
        formName: this.scenarios[this.scenarioNameID['id'] - 1]['formName'],
        formDescription: this.scenarios[this.scenarioNameID['id'] - 1]['formDescription'],
      });
    } else if (this['scenarioType']) {
      let tempstring = this.scenarios[this.scenarioNameID[0]['id'] - 1]['formName'];
      for (let name = 1; name < this.scenarioNameID.length; name++) {
        tempstring = tempstring + '  -  ' + this.scenarios[this.scenarioNameID[name]['id'] - 1]['formName'];
      }
      this.dialogRef.close(tempstring);
    } else {
      this.cancel();
    }
  }

  checkScenarios() {
    if (this.scenarios.length !== 0) {
      if (this['scenarioType']) {
        this.checkBoxesService.checkboxesUpdated.next({ 'scenarioType': this['scenarioType'] });
      }
      return true;
    }

  }

  ngOnInit() {
    const url = '/planet/rest/get_form_names';
    this.httpClient.get(url)
      .subscribe(
        (scenarios) => {
          for (let scenario = 0; scenario < scenarios['formName'].length; scenario++) {
            this.scenarios.push({
              id: (scenario + 1),
              formName: scenarios['formName'][scenario],
              formDescription: scenarios['formDescription'][scenario],
              owner: scenarios['owner'][scenario],
              eventDate: scenarios['eventDate'][scenario],
              simulated: scenarios['simulated'][scenario],
            });
          }
          this.scenarioSource.load(this.scenarios);
        },
        (error) => {
          // console.log(error);
        },
      );
  }

}
