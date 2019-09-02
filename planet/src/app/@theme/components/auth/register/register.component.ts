import { Component } from '@angular/core';
import { NbRegisterComponent } from '@nebular/auth';

@Component({
  selector: 'nb-register',
  templateUrl: './register.component.html',
})

export class NgxRegisterComponent extends NbRegisterComponent {

  doRegister: boolean = false;
  showMessage: Object = {};
  roles = [
    { value: 'dso', label: 'DSO' },
    { value: 'unitManager', label: 'Unit Manager' },
    { value: 'admin', label: 'Administrator' },
  ];
  role;

  registerUser() {
    this.doRegister = !this.doRegister;
  }

}
