import { Component, OnInit } from '@angular/core';
import { GetJWTService } from '../services/get-jwt.service';
import { GetDeviceByTypeService } from '../services/get-deviceByType.service';
import { EditDeviceService } from '../services/edit-device.service';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { EditOutboundConnService } from '../services/edit-outbound-connector';

@Component({
  selector: 'ngx-unit-edit',
  styleUrls: ['./unit-edit.component.scss'],
  providers: [GetJWTService, GetDeviceByTypeService,
    EditDeviceService, EditOutboundConnService],
  templateUrl: './unit-edit.component.html',
})
export class UnitEditComponent implements OnInit {
  data: Object;
  unitName: string;
  unitIP: string;
  unitPort: string;
  message: string;
  jwtToken: any;
  p2gUnit: Object = [{}];
  ehUnit: Object = [{}];
  hpUnit: Object = [{}];
  flexUnits: Object;
  activeModel: string = '';
  phase: string;
  loading: boolean = false;
  selectedModel;
  transitionController = new TransitionController();

  constructor(private getJWTService: GetJWTService,
    private getDeviceByType: GetDeviceByTypeService,
    private editDevice: EditDeviceService,
    private editOutboundConnService: EditOutboundConnService) {
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
    this.phase = '1';
  }

  handleModel(id) {
    this.phase = '2';
    this.loading = true;
    this.activeModel = id;
    this.getJWTService.getToken()
      .then((data: any) => {
        this.jwtToken = data;
        this.getDeviceByType.getDeviceByType(this.jwtToken, id + 'Token')
          .then(devices => {
            switch (id) {
              case 'P2G':
                this.p2gUnit = devices['results'];
                break;
              case 'EH':
                this.ehUnit = devices['results'];
                break;
              case 'HP':
                this.hpUnit = devices['results'];
                break;
            }
            this.loading = false;
          });
      });
  }

  handleClick() {
    if (this.selectedModel['payload']) {
      let metadata = JSON.stringify(this.selectedModel['payload']['parameters']['configuration']);
      metadata = metadata.replace('}{', ',');
      metadata = metadata.replace(/\./g, '_');
      metadata = JSON.parse(metadata);
      this.getJWTService.getToken()
        .then((data: any) => {
          this.jwtToken = data;
          this.data = {
            'comments': this.selectedModel['description'],
            metadata,
          };
          this.editDevice.editDevice(this.jwtToken, this.data, this.unitName)
            .then(results => {
              this.message = JSON.stringify(results);
            });

          this.editOutboundConnService.editOutBoundConnector({
            'ip': this.unitIP,
            'port': this.unitPort,
            'token': this.unitName,
          }, this.jwtToken)
            .then(results => {
              this.message = JSON.stringify(results);
            });
        });
    }
  }

  handleSelectedModel(event, controller, transitionName: string = 'fade down') {
    controller.animate(
      new Transition(transitionName, 1500, TransitionDirection.In));
    this.unitName = event['token'];
    this.selectedModel = event;
    this.phase = '3';
  }

}
