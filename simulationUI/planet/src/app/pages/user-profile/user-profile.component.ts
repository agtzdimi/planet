import { Component, OnInit, HostListener } from '@angular/core';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { UserProfileService } from './user-profile.service';

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'ngx-user-profile',
  templateUrl: './user-profile.component.html',
  providers: [UserProfileService],
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {

  user: Object;
  selectedFile: ImageSnippet;
  checkImage = false;

  @HostListener('document:ImageEvent', ['$event.detail.image', '$event.detail.token'])
  updateImage(event) {
    this.user['image'] = event;
  }

  constructor(private authService: NbAuthService, private userProfileService: UserProfileService) {
    this.user = {};
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user['name'] = token['payload']['fullName'];
          this.user['email'] = token['payload']['email'];
          this.user['image'] = token['payload']['image'];
        }

      });
  }

  ngOnInit() {
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.checkImage = true;

      this.selectedFile.pending = true;
      const formData = new FormData();
      formData.append('image', this.selectedFile.file);
    });

    reader.readAsDataURL(file);
  }

  updateUserInfo() {
    this.userProfileService.uploadImage(this.selectedFile.src, this.user['email'], this.user['name']);
  }

}
