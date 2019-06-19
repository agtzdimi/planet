import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { DialogDeleteFormPromptComponent } from './dialog-prompt/delete-form.component';
import { EnvService } from '../../../env.service';
import { HttpClient } from '@angular/common/http';
import { DeleteScenarioDialogComponent } from './dialog-prompt/delete-scenario-dialog.component';

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
    private env: EnvService,
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
    this.dialogService.open(DeleteScenarioDialogComponent)
      .onClose.subscribe(value => {
        if (value) {
          this.loading = true;
          const url = 'http://' + this.env.planet + ':' + this.env.planetRESTPort + '/delete_scenario';
          this.httpClient.post(url,
            {
              'formName': this.formName,
            })
            .subscribe(
              data => {
                this.status = data['text'];
                this.loading = false;
              },
              error => {
                this.status = error.error['text'];
                this.loading = false;
              },
            );

        }
      });


  }

}
