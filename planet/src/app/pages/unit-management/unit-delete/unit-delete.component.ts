import { Component, OnInit } from '@angular/core';
import { GetDeviceByTypeService } from '../../../@theme/services/unit-management-services/get-deviceByType.service';
import { DeleteDeviceService } from '../../../@theme/services/unit-management-services/delete-device.service';
import { NbDialogService } from '@nebular/theme';
import { DialogDeleteComponent } from './dialog-delete.component';

@Component({
  selector: 'ngx-unit-delete',
  styleUrls: ['./unit-delete.component.scss'],
  providers: [DeleteDeviceService,
    GetDeviceByTypeService],
  templateUrl: './unit-delete.component.html',
})
export class UnitDeleteComponent implements OnInit {
  data: Object;
  unitName: string;
  message: string;
  p2gUnit: Object = [{}];
  vesUnit: Object = [{}];
  p2hUnit: Object = [{}];
  simUnit: Object = [{}];
  flexUnits: Object;
  activeModel: string = '';
  phase: string;
  loading: boolean = false;
  selectedModel;

  constructor(private getDeviceByType: GetDeviceByTypeService,
    private deleteDevice: DeleteDeviceService,
    private dialogService: NbDialogService) {
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
    this.getDeviceByType.getDeviceByType()
      .then(devices => {
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

  handleModel(id) {
    this.phase = '2';
    this.activeModel = id;
    this.getModels(this.activeModel);
  }

  handleSelectedModel(event) {
    this.unitName = event['name'];
    this.selectedModel = event;
    this.dialogService.open(DialogDeleteComponent)
      .onClose.subscribe(value => {
        this.message = '';
        if (value) {
          this.deleteDevice.deleteDevice(this.unitName)
            .then(results => {
              this.message = JSON.stringify(results);
              this.getModels(this.activeModel);
            });
        }
      });
  }

}
