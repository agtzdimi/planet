import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';

@Injectable()
export class UserProfileService {
    private email: string = '';
    private name: string = '';

    constructor(private httpClient: HttpClient, private authService: NbAuthService) {

        this.authService.onTokenChange()
            .subscribe((token: NbAuthJWTToken) => {
                if (token.isValid()) {
                    this.email = token['payload']['email'];
                    this.name = token['payload']['fullName'];
                }
            });
    }

    public uploadImage(image, email, name): Promise<any> {
        return new Promise(() => {
            const url = '/planet/rest/update_user';
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

    public getEmail(): string {
        return this.email;
    }

    public getName(): string {
        return this.name;
    }
}


