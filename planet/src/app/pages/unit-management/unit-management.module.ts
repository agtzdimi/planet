import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbActionsModule, NbButtonModule, NbCardModule, NbDialogModule, NbSpinnerModule } from '@nebular/theme';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { SuiModule } from 'ng2-semantic-ui';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { UnitAddComponent } from './unit-add/unit-add.component';
import { DialogDeleteComponent } from './unit-delete/dialog-delete.component';
import { UnitDeleteComponent } from './unit-delete/unit-delete.component';
import { UnitEditComponent } from './unit-edit/unit-edit.component';
import { UnitModelsComponent } from './unit-edit/unit-models.component';
import { UnitManagementRoutingModule } from './unit-management-routing.module';
import { UnitManagementComponent } from './unit-management.component';

const COMPONENTS = [
  UnitManagementComponent,
  UnitAddComponent,
  UnitEditComponent,
  UnitDeleteComponent,
  UnitModelsComponent,
  DialogDeleteComponent,
];

const ENTRY_COMPONENTS = [
  UnitManagementComponent,
  DialogDeleteComponent,
];

@NgModule({
  imports: [
    ThemeModule,
    UnitManagementRoutingModule,
    NbButtonModule,
    NbCardModule,
    FormsModule,
    NbActionsModule,
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
export class UnitManagementModule { }
