import { NgModule } from '@angular/core';
import { NbButtonModule } from '@nebular/theme/components/button/button.module';
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
