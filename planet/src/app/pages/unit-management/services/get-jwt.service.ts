import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import ipJson from '../../../../assets/data//planet_IPs.json';

@Injectable()
export class GetJWTService {
    message: string = '';

    constructor(private httpClient: HttpClient) { }


    public getToken(): Promise<any> {
        const token = btoa('admin:password');
        const url = 'http://' + ipJson['sitewhere'] + ':8080/sitewhere/authapi/jwt';
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


