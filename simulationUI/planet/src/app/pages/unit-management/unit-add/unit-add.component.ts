import { Component, OnInit } from '@angular/core';
import { GetJWTService } from '../services/get-jwt.service';
import { CreateDeviceService } from '../services/create-device.service';
import { GetAreaGridsService } from '../services/get-area-grids.service';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';

@Component({
  selector: 'ngx-unit-add',
  styleUrls: ['./unit-add.component.scss'],
  providers: [GetJWTService, CreateDeviceService, GetAreaGridsService],
  templateUrl: './unit-add.component.html',
})
export class UnitAddComponent implements OnInit {
  data: Object;
  unitName: string;
  unitDescr: string;
  jwtToken: any;
  message: string;
  p2gUnit: Object;
  hpUnit: Object;
  ehUnit: Object;
  flexUnits = [{}];
  grids = [{}];
  nodes = [{}];
  activeModel: string = '';
  transitionController = new TransitionController();
  gridLabel = 'Available Grids';
  areaSelected = false;
  area = '';

  constructor(private getJWTService: GetJWTService, private createDeviceService: CreateDeviceService,
    private getAreaGridsService: GetAreaGridsService) {
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

  public animateInfo(controller, transitionName: string = 'slide down', id) {
    this.activeModel = id;
    controller.animate(
      new Transition(transitionName, 1500, TransitionDirection.In));
    this.getJWTService.getToken()
      .then((data: any) => {
        this.jwtToken = data;
        this.getAreaGridsService.getAreaGrids(this.jwtToken, 'true')
          .then(results => {
            this.grids = results['results'];
            this.getAreaGridsService.getAreaGrids(this.jwtToken, 'false')
              .then(nodes => {
                this.nodes = nodes['results'];
                this.nodes = this.nodes.filter(area => {
                  return area['parentAreaId'] !== undefined;
                });
              });
          });
      },
      );
  }

  gridSelected(event) {
    // console.log(event)
    this.areaSelected = true;
    this.area = event;
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
