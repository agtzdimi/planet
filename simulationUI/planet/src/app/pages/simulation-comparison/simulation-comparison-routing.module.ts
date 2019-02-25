import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComparisonStartComponent } from './comparison-start/comparison-start.component';


const routes: Routes = [{
  path: '',
  component: ComparisonStartComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimulationComparisonRoutingModule { }
