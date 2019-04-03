import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { EnvService } from '../../../env.service';

@Injectable()
export class GetJWTService {
    message: string = '';

    constructor(private httpClient: HttpClient,
        private env: EnvService) { }


    public getToken(): Promise<any> {
        const token = btoa('admin:password');
        const url = 'http://' + this.env.sitewhere + ':' + this.env.sitewhereUIPort + '/sitewhere/authapi/jwt';
        return new Promise(resolve => {
            this.httpClient.get<HttpResponse<Object>>(url, {
                observe: 'response',
                headers: new HttpHeaders({
                    'authorization': 'Basic ' + token,
                }),
            }).pipe(map(data => {
                let jwtToken;
                const keys = data.headers.keys();
                keys.filter(key => {
                    if (key === 'x-sitewhere-jwt') {
                        jwtToken = data.headers.getAll(key);
                    }
                });
                this.message = jwtToken[0];
                resolve(this.message);
            }))
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    error => {
                        resolve(error['error']);
                    },
                );
        });
    }
}


