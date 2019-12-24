import { Injectable } from '@angular/core';

@Injectable()
export class GridCoordinatesService {

    private gridCoordinates = [
        { name: 'Node 1', x: 9,  y: 40 },
        { name: 'Node 2', x: 9,  y: 42 },
        { name: 'Node 3', x: 7,  y: 44 },
        { name: 'Node 4', x: 11, y: 44 },
        { name: 'Node 5', x: 5,  y: 46 },
        { name: 'Node 6', x: 7,  y: 48 },
        { name: 'Node 7', x: 9,  y: 48 },
        { name: 'Node 8', x: 15,  y: 46 },
    ];

    private gridLinks = [ 
        { name: 'Node 1', source: 'Node 1', target: 'Node 2' },
        { name: 'Node 2', source: 'Node 2', target: 'Node 3' },
        { name: 'Node 3', source: 'Node 2', target: 'Node 3' },
        { name: 'Node 4', source: 'Node 2', target: 'Node 4' },
        { name: 'Node 5', source: 'Node 3', target: 'Node 5' },
        { name: 'Node 6', source: 'Node 5', target: 'Node 6' },
        { name: 'Node 7', source: 'Node 4', target: 'Node 7' },
        { name: 'Node 8', source: 'Node 4', target: 'Node 8' },
    ];

    private timelineData = [];

    constructor() {        
    }

    getGridCoordinates(){
        return this.gridCoordinates;
    };

    getGridLinks(){
        return this.gridLinks;
    };

    setVoltage(nodesNumber){
      
        for(let node = 0; node < nodesNumber; node++){
           let tempTimelineData = [];
           for(let hour = 0; hour < 24; hour++){
              tempTimelineData.push(
                 {
                    hour: hour + 1,
                    voltage: Math.round(Math.random() * 100 + 1),
                    lineLoad: Math.round(Math.random() * 100 + 1),
                 }
              )
           }
           this.timelineData.push(tempTimelineData);
        }
      };
  
      getVoltage(){
           return this.timelineData;
      };
}
