import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class GetJWTService {
    message: string = '';

    constructor(private httpClient: HttpClient) { }


    public getToken(): Promise<any> {
        const token = btoa('admin:password');
        return new Promise(resolve => {
            this.httpClient.get<HttpResponse<Object>>('http://130.192.180.234:8080/sitewhere/authapi/jwt', {
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


