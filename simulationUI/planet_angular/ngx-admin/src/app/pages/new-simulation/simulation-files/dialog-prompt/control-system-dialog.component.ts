import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
    selector: 'nb-tech-param-prompt',
    template: `
    <nb-card>
      <nb-card-header>Enter the control node</nb-card-header>
      <nb-card-footer>
        <div class="row">
            <div class="col-md-3">
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
export class DialogControlSystemPromptComponent {
    constructor(protected dialogRef: NbDialogRef<DialogControlSystemPromptComponent>) {
    }

    submit() {
        this.dialogRef.close();
    }
}