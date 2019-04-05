import { Injectable, EventEmitter } from '@angular/core';
import { UploaderOptions } from 'ngx-uploader';

@Injectable()
export class GeneralParamsService {

    formName: string;
    formDescription: string;
    areaPicked: boolean = false;
    timeStep: Object;
    dateRangeClicked: boolean = false;
    simulationTime: Object;
    options: UploaderOptions;
    errorMessage: String = '';
    gridImage: string;
    showMap = false;
    coordinates: number[] = [7.6825, 45.0678];
    files: File[];
    startingDate: Date;
    endingDate: Date;
    isDefault: boolean = false;

    formNameUpdated = new EventEmitter<string>();
    formDescriptionUpdated = new EventEmitter<string>();
    areaPickedUpdate = new EventEmitter<boolean>();
    timeStepUpdate = new EventEmitter<Object>();
    dateRangeUpdate = new EventEmitter<boolean>();
    simulationTimeUpdate = new EventEmitter<Object>();
    errorMessageUpdate = new EventEmitter<String>();
    gridImageUpdate = new EventEmitter<string>();
    showMapUpdate = new EventEmitter<boolean>();
    filesUpdate = new EventEmitter<File[]>();
    startingDateUpdate = new EventEmitter<Date>();
    endingDateUpdate = new EventEmitter<Date>();

    constructor() {
        this.options = {
            concurrency: 1,
            maxUploads: Number.MAX_SAFE_INTEGER,
        };
        this.files = [];
        this.formName = '';
        this.formDescription = '';
        this.timeStep = {
            'mins': true,
            'hours': false,
        };
        this.simulationTime = {
            'days': true,
            'hours': false,
        };
        this.startingDate = new Date(2016, 1, 1);
        this.endingDate = new Date(2016, 12, 31);
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

    updateTimestep(timeStep: Object) {
        this.timeStep = timeStep;
        this.timeStepUpdate.emit(this.timeStep);
    }

    updateDateRange(dateRange: boolean) {
        this.dateRangeClicked = dateRange;
        this.dateRangeUpdate.emit(this.dateRangeClicked);
    }

    updateSimulationTime(simulationTime: Object) {
        this.simulationTime = simulationTime;
        this.simulationTimeUpdate.emit(this.simulationTime);
    }

    updateErrorMessage(errorMessage: String) {
        this.errorMessage = errorMessage;
        this.errorMessageUpdate.emit(this.errorMessage);
    }

    updateGridImage(gridImage: string) {
        this.gridImage = gridImage;
        this.gridImageUpdate.emit(this.gridImage);
    }

    updateShowMap() {
        setTimeout(() => {
            this.showMap = !this.showMap;
            this.showMapUpdate.emit(this.showMap);
        }, 500);
    }

    updateFiles(files) {
        this.files = files;
        this.filesUpdate.emit(this.files);
    }

    updateStartDate(startDate: Date) {
        this.startingDate = startDate;
        this.startingDateUpdate.emit(this.startingDate);
    }

    updateendDate(endDate: Date) {
        this.endingDate = endDate;
        this.endingDateUpdate.emit(this.endingDate);
    }

}
