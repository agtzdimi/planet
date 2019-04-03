import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../../../env.service';

@Component({
  selector: 'nb-select-form-prompt',
  template: `
    <nb-card *ngIf="formReady">
      <nb-card-header>Select one of the following simulations</nb-card-header>
      <nb-card-body>
      <nb-list>
        <nb-list-item [appHighlight]="'lightblue'" *ngFor="let form of forms" (click)="handleClick($event)">
          {{ form }}
        </nb-list-item>
      </nb-list>
      </nb-card-body>
    </nb-card>
  `,
  styles: [`
    button {
      margin: 1rem;
    }
    nb-list-item { cursor: pointer; }
    nb-list-item:hover {
        background-color: #D3D3D3;
      }
  `],
})
export class DialogSelectFormPromptComponent {
  forms: String[];
  formsDescr: String[];
  formReady: Boolean = false;
  selectedForm: String;
  finalForm: Object = {};

  constructor(protected dialogRef: NbDialogRef<DialogSelectFormPromptComponent>,
    private httpClient: HttpClient,
    private env: EnvService) {
    const url = 'http://' + this.env.planet + ':' + this.env.planetRESTPort + '/get_form_names';
    this.httpClient.get(url, {
      params: {
        'executed': 'false',
      },
    })
      .subscribe(
        data => {
          this.forms = data['formName'];
          this.formsDescr = data['formDescription'];
          this.formsDescr.splice(-1, 1);
          this.formReady = true;
        },
        error => {
          // console.log('Error', error);
        },
      );
  }

  handleClick(event) {
    this.selectedForm = event.target.textContent;
    this.selectedForm = this.selectedForm.replace(/^\s/, '');
    this.selectedForm = this.selectedForm.replace(/\s$/, '');
    const index = this.forms.findIndex(val => val === this.selectedForm);
    this.finalForm = {
      'formName': this.selectedForm,
      'formDescription': this.formsDescr[index],
    };
    this.submit(this.finalForm);
  }

  submit(form) {
    this.dialogRef.close(form);
  }
}
