import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CreateDeviceService } from '../../../@theme/services/unit-management-services/create-device.service';
import { GetAreaGridsService } from '../../../@theme/services/unit-management-services/get-area-grids.service';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';

@Component({
  selector: 'ngx-unit-add',
  styleUrls: ['./unit-add.component.scss'],
  providers: [CreateDeviceService,
    GetAreaGridsService],
  templateUrl: './unit-add.component.html',
})
export class UnitAddComponent implements OnInit {
  data: Object;
  unitName: string;
  unitIP: string;
  unitPort: string;
  unitDescr: string;
  jwtToken: any;
  message: string;
  p2gUnit: Object;
  p2hUnit: Object;
  vesUnit: Object;
  flexUnits = [{}];
  grids = [{}];
  nodes = [{}];
  activeModel: string = '';
  transitionController = new TransitionController();
  gridLabel = 'Available Grids';
  areaSelected = false;
  area = '';
  selectedOptions =
    {
      'Simulink': true,
      'OpalRT': false,
    };

  @Output() select: EventEmitter<number> = new EventEmitter();

  constructor(private createDeviceService: CreateDeviceService) {
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
  }

  public animateInfo(controller, transitionName: string = 'slide down', id) {
    this.activeModel = id;
    controller.animate(
      new Transition(transitionName, 1500, TransitionDirection.In));
  }

  gridSelected(event) {
    this.areaSelected = true;
    this.area = event['name'];
  }

  handleClick() {
    let metadata: string;
    switch (this.activeModel) {
      case 'P2G':
        metadata = JSON.stringify(this.p2gUnit['payload']['parameters']['configuration']);
        break;
      case 'VES':
        metadata = JSON.stringify(this.vesUnit['payload']);
        break;
      case 'P2H':
        metadata = JSON.stringify(this.p2hUnit['payload']['parameters']['configuration']);
        break;
      case 'Sim':
        const simData = this.selectedOptions;
        simData['IP'] = this.unitIP;
        simData['Port'] = this.unitPort;
        simData['Topic'] = this.unitName;
        metadata = JSON.stringify(simData);
        break;
    }
    metadata = metadata.replace('}{', ',');
    metadata = metadata.replace(/_/g, '.');
    metadata = JSON.parse(metadata);

    this.createDeviceService.createNewDevice(metadata, this.unitName, this.unitDescr,
      this.activeModel, this.unitIP, this.unitPort)
      .then(results => {
        this.message = JSON.stringify(results);
      });
  }

  handleSimulator(event, simulator) {
    if (simulator === 'OpalRT') {
      this.selectedOptions['Simulink'] = false;
      this.selectedOptions['OpalRT'] = event;
    } else {
      this.selectedOptions['OpalRT'] = false;
      this.selectedOptions['Simulink'] = event;
    }
  }

}
