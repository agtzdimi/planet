import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'nb-submit-prompt',
  template: `
    <nb-card accent="primary">
      <nb-card-header>{{title}}</nb-card-header>
      <nb-card-footer>
      <div class="row">
        <div class="col-md-2">
        </div>
        <div class="col-md-4">
          <button nbButton hero status="success" (click)="submit()">Yes</button>
        </div>
        <div class="col-md-4">
          <button nbButton hero status="danger" (click)="cancel()">No</button>
        </div>
      </div>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [`
    button {
      margin: 1rem;
    }
  `],
})
export class DialogSubmitPromptComponent {
  constructor(protected dialogRef: NbDialogRef<DialogSubmitPromptComponent>) {
  }

  cancel() {
    this.dialogRef.close(false);
  }

  submit() {
    this.dialogRef.close(true);
  }
}
