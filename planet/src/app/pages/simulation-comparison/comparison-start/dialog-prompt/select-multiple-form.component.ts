import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../../../env.service';

@Component({
  selector: 'nb-select-multiple-form-prompt',
  template: `
    <nb-card size="medium" *ngIf="formReady" accent="active">
      <nb-card-header>Select two of the following simulations</nb-card-header>
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
          <div *ngIf="errorMessage !== ''" class="row">
            <label>{{errorMessage}}</label>
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
    label {
      color: red;
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
  errorMessage: String = '';

  constructor(protected dialogRef: NbDialogRef<DialogSelectMultipleFormPromptComponent>,
    private httpClient: HttpClient,
    private env: EnvService) {
    const url = 'http://' + this.env.planet + ':' + this.env.planetRESTPort + '/get_form_names';
    this.httpClient.get(url, {
      params: {
        'executed': 'true',
      },
    })
      .subscribe(
        data => {
          // console.log('GET Request is successful ');
          this.forms = data['formName'];
          this.formsDescr = data['formDescription'];
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
    if (this.firstForm && this.secondForm && this.selectedOptions.length === 2) {
      this.submit(this.firstForm + '  -  ' + this.secondForm);
    } else {
      this.errorMessage = 'Please Select 2 Scenarios';
    }
  }

  setOptions(event) {
    this.selectedOptions = event;
  }

  submit(form) {
    this.dialogRef.close(form);
  }
}
