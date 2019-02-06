import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'nb-select-form-prompt',
    template: `
    <nb-card *ngIf="formReady">
      <nb-card-header>Select one of the following forms</nb-card-header>
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
    formReady: Boolean = false;
    selectedForm: String;

    constructor(protected dialogRef: NbDialogRef<DialogSelectFormPromptComponent>, private httpClient: HttpClient) {
        this.httpClient.get('http://80.106.151.108:8000/get_form_names')
            .subscribe(
                data => {
                    // console.log('GET Request is successful ');
                    this.forms = data.toString().split('\n');
                    this.forms.splice(-1, 1);
                    this.formReady = true;
                },
                error => {
                    // console.log('Error', error);
                },
            );
    }

    handleClick(event) {
        this.selectedForm = event.target.textContent;
        this.submit(this.selectedForm);
    }

    submit(form) {
        this.dialogRef.close(form);
    }
}
