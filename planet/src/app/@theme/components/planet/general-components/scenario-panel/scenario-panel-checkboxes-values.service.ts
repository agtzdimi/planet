import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class CheckBoxesService {

    checkboxesUpdated = new Subject<Object>();

    checkboxes = [];

    constructor() { }

    addCheckBox(id: string) {
        this.checkboxes.push({
            id: id,
            value: false,
        });
    }

    initializeService() {
        // this.checkboxes = [];
        this.checkboxesUpdated = new Subject<Object>();
    }

    changeCheckBoxValue(simulationType, id, value) {
        if (simulationType === 'single') {
            for (let i = 0; i < this.checkboxes.length; i++) {
                if (this.checkboxes[i]['value'] && id !== this.checkboxes[i]['id']) {
                    this.checkboxes[i]['value'] = false;
                } else if (id === this.checkboxes[i]['id']) {
                    this.checkboxes[i]['value'] = value;
                }
            }
        } else {
            this.checkboxes[id - 1]['value'] = value;
        }
        this.checkboxesUpdated.next(this.checkboxes);

    }

}
