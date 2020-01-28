import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class CheckBoxesService {

    checkboxesUpdated = new Subject<Object>();

    checkboxes = [];

    constructor() { }

    addCheckBox(id: string) {
        // Check if the ID exists in the checkbox array
        const idExist = this.checkboxes.find(row => {
            if (id === row['id']) {
                return row;
            }
        });

        // If the ID does not exist in the checkbox array then add it
        if (idExist === undefined) {
            this.checkboxes.push({
                id: id,
                value: false,
            });
        }
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
            // Iterate through each checkbox
            for (let i = 0; i < this.checkboxes.length; i++) {
                // If the checkbox has the given id then update its value
                if (id === this.checkboxes[i]['id']) {
                    this.checkboxes[i]['value'] = value;
                }
            }
        }
        this.checkboxesUpdated.next(this.checkboxes);

    }

}
