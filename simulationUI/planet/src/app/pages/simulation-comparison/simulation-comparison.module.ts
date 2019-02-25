import { NgModule } from '@angular/core';
import { NbButtonModule } from '@nebular/theme/components/button/button.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartModule } from 'angular2-chartjs';
import { HttpClientModule } from '@angular/common/http';

import { ThemeModule } from '../../@theme/theme.module';
import { SuiModule } from 'ng2-semantic-ui';

import { SimulationComparisonRoutingModule } from './simulation-comparison-routing.module';
import { SimulationComparisonComponent } from './simulation-comparison.component';
import { ComparisonStartComponent } from './comparison-start/comparison-start.component';
import { NbDialogModule } from '@nebular/theme';
import { ComparisonHighlightDirective } from './comparison-start/dialog-prompt/comparison-highlight.directive';
import { DialogSelectMultipleFormPromptComponent } from './comparison-start/dialog-prompt/select-multiple-form.component';
import { SimulationsLineComponent } from './comparison-start/simulation-line.component';

const COMPONENTS = [
  SimulationComparisonComponent,
  ComparisonStartComponent,
  ComparisonHighlightDirective,
  DialogSelectMultipleFormPromptComponent,
  SimulationsLineComponent,
];

const ENTRY_COMPONENTS = [
  SimulationComparisonComponent,
  ComparisonStartComponent,
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
    SuiModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class SimulationComparisonModule { }
