import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ipJson from '../../../../public/planetParams/planet_IPs.json';

@Injectable()
export class UserProfileService {
    message: string = '';

    constructor(private httpClient: HttpClient) {
    }

    public uploadImage(image, email, name): Promise<any> {
        return new Promise(resolve => {
            const url = 'http://' + ipJson['planet'] + ':8000/update_user';
            this.httpClient.post<HttpResponse<Object>>(url, {
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


