import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'nb-name-prompt',
  template: `
    <nb-card>
      <nb-card-header>Do you want to initialize with the default values</nb-card-header>
      <nb-card-footer>
        <button nbButton hero status="danget" (click)="cancel()">No</button>
        <button nbButton hero status="success" (click)="submit(true)">OK</button>
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
    this.dialogRef.close();
  }

  submit(name) {
    this.dialogRef.close(name);
  }
}
