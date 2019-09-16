import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-unit-models',
  styleUrls: ['./unit-edit.component.scss'],
  template: `
  <div class="row">
  <div class="col-md-4" *ngFor="let model of models; let i = index">
    <div class=" imageCard">

      <nb-card [nbSpinner]="loading" nbSpinnerStatus="danger" nbSpinnerSize="xlarge" accent="primary">
        <nb-card-body (click)="handleUnit(model)">
          <img class="component-icon" src="assets/images/{{modelType}}.jpg"
            [ngStyle]="{'width': '15rem', 'height': '11rem'}">
          <label class="component-name">{{models[i]['name']}}</label>
        </nb-card-body>
      </nb-card>

    </div>
  </div>
</div>
  `,
})

export class UnitModelsComponent {

  @Input() models;
  @Input() loading;
  @Input() modelType;
  @Output() selectedModel: EventEmitter<Object>;

  constructor() {
    this.selectedModel = new EventEmitter<Object>();
  }

  handleUnit(md) {
    this.selectedModel.emit(md);
  }
}
