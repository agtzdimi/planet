import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'nb-name-prompt',
  template: `
    <nb-card accent="primary">
      <nb-card-header>{{node}} Technologies</nb-card-header>
      <nb-card-footer>
      <div class="row">
        <div class="col-md-2">
        </div>
        <div class="col-md-4">
          <button nbButton hero status="danget" (click)="cancel()">Close</button>
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
export class TechnologiesDialogComponent implements OnInit {

  node: string = '';
  constructor(protected dialogRef: NbDialogRef<TechnologiesDialogComponent>) {
  }

  ngOnInit() {
    for (const property in this) {
      if (property !== 'dialogRef' && property !== 'ngOnInit' && property !== 'cancel'
        && property !== 'submit' && property !== 'node') {
        this.node = this.node + this[property];
      }
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }

  submit() {
    this.dialogRef.close(true);
  }
}
