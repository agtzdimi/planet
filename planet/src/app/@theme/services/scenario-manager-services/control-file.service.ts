import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ControlFileService {

    controlFileUpdated = new Subject<Object>();

    controlSystem = {
        'file.name': 'Control_initialization',
        'payload': {
            'control': 5,
            'RES.curtailment': 0,
        },
    };

    constructor() { }

    updateDefaultValues(flag) {
        if (flag) {
            this.controlSystem['payload']['control'] = 5;
            this.controlSystem['payload']['RES.curtailment'] = 0;
        } else {
            this.controlSystem['payload']['control'] = 5;
            this.controlSystem['payload']['RES.curtailment'] = 0;
        }
        this.controlFileUpdated.next(this.controlSystem);
    }

    changeModel(newModel) {
        this.controlSystem = newModel;
    }

}
