import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GetJWTService } from '../services/get-jwt.service';
import { CreateDeviceService } from '../services/create-device.service';
import { GetAreaGridsService } from '../services/get-area-grids.service';
import { AddOutboundConnService } from '../services/add-outbound-connector';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';

@Component({
  selector: 'ngx-unit-add',
  styleUrls: ['./unit-add.component.scss'],
  providers: [GetJWTService, CreateDeviceService,
    GetAreaGridsService, AddOutboundConnService],
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
  selectedOptions =
    {
      'Simulink': true,
      'OpalRT': false,
    };

  @Output() select: EventEmitter<number> = new EventEmitter();

  selectedRoom: null;
  sortedRooms = [];
  viewBox = '-10 -10 768.88 567.99';
  isIE = !!(navigator.userAgent.match(/Trident/)
    || navigator.userAgent.match(/MSIE/)
    || navigator.userAgent.match(/Edge/));
  isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') >= 0;
  roomSvg = {
    borders: [{
      d: '',
    }],
    rooms: [
      {
        id: '0',
        name: { text: 'Node 1', x: 142, y: 4.1 },
        number: {
          text: '204871', x: 415, y: 20.1,
          text2: '1551412', x2: 435, y2: 4.1,
        },
        area: {
          d: `M 200,0 L 400,0 M 315,0 V 15 M 270,15 L 380,15 M 355,15 V30 a 9,7 0 1,0 1,0 M 355,38 a 9,7 0 1,0 1,0Z
        M 355,53 V66 M 356, 67 L 347, 58 M 354, 67 L 363, 58 M 285,15 V 45 M 286,45 L 277,36  M 284,46 L 293, 36` },
        border: {
          d: ``,
        },
      },
      {
        id: '1',
        name: { text: 'Node 2', x: 142, y: 79.1 },
        number: { text: '204228', x: 415, y: 79.1 },
        area: {
          d: `M 270,77 L 380,77 M 315,16 V 77 M 355,77 V92 a 9,7 0 1,0 1,0 M 355,100 a 9,7 0 1,0 1,0Z
        M 355,115 V128 M 356, 129 L 347, 120 M 354, 129 L 363, 120` },
        border: {
          d: ``,
        },
      },
      {
        id: '2',
        name: { text: 'Node 3', x: 142, y: 141.1 },
        number: { text: '204171', x: 415, y: 141.1 },
        area: {
          d: `M 270,139 L 380,139 M 315,78 V 139 M 355,139 V154 a 9,7 0 1,0 1,0 M 355,162 a 9,7 0 1,0 1,0Z
          M 355,177 V190 M 356, 191 L 347, 182 M 354, 191 L 363, 182`,
        },
        border: {
          d: ``,
        },
      },
      {
        id: '3',
        name: { text: 'Node 4', x: 142, y: 203.1 },
        number: { text: '204201', x: 415, y: 203.1 },
        area: {
          d: `M 270,201 L 380,201 M 315,141 V 201 M 355,201 V216 a 9,7 0 1,0 1,0 M 355,224 a 9,7 0 1,0 1,0Z
          M 355,239 V252 M 356, 253 L 347, 243 M 354, 253 L 363, 244` },
        border: {
          d: ``,
        },
      },
      {
        id: '4',
        name: { text: 'Node 5', x: 142, y: 265.1 },
        number: { text: '204216', x: 415, y: 265.1 },
        area: {
          d: `M 270,263 L 380,263 M 315,203 V 263 M 355,263 V278 a 9,7 0 1,0 1,0 M 355,286 a 9,7 0 1,0 1,0Z
          M 355,301 V314 M 356, 315 L 347, 305 M 354, 315 L 363, 306` },
        border: {
          d: ``,
        },
      },
      {
        id: '5',
        name: { text: 'Node 6', x: 142, y: 327.1 },
        number: { text: '204193', x: 415, y: 327.1 },
        area: {
          d: `M 200,325 L 380,325 M 315,265 V 325 M 355,325 V340 a 9,7 0 1,0 1,0 M 355,348 a 9,7 0 1,0 1,0Z
          M 355,363 V376 M 356, 377 L 347, 367 M 354, 377 L 363, 368` },
        border: {
          d: ``,
        },
      },
      {
        id: '6',
        name: { text: 'Node 7', x: 142, y: 389.1 },
        number: { text: '204202', x: 415, y: 389.1 },
        area: {
          d: `M 270,387 L 380,387 M 315,327 V 387 M 355,387 V402 a 9,7 0 1,0 1,0 M 355,410 a 9,7 0 1,0 1,0Z
          M 355,425 V438 M 356, 439 L 347, 429 M 354, 439 L 363, 430 M 285,387 V 417 M 286,417 L 277,408  M 284,417 L 293, 408` },
        border: {
          d: ``,
        },
      },
      {
        id: '7',
        name: { text: 'Node 8', x: 142, y: 451.1 },
        number: { text: '204765', x: 415, y: 451.1 },
        area: {
          d: `M 270,449 L 380,449 M 315,389 V 449 M 355,449 V464 a 9,7 0 1,0 1,0 M 355,472 a 9,7 0 1,0 1,0Z
          M 355,487 V500 M 356, 501 L 347, 491 M 354, 501 L 363, 492` },
        border: {
          d: ``,
        },
      },
    ],
  };

  constructor(private getJWTService: GetJWTService,
    private createDeviceService: CreateDeviceService,
    private getAreaGridsService: GetAreaGridsService,
    private addOutboundConnService: AddOutboundConnService) {
    this.data = {};
    this.selectRoom('2');
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
    this.areaSelected = true;
    this.area = event['name'];
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
      case 'Sim':
        const simData = this.selectedOptions;
        simData['IP'] = this.unitIP;
        simData['Port'] = this.unitPort;
        simData['Topic'] = this.unitName;
        metadata = JSON.stringify(simData);
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
        this.addOutboundConnService.addOutBoundConnector(
          {
            'ip': this.unitIP,
            'port': this.unitPort,
            'token': this.unitName,
          },
          this.jwtToken)
          .then(results => {
            // console.log(results);
          });
      });
  }

  private sortRooms() {
    this.sortedRooms = this.roomSvg.rooms.slice(0).sort((a, b) => {
      if (a.id === this.selectedRoom) {
        return 1;
      }
      if (b.id === this.selectedRoom) {
        return -1;
      }
      return 0;
    });
  }

  selectRoom(roomNumber) {
    this.select.emit(roomNumber);
    this.selectedRoom = roomNumber;
    this.sortRooms();
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
