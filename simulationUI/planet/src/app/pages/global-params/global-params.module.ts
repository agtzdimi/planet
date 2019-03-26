import { NgModule } from '@angular/core';
import { NbButtonModule } from '@nebular/theme/components/button/button.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartModule } from 'angular2-chartjs';
import { HttpClientModule } from '@angular/common/http';

import { ThemeModule } from '../../@theme/theme.module';
import { SuiModule } from 'ng2-semantic-ui';

import { GlobalParamsRoutingModule } from './global-params-routing.module';
import { GlobalParamsComponent } from './global-params.component';
import { ParamsSetupComponent } from './params-setup/params-setup.component';
import { NbDialogModule } from '@nebular/theme';

const COMPONENTS = [
  GlobalParamsComponent,
  ParamsSetupComponent,
];

const ENTRY_COMPONENTS = [
  GlobalParamsComponent,
  ParamsSetupComponent,
];


@NgModule({
  imports: [
    ThemeModule,
    GlobalParamsRoutingModule,
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
export class GlobalParamsModule { }
