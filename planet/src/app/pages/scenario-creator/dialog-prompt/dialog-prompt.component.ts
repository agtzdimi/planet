import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'nb-name-prompt',
  template: `
    <nb-card accent="active">
      <nb-card-header>Initialize with default simulation values?</nb-card-header>
      <nb-card-footer>
      <div class="row">
        <div class="col-md-2">
        </div>
        <div class="col-md-4">
          <button nbButton hero status="danget" (click)="cancel()">No</button>
        </div>
        <div class="col-md-4">
          <button nbButton hero status="success" (click)="submit()">Yes</button>
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
export class DialogNamePromptComponent {
  constructor(protected dialogRef: NbDialogRef<DialogNamePromptComponent>) {
  }

  cancel() {
    this.dialogRef.close(false);
  }

  submit() {
    this.dialogRef.close(true);
  }
}
