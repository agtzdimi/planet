import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UserProfileService {
    message: string = '';

    constructor(private httpClient: HttpClient) {
    }

    public uploadImage(image, email, name): Promise<any> {
        return new Promise(resolve => {
            this.httpClient.post<HttpResponse<Object>>('http://160.40.49.244:8000/update_user', {
                image: image,
                email: email,
                name: name,
            })
                .subscribe(
                    data => {
                        const event = new CustomEvent(
                            'ImageEvent',
                            { detail: { 'image': data['data']['image'], 'token': data['data']['token'] } });
                        document.dispatchEvent(event);
                    },
                    error => {
                        // console.log(error)
                    },
                );
        });
    }
}


