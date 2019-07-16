import { Injectable, EventEmitter, Input } from '@angular/core';
import { NbCalendarRange } from '@nebular/theme';

@Injectable()
export class GeneralParamsService {

    @Input() isLoadModule: boolean;
    formName: string;
    formDescription: string;
    areaPicked: boolean = false;
    dateRangeClicked: boolean = false;
    errorMessage: String = '';
    gridImage: string;
    showMap = false;
    coordinates: number[] = [7.6825, 45.0678];
    startingDate: Date;
    endingDate: Date;
    isDefault: boolean = false;
    selectedModel: Object = {};
    model: number;
    loadRangeDate: NbCalendarRange<Date>;

    formNameUpdated = new EventEmitter<string>();
    formDescriptionUpdated = new EventEmitter<string>();
    areaPickedUpdate = new EventEmitter<boolean>();
    dateRangeUpdate = new EventEmitter<boolean>();
    errorMessageUpdate = new EventEmitter<String>();
    gridImageUpdate = new EventEmitter<string>();
    showMapUpdate = new EventEmitter<boolean>();
    startingDateUpdate = new EventEmitter<Date>();
    endingDateUpdate = new EventEmitter<Date>();
    updateIsDefault = new EventEmitter<boolean>();
    selectedModelUpdate = new EventEmitter<Object>();
    modelUpdate = new EventEmitter<number>();
    loadRangeDateUpdate = new EventEmitter<NbCalendarRange<Date>>();


    constructor() {
        this.formName = '';
        this.formDescription = '';
        this.startingDate = new Date(2016, 0, 1);
        this.endingDate = new Date(2016, 11, 31);
        this.selectedModel = {
            'elec': '',
            'dh': '',
            'gas': '',
        };
    }

    updateFormName(newName: string) {
        this.formName = newName;
        this.formNameUpdated.emit(this.formName);
    }

    updateFormDescription(newDescription: string) {
        this.formDescription = newDescription;
        this.formDescriptionUpdated.emit(this.formDescription);
    }

    updateAreaPicked(areaCheck: boolean) {
        this.areaPicked = areaCheck;
        this.areaPickedUpdate.emit(this.areaPicked);
    }

    updateDateRange(dateRange: boolean) {
        this.dateRangeClicked = dateRange;
        this.dateRangeUpdate.emit(this.dateRangeClicked);
    }

    updateErrorMessage(errorMessage: String) {
        this.errorMessage = errorMessage;
        this.errorMessageUpdate.emit(this.errorMessage);
    }

    updateGridImage(gridImage: string) {
        this.gridImage = gridImage;
        this.gridImageUpdate.emit(this.gridImage);
    }

    updateShowMap(flag: boolean) {
        setTimeout(() => {
            this.showMap = flag;
            this.showMapUpdate.emit(this.showMap);
        }, 500);
    }

    updateStartDate(startDate: Date) {
        this.startingDate = startDate;
        this.startingDateUpdate.emit(this.startingDate);
    }

    updateEndDate(endDate: Date) {
        this.endingDate = endDate;
        this.endingDateUpdate.emit(this.endingDate);
    }

    isDefaultUpdate(isDef: boolean) {
        this.isDefault = isDef;
        this.updateIsDefault.emit(this.isDefault);
    }

    updateSelectedModel(model: Object) {
        this.selectedModel = model;
        this.selectedModelUpdate.emit(this.selectedModel);
    }

    updateModel(model: number) {
        this.model = model;
        this.modelUpdate.emit(this.model);
    }

    updateLoadRangeDate(range: NbCalendarRange<Date>) {
        this.loadRangeDate = range;
        this.loadRangeDateUpdate.emit(this.loadRangeDate);
    }

}
