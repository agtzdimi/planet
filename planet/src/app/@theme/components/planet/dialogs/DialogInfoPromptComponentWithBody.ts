import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'nb-info-prompt',
  template: `
    <nb-card accent="primary">
      <nb-card-header></nb-card-header>
      <nb-card-body>
      The formulas allow different Coefficient Of Performance (COP) definitions for<br>
      heating and cooling modes. Furthermore, it is possible to capture the effect<br>
      that the external temperature has to the COP via the described linear functions.<br>\
      In the case that only an average COP value is known, parameters A and C must<br>
      be set to zero, and that COP value assigned to parameters B and D.
      </nb-card-body>
      <nb-card-footer>
        <div class="row" [ngStyle]="{'display': 'flex','justify-content': 'center'}">
                <button nbButton hero status="info" (click)="submit()">OK</button>
        </div>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [``],
})
// tslint:disable-next-line: component-class-suffix
export class DialogInfoPromptComponentWithBody {
  title;
  constructor(protected dialogRef: NbDialogRef<DialogInfoPromptComponentWithBody>) {
  }

  submit() {
    this.dialogRef.close();
  }
}
