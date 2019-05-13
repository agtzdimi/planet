import { Injectable, EventEmitter, Input } from '@angular/core';
import { UploaderOptions } from 'ngx-uploader';
import { NbCalendarRange } from '@nebular/theme';

@Injectable()
export class GeneralParamsService {

    @Input() isLoadModule: boolean;
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
    selectedModel: Object = {};
    model: number;
    loadRangeDate: NbCalendarRange<Date>;

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
    updateIsDefault = new EventEmitter<boolean>();
    selectedModelUpdate = new EventEmitter<Object>();
    modelUpdate = new EventEmitter<number>();
    loadRangeDateUpdate = new EventEmitter<NbCalendarRange<Date>>();


    constructor() {
        this.options = {
            concurrency: 1,
            maxUploads: Number.MAX_SAFE_INTEGER,
        };
        this.files = [];
        this.formName = '';
        this.formDescription = '';
        this.timeStep = {
            'mins': false,
            'hours': true,
        };
        this.simulationTime = {
            'days': false,
            'hours': true,
        };
        this.startingDate = new Date(2016, 1, 1);
        this.endingDate = new Date(2016, 12, 31);
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

    updateShowMap(flag: boolean) {
        setTimeout(() => {
            this.showMap = flag;
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
