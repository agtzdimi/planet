import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'nb-tech-param-prompt',
  template: `
    <nb-card accent="active">
      <nb-card-header>Enter the control node</nb-card-header>
      <nb-card-footer>
        <div class="row">
            <div class="col-sm-3">
            </div>
            <div class="col-sm-2">
                <button nbButton hero status="danget" (click)="submit()">OK</button>
            </div>
        </div>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [``],
})
export class DialogControlSystemPromptComponent {
  constructor(protected dialogRef: NbDialogRef<DialogControlSystemPromptComponent>) {
  }

  submit() {
    this.dialogRef.close();
  }
}
