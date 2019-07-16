import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbDialogModule, NbPopoverModule, NbSpinnerModule } from '@nebular/theme';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { ThemeModule } from '../../@theme/theme.module';
import { ComparisonStartComponent } from './comparison-start/comparison-start.component';
import { SimulationComparisonRoutingModule } from './simulation-comparison-routing.module';
import { SimulationComparisonComponent } from './simulation-comparison.component';

const COMPONENTS = [
  SimulationComparisonComponent,
  ComparisonStartComponent,
];

const ENTRY_COMPONENTS = [
  SimulationComparisonComponent,
  ComparisonStartComponent,
];

@NgModule({
  imports: [
    ThemeModule,
    SimulationComparisonRoutingModule,
    NbButtonModule,
    NbCardModule,
    NbPopoverModule,
    FormsModule,
    NbSpinnerModule,
    NbDialogModule.forRoot(),
    HttpClientModule,
    NgxChartsModule,
    ChartModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class SimulationComparisonModule { }
