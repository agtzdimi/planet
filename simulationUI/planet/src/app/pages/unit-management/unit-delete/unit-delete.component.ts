import { Component } from '@angular/core';
import { GetJWTService } from '../services/get-jwt.service';
import { CreateDeviceService } from '../services/create-device.service';

@Component({
  selector: 'ngx-unit-delete',
  styleUrls: ['./unit-delete.component.scss'],
  providers: [GetJWTService, CreateDeviceService],
  templateUrl: './unit-delete.component.html',
})
export class UnitDeleteComponent {
  data: Object;
  unitName: string;
  unitDescr: string;
  jwtToken: any;
  p2gUnit: Object;

  constructor(private getJWTService: GetJWTService, private createDeviceService: CreateDeviceService) {
    this.data = {};
  }

  handleClick() {
    let metadata = JSON.stringify(this.p2gUnit['payload']['parameters']['configuration']);
    metadata = metadata.replace('}{', ',');
    metadata = metadata.replace(/\./g, '_');
    metadata = JSON.parse(metadata);
    this.getJWTService.getToken()
      .then((data: any) => {
        this.jwtToken = data;
        this.data = {
          'comments': this.unitDescr,
          'deviceElementMappings': [
          ],
          'deviceTypeToken': 'p2gToken',
          metadata,
          'parentDeviceToken': 'p2gToken',
          'removeParentHardwareId': true,
          'status': '',
          'token': this.unitName,
        };
        this.createDeviceService.createNewDevice(this.data, this.jwtToken);
      });
  }

}
