import { Component, OnInit } from '@angular/core';
import { GetJWTService } from '../services/get-jwt.service';
import { GetDeviceByTypeService } from '../services/get-deviceByType.service';
import { EditDeviceService } from '../services/edit-device.service';
import { GetOutboundConnService } from '../services/get-outbound-connector';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { EditOutboundConnService } from '../services/edit-outbound-connector';

@Component({
  selector: 'ngx-unit-edit',
  styleUrls: ['./unit-edit.component.scss'],
  providers: [GetJWTService, GetDeviceByTypeService,
    EditDeviceService, EditOutboundConnService,
    GetOutboundConnService],
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
  simUnit: Object = [{}];
  flexUnits: Object;
  activeModel: string = '';
  phase: string;
  loading: boolean = false;
  selectedModel;
  transitionController = new TransitionController();
  selectedOptions =
    {
      'Simulink': '',
      'OpalRT': '',
    };

  constructor(private getJWTService: GetJWTService,
    private getDeviceByType: GetDeviceByTypeService,
    private editDevice: EditDeviceService,
    private getOutboundConnService: GetOutboundConnService,
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
    {
      id: 'Sim',
      label: 'Simulator',
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
              case 'Sim':
                this.simUnit = devices['results'];
                break;
            }
            this.loading = false;
          });

      });
  }

  handleClick() {

    if (this.selectedModel['payload'] || this.activeModel === 'Sim') {
      let metadata: string;
      if (this.activeModel === 'Sim') {
        this.selectedModel['metadata']['IP'] = this.unitIP;
        this.selectedModel['metadata']['Port'] = this.unitPort;
        metadata = JSON.stringify(this.selectedModel['metadata']);
      } else {
        metadata = JSON.stringify(this.selectedModel['payload']['parameters']['configuration']);
      }
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

          this.editConnector(this.unitName);

        });
    }
  }

  editConnector(name) {
    this.editOutboundConnService.editOutBoundConnector({
      'ip': this.unitIP,
      'port': this.unitPort,
      'token': name,
      'isSimulator': (this.activeModel === 'Sim'),
    }, this.jwtToken)
      .then(results => {
        this.message = JSON.stringify(results);
      });
  }

  handleSelectedModel(event, controller, transitionName: string = 'fade down') {
    controller.animate(
      new Transition(transitionName, 1500, TransitionDirection.In));
    this.unitName = event['token'];
    this.selectedModel = event;
    if (this.activeModel === 'Sim') {
      this.selectedModel['metadata']['Simulink'] = JSON.parse(this.selectedModel['metadata']['Simulink']);
      this.selectedModel['metadata']['OpalRT'] = JSON.parse(this.selectedModel['metadata']['OpalRT']);
      this.unitName = this.selectedModel['metadata']['Topic'];
    }

    this.getJWTService.getToken()
      .then((data: any) => {
        this.jwtToken = data;
        this.getOutboundConnService.getOutBoundConnector(this.unitName, this.jwtToken)
          .then(connectors => {
            for (const attr of connectors['attributes']) {
              if (attr['name'] === 'hostname') {
                this.unitIP = attr['value'];
              } else if (attr['name'] === 'port') {
                this.unitPort = attr['value'];
              }
            }
            this.unitName = this.unitName.replace(/^Send/, '').replace(/^Get/, '');
          });
      });

    this.phase = '3';
  }

  handleSimulator(event, simulator) {
    if (simulator === 'OpalRT') {
      this.selectedModel['metadata']['Simulink'] = false;
      this.selectedModel['metadata']['OpalRT'] = event;
    } else {
      this.selectedModel['metadata']['OpalRT'] = false;
      this.selectedModel['metadata']['Simulink'] = event;
    }
  }

}
