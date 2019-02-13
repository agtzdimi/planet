import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'nb-select-multiple-form-prompt',
    template: `
    <nb-card *ngIf="formReady">
      <nb-card-header>Select one of the following simulations</nb-card-header>
      <nb-card-body>
      <nb-list>
        <nb-list-item [appCompHighlight]="'lightblue'" *ngFor="let form of forms" (click)="handleClick($event)">
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
export class DialogSelectMultipleFormPromptComponent {
    forms: String[];
    formsDescr: String[];
    formReady: Boolean = false;
    firstForm: String;
    secondForm: String;

    constructor(protected dialogRef: NbDialogRef<DialogSelectMultipleFormPromptComponent>,
        private httpClient: HttpClient) {
        this.httpClient.get('http://2.85.194.101:8000/get_form_names')
            .subscribe(
                data => {
                    // console.log('GET Request is successful ');
                    this.forms = data['formName'].toString().split('\n');
                    this.formsDescr = data['formDescription'].toString().split('\n');
                    this.forms.splice(-1, 1);
                    this.formReady = true;
                },
                error => {
                    // console.log('Error', error);
                },
            );
    }

    handleClick(event) {
        if (!this.firstForm) {
            this.firstForm = event.target.textContent;
        } else {
            this.secondForm = event.target.textContent;
            this.submit(this.firstForm + ', ' + this.secondForm);
        }
    }

    submit(form) {
        this.dialogRef.close(form);
    }
}
