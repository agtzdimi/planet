import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbDialogModule, NbSpinnerModule, NbStepperModule } from '@nebular/theme';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { SuiModule } from 'ng2-semantic-ui';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { ParamsSetupComponent } from './params-setup/params-setup.component';
import { SystemParamsRoutingModule } from './system-params-routing.module';
import { SystemParamsComponent } from './system-params.component';

const COMPONENTS = [
  SystemParamsComponent,
  ParamsSetupComponent,
];

const ENTRY_COMPONENTS = [
  SystemParamsComponent,
  ParamsSetupComponent,
];

@NgModule({
  imports: [
    ThemeModule,
    SystemParamsRoutingModule,
    NbButtonModule,
    NbCardModule,
    NbSpinnerModule,
    NbStepperModule,
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
export class SystemParamsModule { }
