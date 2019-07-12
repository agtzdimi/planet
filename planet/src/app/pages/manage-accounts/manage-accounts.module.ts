import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule } from '@angular/forms';

import { ManageAccountsRoutingModule } from './manage-accounts-routing.module';
import { ManageAccountsComponent } from './manage-accounts.component';
import { ManageAccComponent } from './manage/manage.component';
import { MatSlideToggleModule } from '@angular/material';

const COMPONENTS = [
  ManageAccountsComponent,
  ManageAccComponent,
];

const ENTRY_COMPONENTS = [
];


@NgModule({
  imports: [
    ThemeModule,
    ManageAccountsRoutingModule,
    NbButtonModule,
    FormsModule,
    NbCardModule,
    MatSlideToggleModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class ManageAccountsModule { }
