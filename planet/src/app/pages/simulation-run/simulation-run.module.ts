import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbDialogModule, NbListModule, NbSpinnerModule } from '@nebular/theme';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { SuiModule } from 'ng2-semantic-ui';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { SimulationRunRoutingModule } from './simulation-run-routing.module';
import { SimulationRunComponent } from './simulation-run.component';
import { SimulationStartComponent } from './simulation-start/simulation-start.component';

const COMPONENTS = [
  SimulationRunComponent,
  SimulationStartComponent,
];

const ENTRY_COMPONENTS = [
  SimulationRunComponent,
  SimulationStartComponent,
];


@NgModule({
  imports: [
    ThemeModule,
    SimulationRunRoutingModule,
    NbButtonModule,
    NbCardModule,
    NbListModule,
    NbSpinnerModule,
    NbDialogModule.forRoot(),
    HttpClientModule,
    NgxChartsModule,
    ChartModule,
    NgxEchartsModule,
    SuiModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class SimulationRunModule { }
