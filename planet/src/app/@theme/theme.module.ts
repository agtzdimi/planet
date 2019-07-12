import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxLoginComponent } from './components/auth/login/login.component';
import { NgxAuthBlockComponent } from './components/auth/auth-block/auth-block.component';
import { NgxResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { NgxRequestPasswordComponent } from './components/auth/request-password/request-password.component';
import { NgxRegisterComponent } from './components/auth/register/register.component';
import { NgxSendResetRequestComponent } from './components/auth/reset-password/send-reset-request';
import { NgxCreateAccountComponent } from './components/auth/register/create-account.component';
import { NgxLogoutComponent } from './components/auth/logout/logout.component';
import { NgxAuthComponent } from './components/auth/auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TechInputFieldComponent } from './components/planet/tech-input-field.component';
import { EightNodeElGridComponent } from './components/planet/grids/eight-node-el-grid/eight-node-el-grid.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { EnergyGridComponent } from './components/planet/grids/energy-grid/energy-grid.component';
import { TechnologiesDialogComponent } from './components/planet/grids/energy-grid/energy-grid.tech.component';
import {
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbInputModule,
  NbSidebarModule,
  NbAlertModule,
  NbCheckboxModule,
  NbCardModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbThemeModule,
  NbTabsetModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbSecurityModule } from '@nebular/security';

import {
  FooterComponent,
  HeaderComponent,
  SearchInputComponent,
  TinyMCEComponent,
  ToggleSettingsButtonComponent,
} from './components';
import {
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
} from './pipes';
import {
  OneColumnLayoutComponent,
} from './layouts';
import { WindowModeBlockScrollService } from './services/window-mode-block-scroll.service';
import { DEFAULT_THEME } from './styles/theme.default';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { CORPORATE_THEME } from './styles/theme.corporate';
import { DARK_THEME } from './styles/theme.dark';
import { ThemeSettingsComponent } from './components/theme-settings/theme-settings.component';

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbCardModule,
  NbInputModule,
  NbSearchModule,
  NbSidebarModule,
  NbAlertModule,
  NbTabsetModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbCheckboxModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbEvaIconsModule,
];
const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  SearchInputComponent,
  TinyMCEComponent,
  OneColumnLayoutComponent,
  NgxAuthBlockComponent,
  EightNodeElGridComponent,
  TechInputFieldComponent,
  NgxLoginComponent,
  NgxAuthComponent,
  EnergyGridComponent,
  NgxRegisterComponent,
  ThemeSettingsComponent,
  NgxSendResetRequestComponent,
  NgxResetPasswordComponent,
  NgxRequestPasswordComponent,
  NgxCreateAccountComponent,
  TechnologiesDialogComponent,
  NgxLogoutComponent,
  ToggleSettingsButtonComponent,
];
const ENTRY_COMPONENTS = [
  TechnologiesDialogComponent,
];
const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
];

@NgModule({
  imports: [CommonModule, ...NB_MODULES, FormsModule, ReactiveFormsModule, RouterModule, Ng2SmartTableModule],
  exports: [CommonModule, ...PIPES, ...COMPONENTS],
  declarations: [...COMPONENTS, ...PIPES],
  entryComponents: [...ENTRY_COMPONENTS],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'dark',
          },
          [DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME],
        ).providers,
        WindowModeBlockScrollService,
      ],
    };
  }
}
