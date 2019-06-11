import { Component, OnInit } from '@angular/core';
import { GetJWTService } from '../services/get-jwt.service';
import { GetDeviceByTypeService } from '../services/get-deviceByType.service';
import { DeleteDeviceService } from '../services/delete-device.service';
import { NbDialogService } from '@nebular/theme';
import { DialogDeleteComponent } from './dialog-delete.component';
import { DeleteOutboundConnService } from '../services/delete-outbound-connector';

@Component({
  selector: 'ngx-unit-delete',
  styleUrls: ['./unit-delete.component.scss'],
  providers: [GetJWTService, DeleteDeviceService,
    GetDeviceByTypeService, DeleteOutboundConnService],
  templateUrl: './unit-delete.component.html',
})
export class UnitDeleteComponent implements OnInit {
  data: Object;
  unitName: string;
  message: string;
  jwtToken: any;
  p2gUnit: Object = [{}];
  vesUnit: Object = [{}];
  p2hUnit: Object = [{}];
  simUnit: Object = [{}];
  flexUnits: Object;
  activeModel: string = '';
  phase: string;
  loading: boolean = false;
  selectedModel;

  constructor(private getJWTService: GetJWTService,
    private getDeviceByType: GetDeviceByTypeService,
    private deleteDevice: DeleteDeviceService,
    private dialogService: NbDialogService,
    private deleteOutboundConnService: DeleteOutboundConnService) {
    this.data = {};
  }

  ngOnInit() {
    this.flexUnits = [{
      id: 'P2G',
      label: 'Power 2 Gas',
    },
    {
      id: 'P2H',
      label: 'Power 2 Heat',
    },
    {
      id: 'VES',
      label: 'Virtual Energy Storage',
    },
    {
      id: 'Sim',
      label: 'Simulator',
    },
    ];
    this.phase = '1';
  }

  getModels(id) {
    this.loading = true;
    this.getJWTService.getToken()
      .then((data: any) => {
        this.jwtToken = data;
        this.getDeviceByType.getDeviceByType(this.jwtToken, id + 'Token')
          .then(devices => {
            switch (id) {
              case 'P2G':
                this.p2gUnit = devices['results'];
                break;
              case 'VES':
                this.vesUnit = devices['results'];
                break;
              case 'P2H':
                this.p2hUnit = devices['results'];
                break;
              case 'Sim':
                this.simUnit = devices['results'];
            }
            this.loading = false;
          });
      });
  }

  handleModel(id) {
    this.phase = '2';
    this.activeModel = id;
    this.getModels(this.activeModel);
  }

  handleSelectedModel(event) {
    this.unitName = event['token'];
    this.selectedModel = event;
    this.dialogService.open(DialogDeleteComponent)
      .onClose.subscribe(value => {
        this.message = '';
        if (value) {
          this.getJWTService.getToken()
            .then((data: any) => {
              this.jwtToken = data;
              this.deleteDevice.deleteDevice(this.jwtToken, this.unitName)
                .then(results => {
                  this.deleteOutboundConnService.deleteOutBoundConnector({
                    'token': this.unitName,
                    'isSimulator': (this.activeModel === 'Sim'),
                  },
                    this.jwtToken);
                  this.message = JSON.stringify(results);
                  this.getModels(this.activeModel);
                });
            });
        }
      });
  }

}
