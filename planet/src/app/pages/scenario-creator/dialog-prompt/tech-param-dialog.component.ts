import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'nb-tech-param-prompt',
  template: `
    <nb-card accent="primary">
      <nb-card-header>Enter the technologies and their parameters for each of the nodes</nb-card-header>
      <nb-card-footer>
        <div class="row">
            <div class="col-md-5">
            </div>
            <div class="col-md-1">
                <button nbButton hero status="danger" (click)="submit()">OK</button>
            </div>
        </div>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [``],
})
export class DialogTechParamPromptComponent {
  constructor(protected dialogRef: NbDialogRef<DialogTechParamPromptComponent>) {
  }

  submit() {
    this.dialogRef.close();
  }
}
