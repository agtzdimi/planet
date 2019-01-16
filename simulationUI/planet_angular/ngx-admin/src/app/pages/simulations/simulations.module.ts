import { NgModule } from '@angular/core';
import { NbButtonModule } from '@nebular/theme/components/button/button.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartModule } from 'angular2-chartjs';
import { HttpClientModule } from '@angular/common/http';

import { ThemeModule } from '../../@theme/theme.module';

import { SimulationsRoutingModule } from './simulations-routing.module';
import { SimulationsComponent } from './simulations.component';
import { SimulationsFilesComponent } from './simulation-start/simulation-start.component'
import { SimulationsAreaStackComponent } from './simulation-start/simulationAreaStack.component'

const COMPONENTS = [
  SimulationsComponent,
  SimulationsFilesComponent,
  SimulationsAreaStackComponent
];

const ENTRY_COMPONENTS = [
  SimulationsComponent,
  SimulationsFilesComponent,
  SimulationsAreaStackComponent
];


@NgModule({
  imports: [
    ThemeModule,
    SimulationsRoutingModule,
    NbButtonModule,
    HttpClientModule,
    NgxChartsModule,
    ChartModule,
    NgxEchartsModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class SimulationsModule { }
