import { NgModule } from '@angular/core';
import { NbButtonModule } from '@nebular/theme/components/button/button.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartModule } from 'angular2-chartjs';
import { HttpClientModule } from '@angular/common/http';

import { ThemeModule } from '../../@theme/theme.module';

import { SimulationRunRoutingModule } from './simulation-run-routing.module';
import { SimulationRunComponent } from './simulation-run.component';
import { SimulationStartComponent } from './simulation-start/simulation-start.component';
import { SimulationsAreaStackComponent } from './simulation-start/simulation-area-stack.component';
import { SimulationsBarComponent } from './simulation-start/simulation-bar-component';
import { DialogSelectFormPromptComponent } from './simulation-start/dialog-prompt/select-form.component';
import { NbDialogModule } from '@nebular/theme';
import { HighlightDirective } from './simulation-start/dialog-prompt/highlight.directive';
import { SuiModule } from 'ng2-semantic-ui';

const COMPONENTS = [
  SimulationRunComponent,
  SimulationStartComponent,
  SimulationsAreaStackComponent,
  SimulationsBarComponent,
  DialogSelectFormPromptComponent,
  HighlightDirective,
];

const ENTRY_COMPONENTS = [
  SimulationRunComponent,
  SimulationStartComponent,
  SimulationsAreaStackComponent,
  SimulationsBarComponent,
  DialogSelectFormPromptComponent,
];


@NgModule({
  imports: [
    ThemeModule,
    SimulationRunRoutingModule,
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
export class SimulationRunModule { }
