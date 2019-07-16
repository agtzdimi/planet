import { Component, OnInit } from '@angular/core';
import { NbDialogService, NbDialogConfig } from '@nebular/theme';
import { DialogSelectFormPromptComponent } from '../../../@theme/components/planet/dialogs/select-form.component';
import { HttpClient } from '@angular/common/http';
import { DialogSubmitPromptComponent } from '../../../@theme/components/planet/dialogs/dialog-submit.component';

@Component({
  selector: 'ngx-delete-scenario',
  templateUrl: './delete-scenario.component.html',
  styleUrls: ['./delete-scenario.component.scss'],
})
export class DeleteScenarioComponent implements OnInit {

  formName = 'Select a Scenario';
  status = '';
  loading = false;

  constructor(private dialogService: NbDialogService,
    private httpClient: HttpClient) { }

  ngOnInit() {
  }

  openDialogBox() {
    const context = {
      context: {
        color: 'red',
      },
    } as Partial<NbDialogConfig<string | Partial<DialogSubmitPromptComponent>>>;
    this.dialogService.open(DialogSelectFormPromptComponent, context)
      .onClose.subscribe(name => {
        if (name) {
          this.formName = name['formName'];
        }
      });
  }

  deleteScenario() {
    this.status = '';
    const context = {
      context: {
        title: 'Are you sure you Want to Delete this Scenario?',
      },
    } as Partial<NbDialogConfig<string | Partial<DialogSubmitPromptComponent>>>;
    this.dialogService.open(DialogSubmitPromptComponent, context)
      .onClose.subscribe(value => {
        if (value) {
          this.loading = true;
          const url = '/planet/rest/delete_scenario';
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
