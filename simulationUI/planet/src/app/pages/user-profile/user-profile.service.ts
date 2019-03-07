import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UserProfileService {
    message: string = '';

    constructor(private httpClient: HttpClient) { }


    public uploadImage(image, email): Promise<any> {
        return new Promise(resolve => {
            this.httpClient.post<HttpResponse<Object>>('http://160.40.49.244:8000/update_user', {
                image: image,
                email: email,
            })
                .subscribe(
                    data => {
                        // console.log(data)
                    },
                    error => {
                        // console.log(error)
                    },
                );
        });
    }
}


