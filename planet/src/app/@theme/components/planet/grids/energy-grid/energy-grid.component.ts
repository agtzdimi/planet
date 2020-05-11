import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TechnologiesDialogComponent } from './energy-grid.tech.component';

@Component({
  selector: 'ngx-energy-grid',
  templateUrl: './energy-grid.component.html',
  styleUrls: ['./energy-grid.component.scss'],
})
export class EnergyGridComponent implements OnChanges {

  @Input() gasNodes: number;
  @Input() dhNodes: number;
  @Input() elecNodes: number;
  @Input() paramInit: any;
  show = false;
  items;
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
        name: { text: '', x: -50, y: 4.1 },
        number: {
          text: 'Gas', x: 147, y: 422,
          text2: 'Network', x2: 147, y2: 444,
        },
        area: {
          d: `M 150,0 V400`,
        },
        border: {
          d: ``,
        },
      },
      {
        id: '1',
        name: { text: '', x: -50, y: 4.1 },
        number: {
          text: 'DH', x: 297, y: 422,
          text2: 'Network', x2: 297, y2: 444,
        },
        area: {
          d: `M 300,0 V400`,
        },
        border: {
          d: ``,
        },
      },
      {
        id: '2',
        name: { text: '', x: -50, y: 4.1 },
        number: {
          text: 'Electrical', x: 447, y: 422,
          text2: 'Grid', x2: 447, y2: 444,
        },
        area: {
          d: `M 450,0 V400`,
        },
        border: {
          d: ``,
        },
      },
    ],
  };

  constructor(private dialogService: NbDialogService) {

  }

  ngOnChanges(changes: SimpleChanges) {
    this.items = [
      { title: 'Profile' },
      { title: 'Logout' },
    ];
    this.show = false;
    this.generateNodes();
    this.selectRoom('3');
  }

  generateNodes() {
    this.createNode(this.gasNodes, 150);
    this.createNode(this.dhNodes, 300);
    this.createNode(this.elecNodes, 450);
  }

  createNode(nodesLength, xAxis) {
    let tempNode;
    for (let node = 0; node < nodesLength; node++) {
      tempNode = {
        id: (this.roomSvg.rooms.length),
        name: { text: '', x: -50, y: 4.1 },
        number: {
          text: (node + 1), x: xAxis, y: ((400 / (nodesLength + 1)) * (node + 1) + 5),
        },
        area: {
          d: `M` + xAxis + `,` + ((400 / (nodesLength + 1)) * (node + 1)) + `
          m -15, 0
          a 15,15 0 1,0 30,0
          a 15,15 0 1,0 -30,0`,
        },
        border: {
          d: ``,
        },
      };
      this.roomSvg.rooms.push(tempNode);
    }
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
    if (typeof (this.roomSvg['rooms'][roomNumber]['number']['text']) === 'number') {
      this.selectedRoom = roomNumber;
      if (this.show) {
        this.open(false);
      }
      this.show = true;
      this.sortRooms();
    }
  }

  checkNode(node) {
    if (typeof (node) === 'number') {
      return 4;
    } else if (node === 'Gas') {
      return 1;
    } else if (node === 'DH') {
      return 2;
    } else if (node === 'Electrical') {
      return 3;
    }
  }

  protected open(hasBackdrop: boolean) {
    let type: string;
    const number: number = this.selectedRoom;
    if (this.roomSvg['rooms'][number]['number']['x'] === 150) {
      type = 'Gas';
    } else if (this.roomSvg['rooms'][number]['number']['x'] === 300) {
      type = 'DH';
    } else {
      type = 'Electrical';
    }

    type = type + ' Node ' + this.roomSvg['rooms'][number]['number']['text'];
    this.dialogService.open(TechnologiesDialogComponent, { hasBackdrop, 'context': type });
  }

}
