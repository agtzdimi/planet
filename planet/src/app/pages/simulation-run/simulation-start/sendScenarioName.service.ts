import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class SendScenarioService {
    formName: string = '';
    formNameUpdated = new EventEmitter<string>();

    constructor() {
    }

    updateFormName(newName: string) {
        this.formName = newName;
        this.formNameUpdated.emit(this.formName);
    }

}
