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
    @Input() val;
    @Output() valChange: EventEmitter<String>;

    constructor() {
        this.val = 0;
        this.valChange = new EventEmitter<String>();
    }

    onChange(event) {
        this.val = event.target.value;
        this.valChange.emit(this.val);
    }


}
