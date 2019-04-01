import { Component } from '@angular/core';
import { NbRegisterComponent } from '@nebular/auth';

@Component({
  selector: 'nb-register',
  templateUrl: './register.component.html',
})

export class NgxRegisterComponent extends NbRegisterComponent {

  doRegister: boolean = false;
  checkBoxVal: boolean = false;
  showMessage: Object = {};

  registerUser() {
    this.doRegister = !this.doRegister;
  }

  checkBoxValue() {
    this.checkBoxVal = !this.checkBoxVal;
  }

}
