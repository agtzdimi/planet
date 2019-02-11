import { Component, EventEmitter, AfterViewInit } from '@angular/core';
import { UploadOutput, UploadInput, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { HttpClient } from '@angular/common/http';
import { TransitionController, Transition, TransitionDirection } from 'ng2-semantic-ui';
import { NbDialogService } from '@nebular/theme';
import { DialogNamePromptComponent } from '../dialog-prompt/dialog-prompt.component';
import { DialogTechParamPromptComponent } from '../dialog-prompt/tech-param-dialog.component';
import { DialogControlSystemPromptComponent } from '../dialog-prompt/control-system-dialog.component';
import { DialogEconomyPromptComponent } from '../dialog-prompt/economy-dialog.component';

@Component({
    selector: 'ngx-new-simulation',
    styleUrls: ['./new-simulation.component.scss'],
    templateUrl: './new-simulation.component.html',
})
export class NewSimulationFilesComponent implements AfterViewInit {

    options: UploaderOptions;
    formName: String;
    formDescription: String;
    errorMessage: String = '';
    formData: FormData;
    files: File[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;
    fileName: string[] = [];
    text: any;
    showMap = false;
    coordinates: number[] = [7.6825, 45.0678];
    capacity = 1;
    systemLoss = 10;
    isDefault: boolean = false;
    areaPicked: boolean = false;
    phase2: boolean = false;
    phase3: boolean = false;
    phase4: boolean = false;
    phase5: boolean = false;
    loading: boolean = false;
    transitionController1 = new TransitionController();
    transitionController2 = new TransitionController();
    transitionController3 = new TransitionController();
    transitionController4 = new TransitionController();
    transitionController5 = new TransitionController();
    transitionController6 = new TransitionController();
    area: string = '';

    public animateImage(transitionName: string = 'scale', event) {
        this.areaPicked = true;
        this.area = event;
        this.transitionController1.animate(
            new Transition(transitionName, 2000, TransitionDirection.In));
        this.dialogService.open(DialogNamePromptComponent)
            .onClose.subscribe(status => {
                this.isDefault = status;
                if (this.isDefault) {
                    this.paramInit['payload']['simulation']['simulation.time'] = 8760;
                }
            });
    }

    public animateInfo(controller, transitionName: string = 'slide down', id) {
        switch (id) {
            case 2:
                this.phase2 = true;
                this.openDialogBox(DialogTechParamPromptComponent);
                break;
            case 3:
                this.phase3 = true;
                this.openDialogBox(DialogControlSystemPromptComponent);
                break;
            case 4:
                this.phase4 = true;
                if (controller === this.transitionController4) {
                    this.openDialogBox(DialogEconomyPromptComponent);
                }
                break;
            case 5:
                this.phase5 = true;
                break;
        }
        controller.animate(
            new Transition(transitionName, 2000, TransitionDirection.In));
    }

    setCoord(event) {
        this.coordinates[0] = event[0];
        this.coordinates[1] = event[1];
    }

    paramInit = {
        'file.name': 'Parameters_initialization',
        'payload': {

            'simulation': {
                'time.step': 1,
                'simulation.time': 0,
            },
            'technologies': {
            },
        },
    };
    controlSystem = {
        'file.name': 'Control_initialization',
        'payload': {
            control: 5,
        },
    };

    econEnv = {
        'file.name': '',
        'payload': {
            'technologies.cost': {
            },
        },
    };

    windParam = {
        'file.name': 'Wind.xlsx',
        'payload': {
            'lat': this.coordinates[1],
            'lon': this.coordinates[0],
        },
    };

    pvParam = {
        'file.name': 'PV.xlsx',
        'payload': {
            'lat': this.coordinates[1],
            'lon': this.coordinates[0],
        },
    };

    revealed = false;

    constructor(private httpClient: HttpClient, private dialogService: NbDialogService) {
        for (let i = 0; i < 7; i++) {
            this.fileName.push('Upload File');
        }
        this.options = { concurrency: 1, maxUploads: Number.MAX_SAFE_INTEGER };
        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
        this.formName = '';
        this.formDescription = '';
    }

    updateFilename(id, output) {
        this.fileName[id] = output.file.name;
    }

    onUploadOutput(output: UploadOutput, id): void {

        switch (output.type) {
            case 'rejected':
                if (typeof output.file !== 'undefined') {
                    this.files = [];
                    this.files.push(output.file.nativeFile);
                    this.updateFilename(id, output);
                }
                break;
            case 'addedToQueue':
                if (typeof output.file !== 'undefined') {
                    this.files.push(output.file.nativeFile);
                    this.updateFilename(id, output);
                }
                break;
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.showMap = !this.showMap;
        }, 500);
    }

    startUpload(): void {
        this.loading = true;
        const formData: FormData = new FormData();

        for (let i = 0; i < this.files.length; i++) {
            const file: File = this.files[i];
            formData.append('file', file, file.name);
        }
        formData.append('method', 'POST');
        this.paramInit['payload']['formName'] = this.formName;
        this.paramInit['payload']['formDescription'] = this.formDescription;
        this.controlSystem['payload']['formName'] = this.formName;
        this.controlSystem['payload']['formDescription'] = this.formDescription;
        this.econEnv['payload']['formName'] = this.formName;
        this.econEnv['payload']['formDescription'] = this.formDescription;
        formData.append('param1', JSON.stringify(this.paramInit));
        formData.append('param2', JSON.stringify(this.controlSystem));
        formData.append('param3', JSON.stringify(this.econEnv));
        this.httpClient.post('http://2.85.194.101:8000/upload', formData,
        )
            .subscribe(
                () => {
                    this.windParam['payload']['formName'] = this.formName;
                    this.windParam['payload']['formDescription'] = this.formDescription;
                    this.pvParam['payload']['formName'] = this.formName;
                    this.pvParam['payload']['formDescription'] = this.formDescription;
                    this.httpClient.post('http://2.85.194.101:8000/save_data', {
                        'windPayload': JSON.stringify(this.windParam),
                        'pvPayload': JSON.stringify(this.pvParam),
                    },
                    )
                        .subscribe(
                            data => {
                                this.loading = false;
                            },
                            error => {
                                // console.log('Error', error);
                                this.loading = false;
                            },
                        );
                },
                error => {
                    // console.log('Error', error);
                    this.loading = false;
                },
            );
    }

    getFileName(id) {
        return this.fileName[id];
    }

    openDialogBox(component) {
        this.dialogService.open(component)
            .onClose.subscribe();
    }

    handleDescriptionChange(event) {
        this.formDescription = event.target.value;
    }

    checkDefaultData() {
        if (this.formDescription === '' || this.formName === '') {
            this.errorMessage = 'Please fill in the Simulation Name and Description';
            return false;
        } else if (this.getFileName(0) !== 'Electricity.xlsx') {
            this.errorMessage = 'Please upload Electricity.xlsx';
            return false;
        } else if (this.getFileName(1) !== 'Heat.xlsx') {
            this.errorMessage = 'Please upload Heat.xlsx';
            return false;
        } else if (!Number(+this.paramInit['payload']['simulation']['time.step'])) {
            this.errorMessage = 'Please give a number for time.step';
            return false;
        } else if (!Number(+this.paramInit['payload']['simulation']['simulation.time'])) {
            this.errorMessage = 'Please give a number for time.step';
            return false;
        } else {
            return true;
        }

    }
}