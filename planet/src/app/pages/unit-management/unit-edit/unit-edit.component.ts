import { Component, OnInit } from '@angular/core';
import { GetDeviceByTypeService } from '../../../@theme/services/unit-management-services/get-deviceByType.service';
import { EditDeviceService } from '../../../@theme/services/unit-management-services/edit-device.service';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';

@Component({
  selector: 'ngx-unit-edit',
  styleUrls: ['./unit-edit.component.scss'],
  providers: [GetDeviceByTypeService, EditDeviceService],
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
  vesUnit: Object = [{}];
  p2hUnit: Object = [{}];
  simUnit: Object = [{}];
  devices: Object = {};
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

  constructor(private getDeviceByType: GetDeviceByTypeService,
    private editDevice: EditDeviceService) {
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

  handleModel(id) {
    this.phase = '2';
    this.loading = true;
    this.activeModel = id;
    this.getDeviceByType.getDeviceByType()
      .then(devices => {
        this.devices = devices;
        switch (id) {
          case 'P2G':
            devices = devices['results']['resources'].filter((record) => {
              if (record) {
                return record['unitType'] === id;
              }
            });
            this.p2gUnit = devices;
            break;
          case 'VES':
            devices = devices['results']['resources'].filter((record) => {
              if (record) {
                return record['unitType'] === id;
              }
            });
            this.vesUnit = devices;
            break;
          case 'P2H':
            devices = devices['results']['resources'].filter((record) => {
              if (record) {
                return record['unitType'] === id;
              }
            });
            this.p2hUnit = devices;
            break;
          case 'Sim':
            devices = devices['results']['resources'].filter((record) => {
              if (record) {
                return record['unitType'] === id;
              }
            });
            this.simUnit = devices;
            break;
        }
        this.loading = false;
      });
  }

  handleClick() {

    let metadata: string;
    if (this.activeModel === 'Sim') {
      this.selectedModel['metadata']['IP'] = this.unitIP;
      this.selectedModel['metadata']['Port'] = this.unitPort;
      metadata = JSON.stringify(this.selectedModel['metadata']);
    } else {
      metadata = JSON.stringify(this.selectedModel['payload']['parameters']['configuration']);
    }
    metadata = metadata.replace('}{', ',');
    // metadata = metadata.replace(/_/g, '.');
    metadata = JSON.parse(metadata);
    this.editDevice.editDevice(this.devices, metadata, this.unitName, this.selectedModel['description'], this.unitIP, this.unitPort)
      .then(results => {
        this.message = JSON.stringify(results);
      });
  }

  handleSelectedModel(event, controller, transitionName: string = 'fade down') {
    controller.animate(
      new Transition(transitionName, 1500, TransitionDirection.In));
    this.unitName = event['name'];
    this.unitIP = event['IP'];
    this.unitPort = event['Port'];
    this.selectedModel = event;
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
