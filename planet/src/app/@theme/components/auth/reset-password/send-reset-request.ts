import { Component, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EnvService } from '../../../../env.service';

@Component({
    selector: 'ngx-send-reset-req',
    template: '',
})

export class NgxSendResetRequestComponent implements OnChanges {
    @Input() password;
    @Output() message: EventEmitter<Object>;

    finalParameters = [{ isAdmin: false }];

    headers = {
        Accept: 'application/json',
    };

    constructor(private httpClient: HttpClient, protected router: Router,
        private env: EnvService) {
        this.message = new EventEmitter<Object>();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.resetPassword();
    }

    resetPassword() {
        // console.log('HERE', this.isAdmin)
        this.finalParameters = { ...this.password };
        // this.finalParameters.push({ isAdmin: this.isAdmin })
        this.httpClient.post('http://' + this.env.planet + ':' + this.env.planetRESTPort + '/reset',
            {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                },
                password: this.finalParameters['model'],
                token: this.router.url.replace('/auth/reset-password/', ''),
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