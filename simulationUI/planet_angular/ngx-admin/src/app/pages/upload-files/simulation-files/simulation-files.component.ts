import { Component, EventEmitter } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';

@Component({
    selector: 'ngx-simulation-files',
    styleUrls: ['./simulation-files.component.scss'],
    templateUrl: './simulation-files.component.html',
})
export class UploadSimulationFilesComponent {

    options: UploaderOptions;
    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;
    fileName: string[] = []
    text: any;
    paramInit: Object = {
        'file.name': '',
        'payload': {

            'simulation': {
                'time.step': '',
                'simulation.time': '',
            },
        },
    };
    controlSystem: Object = {
        'payload': {
            control: '',
        },
    };

    econEnv: Object = {
        'payload': {
            "NG.cost": "",
            "SNG.cost": "",
            "heat.cost": "",
            "carbon.tax": "",
            "NG.emission.factor": "",
        },
    }
    revealed = false;

    constructor() {
        for (let i = 0; i < 7; i++) {
            this.fileName.push("Upload File")
        }
        this.options = { concurrency: 1, maxUploads: 1 };
        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
    }

    updateFilename(id, output) {

        const fileReader = new FileReader();
        fileReader.onload = () => {
            const text = fileReader.result as string;
            this.text = JSON.parse(text);
            switch (this.text['file.name']) {
                case 'Parameters_initialization':
                    this.paramInit = this.text;
                    break;
                case 'Control_initialization':
                    this.controlSystem = this.text;
                    break;
                case 'Economy_environment_initialization':
                    this.econEnv = this.text;
                    break;
            }
        };
        fileReader.readAsText(output.file.nativeFile);
        this.fileName[id] = output.file.name;
    }

    onUploadOutput(output: UploadOutput, id): void {
        switch (output.type) {
            case 'rejected':
                if (typeof output.file !== 'undefined') {
                    this.files = [];
                    this.files.push(output.file);
                    this.updateFilename(id, output);
                }
                break;
            case 'addedToQueue':
                if (typeof output.file !== 'undefined') {
                    this.files.push(output.file);
                    this.updateFilename(id, output);
                }
                break;
            case 'uploading':
                if (typeof output.file !== 'undefined') {
                    // update current data in files array for uploading file
                    const index = this.files.findIndex(
                        (file) => typeof output.file !== 'undefined' && file.id === output.file.id);
                    this.files[index] = output.file;
                }
                break;
            case 'removed':
                // remove file from array when removed
                this.files = this.files.filter((file: UploadFile) => file !== output.file);
                break;
            case 'dragOver':
                this.dragOver = true;
                break;
            case 'dragOut':
            case 'drop':
                this.dragOver = false;
                break;
            case 'done':
                // The file is downloaded
                break;
        }
    }

    startUpload(): void {
        const event: UploadInput = {
            type: 'uploadAll',
            url: 'http://localhost:8000/upload',
            method: 'POST',
            data: {
                param1: JSON.stringify(this.paramInit),
                param2: JSON.stringify(this.controlSystem),
                param3: JSON.stringify(this.econEnv)
            },
        };

        this.uploadInput.emit(event);
    }

    cancelUpload(id: string): void {
        this.uploadInput.emit({ type: 'cancel', id: id });
    }

    removeFile(id: string): void {
        this.uploadInput.emit({ type: 'remove', id: id });
    }

    removeAllFiles(): void {
        this.uploadInput.emit({ type: 'removeAll' });
    }

    getFileName(id) {
        return this.fileName[id];
    }
}
