import { Component, OnInit } from '@angular/core';
import { GetJWTService } from '../services/get-jwt.service';
import { CreateDeviceService } from '../services/create-device.service';

@Component({
  selector: 'ngx-unit-edit',
  styleUrls: ['./unit-edit.component.scss'],
  providers: [GetJWTService, CreateDeviceService],
  templateUrl: './unit-edit.component.html',
})
export class UnitEditComponent implements OnInit {
  data: Object;
  unitName: string;
  unitDescr: string;
  message: string;
  jwtToken: any;
  p2gUnit: Object;
  ehUnit: Object;
  hpUnit: Object;
  flexUnits: Object;
  activeModel: string = '';

  constructor(private getJWTService: GetJWTService, private createDeviceService: CreateDeviceService) {
    this.data = {};
  }

  ngOnInit() {
    this.flexUnits = [{
      id: 'P2G',
      label: 'Power 2 Gas',
    },
    {
      id: 'HP',
      label: 'Heat Pump',
    },
    {
      id: 'EH',
      label: 'Electric Heater',
    },
    ];
  }

  handleClick() {
    let metadata: string;
    switch (this.activeModel) {
      case 'P2G':
        metadata = JSON.stringify(this.p2gUnit['payload']['parameters']['configuration']);
        break;
      case 'EH':
        metadata = JSON.stringify(this.ehUnit['payload']['parameters']['configuration']);
        break;
      case 'HP':
        metadata = JSON.stringify(this.hpUnit['payload']['parameters']['configuration']);
        break;
    }
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
          'deviceTypeToken': this.activeModel + 'Token',
          metadata,
          'parentDeviceToken': this.activeModel + 'Token',
          'removeParentHardwareId': true,
          'status': '',
          'token': this.unitName,
        };
        this.createDeviceService.createNewDevice(this.data, this.jwtToken)
          .then(results => {
            this.message = JSON.stringify(results);
          });
      });
  }

}
