import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'nb-name-prompt',
  template: `
    <nb-card>
      <nb-card-header>Enter Dataset Name</nb-card-header>
      <nb-card-body>
        <input #name nbInput placeholder="Name">
      </nb-card-body>
      <nb-card-footer>
        <button nbButton hero status="danget" (click)="cancel()">Cancel</button>
        <button nbButton hero status="success" (click)="submit(name.value)">Submit</button>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [`
    button {
      margin: 1rem;
    }
  `],
})
export class DialogSaveParamPromptComponent {
  constructor(protected dialogRef: NbDialogRef<DialogSaveParamPromptComponent>) {
  }

  cancel() {
    this.dialogRef.close();
  }

  submit(name) {
    this.dialogRef.close(name);
  }
}
