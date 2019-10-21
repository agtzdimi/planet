import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogRef } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { ScenPanelCheckBoxComponent } from './scenario-panel-checkbox.component';
import { ScenPanelSimIconComponent } from './scenario-panel-sim-icon.component';
import { CheckBoxesService } from './scenario-panel-checkboxes-values.service';
import { DialogInfoPromptComponent } from '../../dialogs/info-prompt-dialog.component';

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
    private dialogService: NbDialogService,
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
    
  submit() {
    if (this.scenarioNameID && !this['scenarioType']) {
      if (this.scenarioNameID.length > 0) {
      this.dialogRef.close({
        formName: this.scenarios[this.scenarioNameID[0]['id'] - 1]['formName'],
        formDescription: this.scenarios[this.scenarioNameID[0]['id'] - 1]['formDescription'],
      });
      }
    } else if (this['scenarioType'] && this.scenarioNameID) {
      if (this.scenarioNameID.length > 1 && this.scenarioNameID.length < 6) {
      let tempstring = this.scenarios[this.scenarioNameID[0]['id'] - 1]['formName'];
      for (let name = 1; name < this.scenarioNameID.length; name++) {
        tempstring = tempstring + '  -  ' + this.scenarios[this.scenarioNameID[name]['id'] - 1]['formName'];
      }
      this.dialogRef.close({ comparison: tempstring });
      } else {
        const context: Object = {
          context: {
              title: 'Error: Selected Scenarios can\'t be less than two or more than five',
          },
      };
      this.openDialogBox(context);
      }
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
          for (let scenario = 0, id = 1; scenario < scenarios['formName'].length; scenario++) {
            const scen = {
              id: id,
              formName: scenarios['formName'][scenario],
              formDescription: scenarios['formDescription'][scenario],
              owner: scenarios['owner'][scenario],
              eventDate: scenarios['eventDate'][scenario],
              simulated: scenarios['simulated'][scenario],
            }
            if (this['scenarioType'] && !scen['simulated']) {
              continue
            }
            this.scenarios.push(scen);
            id++;
          }
          this.scenarioSource.load(this.scenarios);
        },
        (error) => {
          // console.log(error);
        },
      );
  }

}
