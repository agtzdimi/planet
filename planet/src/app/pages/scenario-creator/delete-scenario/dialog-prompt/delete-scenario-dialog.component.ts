import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-delete-scenario-dialog',
  template: `
    <nb-card accent="active">
      <nb-card-header>Are you sure you Want to Delete this Scenario?</nb-card-header>
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
export class DeleteScenarioDialogComponent {
  constructor(protected dialogRef: NbDialogRef<DeleteScenarioDialogComponent>) {
  }

  cancel() {
    this.dialogRef.close(false);
  }

  submit() {
    this.dialogRef.close(true);
  }
}
