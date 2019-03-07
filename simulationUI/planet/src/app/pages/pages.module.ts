import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { SimulationRunModule } from './simulation-run/simulation-run.module';
import { SimulationComparisonModule } from './simulation-comparison/simulation-comparison.module';
import { UserProfileComponent } from './user-profile/user-profile.component';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    MiscellaneousModule,
    SimulationRunModule,
    SimulationComparisonModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    UserProfileComponent,
  ],
})
export class PagesModule {
}
