import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ngx-input-field',
    styleUrls: ['./tech-input-field.component.scss'],
    templateUrl: './tech-input-field.component.html',
})
export class TechInputFieldComponent {

    @Input() isChecked;
    @Input() label1;
    @Input() label2;
    @Input() compId;
    @Input() isReadOnly;
    @Input() val: Number;
    @Input() type: string;
    @Input() columnLength1: string = 'col-sm-2';
    @Input() columnLength2: string = 'col-sm-1';
    @Input() inputType: string;
    @Output() valChange: EventEmitter<Number>;
    @Output() stringValChange: EventEmitter<string>;
    @Input() inputHtmlLabel1: string;
    @Input() inputHtmlLabel2: string;

    constructor() {
        this.val = 0;
        this.valChange = new EventEmitter<Number>();
        this.stringValChange = new EventEmitter<string>();
        this.type = 'Number';
        this.inputType = 'text';
    }

    onChange(event) {
        if (this.type === 'string') {
            const value = event.target.value.toString();
            this.stringValChange.emit(value);
        } else {
            this.val = +event.target.value;
            this.valChange.emit(this.val);
        }
    }


}
