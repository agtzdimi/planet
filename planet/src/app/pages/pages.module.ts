import { NgModule } from '@angular/core';
import {
  NbCardModule,
  NbMenuModule,
  NbUserModule,
  NbIconModule,
  NbListModule,
  NbSelectModule,
  NbButtonModule,
} from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { SimulationComparisonModule } from './simulation-comparison/simulation-comparison.module';
import { SimulationRunModule } from './simulation-run/simulation-run.module';
import { SystemParamsModule } from './system-params/system-params.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { UserAdministrationComponent } from './user-administration/user-administration.component';
import { Ng2SmartTableModule } from '@mykeels/ng2-smart-table';
import { UserAdminPictureComponent } from './user-administration/user-admin-picture/user-admin-picture.component';
import { UserAdminRoleComponent } from './user-administration/user-admin-role/user-admin-role.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbUserModule,
    NbIconModule,
    NbListModule,
    NbSelectModule,
    NbButtonModule,
    Ng2SmartTableModule,
    NbCardModule,
    MiscellaneousModule,
    SimulationRunModule,
    SimulationComparisonModule,
    SystemParamsModule,
  ],
  declarations: [
    PagesComponent,
    UserProfileComponent,
    WelcomeScreenComponent,
    UserAdministrationComponent,
    UserAdminPictureComponent,
    UserAdminRoleComponent,
  ],
  entryComponents: [
    UserAdminPictureComponent,
    UserAdminRoleComponent,
  ],
})
export class PagesModule {
}
