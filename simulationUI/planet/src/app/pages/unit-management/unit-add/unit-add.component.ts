import { Component } from '@angular/core';
import { GetJWTService } from '../services/get-jwt.service';
import { CreateDeviceService } from '../services/create-device.service';

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'ngx-unit-add',
  styleUrls: ['./unit-add.component.scss'],
  providers: [GetJWTService, CreateDeviceService],
  templateUrl: './unit-add.component.html',
})
export class UnitAddComponent {
  data: Object;
  unitName: string;
  unitDescr: string;
  selectedFile: ImageSnippet;
  checkImage = false;
  jwtToken: any;
  p2gUnit: Object;

  constructor(private getJWTService: GetJWTService, private createDeviceService: CreateDeviceService) {
    this.data = {};
  }

  handleClick() {
    let metadata = JSON.stringify(this.p2gUnit['payload']['parameters']['configuration']);
    metadata = metadata.replace('}{', ',');
    metadata = metadata.replace(/\./g, '_');
    metadata = JSON.parse(metadata);
    this.getJWTService.getToken()
      .then((data: any) => {
        this.jwtToken = data;
        this.data = {
          'comments': this.unitDescr,
          'deviceElementMappings': [
          ],
          'deviceTypeToken': 'p2gToken',
          metadata,
          'parentDeviceToken': 'p2gToken',
          'removeParentHardwareId': true,
          'status': '',
          'token': this.unitName,
        };
        this.createDeviceService.createNewDevice(this.data, this.jwtToken);
      });
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

}
