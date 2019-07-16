import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { DialogDeleteFormPromptComponent } from '../../../@theme/components/planet/dialogs/delete-form.component';
import { HttpClient } from '@angular/common/http';
import { DeleteScenarioDialogComponent } from '../../../@theme/components/planet/dialogs/delete-scenario-dialog.component';

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
    this.dialogService.open(DialogDeleteFormPromptComponent)
      .onClose.subscribe(name => {
        if (name) {
          this.formName = name['formName'];
        }
      });
  }

  deleteScenario() {
    this.status = '';
    this.dialogService.open(DeleteScenarioDialogComponent)
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
