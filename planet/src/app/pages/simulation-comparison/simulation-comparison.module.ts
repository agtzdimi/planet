import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbPopoverModule, NbSpinnerModule } from '@nebular/theme';
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
import { DialogSelectMultipleFormPromptComponent } from './comparison-start/dialog-prompt/select-multiple-form.component';
import { SimulationsLineComponent } from './comparison-start/simulation-line.component';
import { ComparisonBarsComponent } from './comparison-start/comparison-bars.component';
import { FormsModule } from '@angular/forms';

const COMPONENTS = [
  SimulationComparisonComponent,
  ComparisonStartComponent,
  DialogSelectMultipleFormPromptComponent,
  SimulationsLineComponent,
  ComparisonBarsComponent,
];

const ENTRY_COMPONENTS = [
  SimulationComparisonComponent,
  ComparisonStartComponent,
  DialogSelectMultipleFormPromptComponent,
  SimulationsLineComponent,
  ComparisonBarsComponent,
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
    SuiModule,
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
