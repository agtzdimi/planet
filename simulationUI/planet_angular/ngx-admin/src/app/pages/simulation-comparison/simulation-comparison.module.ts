import { NgModule } from '@angular/core';
import { NbButtonModule } from '@nebular/theme/components/button/button.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartModule } from 'angular2-chartjs';
import { HttpClientModule } from '@angular/common/http';

import { ThemeModule } from '../../@theme/theme.module';

import { SimulationComparisonRoutingModule } from './simulation-comparison-routing.module';
import { SimulationComparisonComponent } from './simulation-comparison.component';
import { ComparisonStartComponent } from './comparison-start/comparison-start.component';
import { SimulationsAreaStackComponent } from './comparison-start/simulation-area-stack.component';
import { SimulationsBarComponent } from './comparison-start/simulation-bar-component';
import { DialogSelectFormPromptComponent } from './comparison-start/dialog-prompt/select-form.component';
import { NbDialogModule } from '@nebular/theme';
import { HighlightDirective } from './comparison-start/dialog-prompt/highlight.directive';
import { DialogSelectMultipleFormPromptComponent } from './comparison-start/dialog-prompt/select-multiple-form.component';
import { SimulationsLineComponent } from './comparison-start/simulation-line.component';

const COMPONENTS = [
  SimulationComparisonComponent,
  ComparisonStartComponent,
  SimulationsAreaStackComponent,
  SimulationsBarComponent,
  DialogSelectFormPromptComponent,
  HighlightDirective,
  DialogSelectMultipleFormPromptComponent,
  SimulationsLineComponent,
];

const ENTRY_COMPONENTS = [
  SimulationComparisonComponent,
  ComparisonStartComponent,
  SimulationsAreaStackComponent,
  SimulationsBarComponent,
  DialogSelectFormPromptComponent,
  DialogSelectMultipleFormPromptComponent,
  SimulationsLineComponent,
];


@NgModule({
  imports: [
    ThemeModule,
    SimulationComparisonRoutingModule,
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
export class SimulationComparisonModule { }
