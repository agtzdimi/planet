import { Component, EventEmitter } from '@angular/core';
import { UploadOutput, UploadInput, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'ngx-simulation-files',
    styleUrls: ['./simulation-files.component.scss'],
    templateUrl: './simulation-files.component.html',
})
export class UploadSimulationFilesComponent {

    options: UploaderOptions;
    formData: FormData;
    files: File[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;
    fileName: string[] = [];
    text: any;
    paramInit = {
        'file.name': '',
        'payload': {

            'simulation': {
                'time.step': '',
                'simulation.time': '',
            },
        },
    };
    controlSystem = {
        'payload': {
            control: '',
        },
    };

    econEnv = {
        'payload': {
            'NG.cost': '',
            'SNG.cost': '',
            'heat.cost': '',
            'carbon.tax': '',
            'NG.emission.factor': '',
        },
    };
    revealed = false;

    constructor(private httpClient: HttpClient) {
        for (let i = 0; i < 7; i++) {
            this.fileName.push('Upload File');
        }
        this.options = { concurrency: 1, maxUploads: Number.MAX_SAFE_INTEGER };
        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
    }

    updateFilename(id, output) {

        if (!output.file.name.includes('.xlsx')) {
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
        }
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
            case 'uploading':
                break;
            case 'removed':
                // remove file from array when removed
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
        const formData: FormData = new FormData();

        for (let i = 0; i < this.files.length; i++) {
            const file: File = this.files[i];
            formData.append('file', file, file.name);
        }
        formData.append('method', 'POST');
        formData.append('param1', JSON.stringify(this.paramInit));
        formData.append('param2', JSON.stringify(this.controlSystem));
        formData.append('param3', JSON.stringify(this.econEnv));
        this.httpClient.post('http://80.106.151.108:8000/upload', formData,
        )
            .subscribe(
                data => {
                    // console.log('POST Request is successful ', data);
                },
                error => {
                    // console.log('Error', error);
                },
            );
    }

    cancelUpload(id: string): void {
        //  this.uploadInput.emit({ type: 'cancel', id: id });
    }

    removeFile(id: string): void {
        //  this.uploadInput.emit({ type: 'remove', id: id });
    }

    removeAllFiles(): void {
        //  this.uploadInput.emit({ type: 'removeAll' });
    }

    getFileName(id) {
        return this.fileName[id];
    }
}
