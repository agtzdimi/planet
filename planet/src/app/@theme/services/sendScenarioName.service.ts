import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SendScenarioService {
    formName: string = '';
    formNameUpdated = new Subject<string>();

    constructor() {
    }

    updateFormName(newName: string) {
        this.formName = newName;
        this.formNameUpdated.next(this.formName);
    }

}
