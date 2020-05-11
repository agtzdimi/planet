import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NbDialogService, NbDialogConfig } from '@nebular/theme';

import { DialogSubmitPromptComponent } from '../../../@theme/components/planet/dialogs/dialog-submit.component';
import { ScenarioPanelComponent } from '../../../@theme/components';

/**
 * Component responsible for the deletion of a saved scenario
 */
@Component({
  selector: 'ngx-delete-scenario',
  templateUrl: './delete-scenario.component.html',
  styleUrls: ['./delete-scenario.component.scss'],
})
/**
 * @param {string} status  Private variable to check whether the phase 2 of scenario-creation reached
 * @param {string} formName Variable that will hold the status of Saving a Scenario after user submission
 * @param {boolean} loading Variable to animate the transition between phase 1 and phase 2
 *
 */
export class DeleteScenarioComponent {

  public formName: string = 'Select a Scenario';
  public status: string = '';
  public loading: boolean = false;

  /**
  * @param {HttpClient} httpClient Angular service to make REST requests
  */
  constructor(private dialogService: NbDialogService,
    private httpClient: HttpClient) { }

  /**
  *
  * Function responsible for Opening a dialog box over the current screen
  * @example
  * openDialogBox()
  *
  * @returns A dialog box with some information for the user
  */
  public openDialogBox(): void {
    const context: Object = {
      context: {
        color: 'red',
      },
    } as Partial<NbDialogConfig<string | Partial<DialogSubmitPromptComponent>>>;
    this.dialogService.open(ScenarioPanelComponent, context)
      .onClose.subscribe(name => {
        if (name) {
          this.formName = name['formName'];
        }
      });
  }

  /**
  *
  * Function responsible for Opening a dialog box over the current screen to delete a scenario
  * @example
  * deleteScenario()
  *
  * @returns A dialog box with some information for the user
  */
  public deleteScenario() {
    this.status = '';
    const context: Object = {
      context: {
        title: 'Are you sure you Want to Delete this Scenario?',
      },
    } as Partial<NbDialogConfig<string | Partial<DialogSubmitPromptComponent>>>;
    this.dialogService.open(DialogSubmitPromptComponent, context)
      .onClose.subscribe(value => {
        if (value) {
          this.loading = true;
          const url: string = '/planet/rest/delete_scenario';
          this.httpClient.post(url,
            {
              'formName': this.formName,
            })
            .subscribe(
              data => {
                this.status = data['text'];
                this.loading = false;
                this.formName = 'Select a Scenario';
              },
              error => {
                this.status = error.error['text'];
                this.loading = false;
                this.formName = 'Select a Scenario';
              },
            );

        }
      });
  }
}
