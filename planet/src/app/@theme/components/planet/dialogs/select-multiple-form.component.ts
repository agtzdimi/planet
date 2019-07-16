import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'nb-select-multiple-form-prompt',
  template: `
    <nb-card [ngStyle]="{'width': '35vw','height':'60vh'}" *ngIf="formReady" accent="primary">
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
  scenarioNames: String[] = [];
  errorMessage: String = '';

  constructor(protected dialogRef: NbDialogRef<DialogSelectMultipleFormPromptComponent>,
    private httpClient: HttpClient) {
    const url = '/planet/rest/get_form_names';
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
    this.scenarioNames = [];
    for (let i = 0; i < this.selectedOptions.length; i++) {
      this.scenarioNames.push(this.selectedOptions[i]);
    }

    if (this.scenarioNames.length >= 2 && this.scenarioNames.length <= 5) {
      let tempString = this.scenarioNames[0];
      for (let i = 1; i < this.scenarioNames.length; i++) {
        tempString = tempString + '  -  ' + this.scenarioNames[i];
      }
      this.submit(tempString);
    } else {
      this.errorMessage = 'Please Select at most 5 Scenarios';
    }
  }

  setOptions(event) {
    this.selectedOptions = event;
  }

  submit(form) {
    this.dialogRef.close(form);
  }
}