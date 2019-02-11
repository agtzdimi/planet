import { NgModule } from '@angular/core';
import { NbButtonModule } from '@nebular/theme/components/button/button.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartModule } from 'angular2-chartjs';
import { HttpClientModule } from '@angular/common/http';

import { ThemeModule } from '../../@theme/theme.module';

import { SimulationResultsRoutingModule } from './simulation-results-routing.module';
import { SimulationResultsComponent } from './simulation-results.component';
import { SimulationsFilesComponent } from './simulation-start/simulation-start.component';
import { SimulationsAreaStackComponent } from './simulation-start/simulation-area-stack.component';
import { SimulationsBarComponent } from './simulation-start/simulation-bar-component';
import { DialogSelectFormPromptComponent } from './simulation-start/dialog-prompt/select-form.component';
import { NbDialogModule } from '@nebular/theme';
import { HighlightDirective } from './simulation-start/dialog-prompt/highlight.directive';
import { DialogSelectMultipleFormPromptComponent } from './simulation-start/dialog-prompt/select-multiple-form.component';
import { SimulationsLineComponent } from './simulation-start/simulation-line.component';

const COMPONENTS = [
  SimulationResultsComponent,
  SimulationsFilesComponent,
  SimulationsAreaStackComponent,
  SimulationsBarComponent,
  DialogSelectFormPromptComponent,
  HighlightDirective,
  DialogSelectMultipleFormPromptComponent,
  SimulationsLineComponent,
];

const ENTRY_COMPONENTS = [
  SimulationResultsComponent,
  SimulationsFilesComponent,
  SimulationsAreaStackComponent,
  SimulationsBarComponent,
  DialogSelectFormPromptComponent,
  DialogSelectMultipleFormPromptComponent,
  SimulationsLineComponent,
];


@NgModule({
  imports: [
    ThemeModule,
    SimulationResultsRoutingModule,
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
export class SimulationResultsModule { }
