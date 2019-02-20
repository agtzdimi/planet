import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'nb-select-multiple-form-prompt',
  template: `
    <nb-card size="medium" *ngIf="formReady">
      <nb-card-header>Select one of the following simulations</nb-card-header>
      <nb-card-body>
      <div class="row">
      <sui-multi-select *ngIf="formReady" class="selection"
                          [ngModel]="selectedOptions"
                          (ngModelChange)="setOptions($event)"
                          [isDisabled]="disabled"
                          #multiSelect>
            <sui-select-option *ngFor="let form of forms"
                               [value]="form">
            </sui-select-option>
        </sui-multi-select>
        </div>
        </nb-card-body>
        <nb-card-footer>
          <div class="row">
          <button nbButton hero status="success" (click)="handleClick()">OK</button>
          </div>
          </nb-card-footer>
    </nb-card>
  `,
  styles: [`

    sui-multi-select {
      margin-left: auto;
      margin-right: auto;
    }

    button {
      margin: 1rem;
      margin-left: auto;
      margin-right: auto;
    }
  `],
})
export class DialogSelectMultipleFormPromptComponent {
  forms: String[];
  formsDescr: String[];
  disabled = false;
  selectedOptions: String[] = [];
  formReady: Boolean = false;
  firstForm: String;
  secondForm: String;

  constructor(protected dialogRef: NbDialogRef<DialogSelectMultipleFormPromptComponent>,
    private httpClient: HttpClient) {
    this.httpClient.get('http://160.40.49.244:8000/get_form_names', {
      params: {
        'executed': 'true',
      },
    })
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

  handleClick() {
    this.firstForm = this.selectedOptions[0];
    this.secondForm = this.selectedOptions[1];
    this.submit(this.firstForm + ', ' + this.secondForm);
  }

  setOptions(event) {
    if (event.length >= 3) {
      this.disabled = true;
    } else {
      this.selectedOptions = event;
    }

  }

  submit(form) {
    this.dialogRef.close(form);
  }
}
