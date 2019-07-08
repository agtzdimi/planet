import { Component, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'ngx-create-acc',
    template: '',
})

export class NgxCreateAccountComponent implements OnChanges {
    @Input() params;
    @Input() isAdmin;
    @Output() message: EventEmitter<Object>;

    finalParameters = [{ isAdmin: false }];

    headers = {
        Accept: 'application/json',
    };

    constructor(private httpClient: HttpClient, protected router: Router) {
        this.message = new EventEmitter<Object>();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.registerUser();
    }

    registerUser() {
        // console.log('HERE', this.isAdmin)
        this.finalParameters = { ...this.params, isAdmin: this.isAdmin };
        // this.finalParameters.push({ isAdmin: this.isAdmin })
        this.httpClient.post('/planet/rest/create_user',
            {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                },
                parameters: this.finalParameters,
            })
            .subscribe(
                data => {
                    this.message.emit(data);
                    setTimeout(() => {
                        return this.router.navigateByUrl('/auth/login');
                    }, 1500);
                },
                error => {
                    this.message.emit(error);
                },
            );
    }
}
