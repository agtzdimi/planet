import { NgModule } from '@angular/core';
import { NbButtonModule } from '@nebular/theme/components/button/button.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartModule } from 'angular2-chartjs';
import { HttpClientModule } from '@angular/common/http';

import { ThemeModule } from '../../@theme/theme.module';

import { SimulationsRoutingModule } from './simulations-routing.module';
import { SimulationsComponent } from './simulations.component';
import { SimulationsFilesComponent } from './simulation-start/simulation-start.component';
import { SimulationsAreaStackComponent } from './simulation-start/simulation-area-stack.component';
import { SimulationsBarComponent } from './simulation-start/simulation-bar-component';
import { DialogSelectFormPromptComponent } from './simulation-start/dialog-prompt/select-form.component';
import { NbDialogModule } from '@nebular/theme';
import { HighlightDirective } from './simulation-start/dialog-prompt/highlight.directive';
import { DialogSelectMultipleFormPromptComponent } from './simulation-start/dialog-prompt/select-multiple-form.component';

const COMPONENTS = [
  SimulationsComponent,
  SimulationsFilesComponent,
  SimulationsAreaStackComponent,
  SimulationsBarComponent,
  DialogSelectFormPromptComponent,
  HighlightDirective,
  DialogSelectMultipleFormPromptComponent,
];

const ENTRY_COMPONENTS = [
  SimulationsComponent,
  SimulationsFilesComponent,
  SimulationsAreaStackComponent,
  SimulationsBarComponent,
  DialogSelectFormPromptComponent,
  DialogSelectMultipleFormPromptComponent,
];


@NgModule({
  imports: [
    ThemeModule,
    SimulationsRoutingModule,
    NbButtonModule,
    NbDialogModule.forRoot(),
    HttpClientModule,
    NgxChartsModule,
    ChartModule,
    NgxEchartsModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class SimulationsModule { }
