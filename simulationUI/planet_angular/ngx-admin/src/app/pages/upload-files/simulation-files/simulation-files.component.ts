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
    fileName1: string = 'Upload Files';
    fileName2: string = 'Upload Files';
    fileName3: string = 'Upload Files';
    text: {};
    jsonText1 = {
        'file.name': '',
        'payload': {

            'simulation': {
                'time.step': '',
                'simulation.time': '',
            },
        },
    };
    jsonText2 = {
        'payload': {
            control: '',
        },
    };
    revealed = false;
    period: string = 'paok';

    constructor() {
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
                    this.jsonText1 = this.text;
                    break;
                case 'Control_initialization':
                    this.jsonText2 = this.text;
                    break;
            }
        };
        fileReader.readAsText(output.file.nativeFile);
        switch (id) {
            case 1:
                this.fileName1 = output.file.name;
                break;
            case 2:
                this.fileName2 = output.file.name;
                break;
            case 3:
                this.fileName3 = output.file.name;
                break;
        }
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
                    const index = this.files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
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
            data: { foo: 'bar' },
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
        switch (id) {
            case 1:
                return this.fileName1;
                break;
            case 2:
                return this.fileName2;
                break;
            case 3:
                return this.fileName3;
                break;
        }
    }
}
