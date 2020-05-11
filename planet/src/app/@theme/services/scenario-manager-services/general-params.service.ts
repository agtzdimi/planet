import { Injectable, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class GeneralParamsService {

    @Input() isLoadModule: boolean;
    parameters: Object = <Object>{};
    parametersSubject = new Subject<Object>();

    constructor() {
        this.parameters = {
            formName: '',
            formDescription: '',
            areaPicked: false,
            dateRangeClicked: false,
            errorMessage: '',
            gridImage: '',
            showMap: false,
            coordinates: [7.6825, 45.0678],
            startingDate: new Date(2016, 0, 1),
            endingDate: new Date(2016, 11, 31),
            isDefault: false,
            selectedModel: {
                'elec': '',
                'dh': '',
                'gas': '',
            },
            model: '',
            loadRangeDate: '',
        };
    }

    updateGeneralParameters(newValue: any, attribute: string) {
        this.parameters[attribute] = newValue;
        this.parametersSubject.next(this.parameters);
    }

}
