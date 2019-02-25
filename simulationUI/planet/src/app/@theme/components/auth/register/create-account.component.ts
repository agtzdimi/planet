import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'ngx-create-acc',
    template: '',
})

export class NgxCreateAccountComponent implements OnChanges {
    @Input() params;
    @Input() isAdmin;

    finalParameters = [{ isAdmin: false }];

    API_KEY = '__api_key__';

    headers = {
        Accept: 'application/json',
        Authorization: this.API_KEY,
    };

    constructor(private httpClient: HttpClient) {

    }

    ngOnChanges(changes: SimpleChanges) {
        this.registerUser();
    }

    registerUser() {
        // console.log('HERE', this.isAdmin)
        this.finalParameters = { ...this.params, 'isAdmin': this.isAdmin };
        // this.finalParameters.push({ isAdmin: this.isAdmin })
        // console.log('HERE', this.finalParameters)
        this.httpClient.post('http://80.106.151.108:8000/create_user',
            {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.finalParameters),
            })
            .subscribe(
                data => {
                    // console.log('Post Request is successful ');
                },
                error => {
                    // console.log('Error', error);
                },
            );
    }
}
