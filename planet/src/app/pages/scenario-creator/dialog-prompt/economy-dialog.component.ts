import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'nb-tech-param-prompt',
  template: `
    <nb-card accent="active">
      <nb-card-header>Enter the economy and cost parameters</nb-card-header>
      <nb-card-footer>
        <div class="row">
            <div class="col-md-4">
            </div>
            <div class="col-md-1">
                <button nbButton hero status="danget" (click)="submit()">OK</button>
            </div>
        </div>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [``],
})
export class DialogEconomyPromptComponent {
  constructor(protected dialogRef: NbDialogRef<DialogEconomyPromptComponent>) {
  }

  submit() {
    this.dialogRef.close();
  }
}
