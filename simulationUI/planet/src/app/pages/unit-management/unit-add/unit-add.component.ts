import { Component } from '@angular/core';
import { GetJWTService } from '../services/get-jwt.service';
import { CreateDeviceTypeService } from '../services/create-device-type.service';

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'ngx-unit-add',
  styleUrls: ['./unit-add.component.scss'],
  providers: [GetJWTService, CreateDeviceTypeService],
  templateUrl: './unit-add.component.html',
})
export class UnitAddComponent {
  data: Object;
  unitName: string;
  unitDescr: string;
  selectedFile: ImageSnippet;
  checkImage = false;
  jwtToken: any;

  constructor(private getJWTService: GetJWTService, private createDeviceTypeService: CreateDeviceTypeService) {
    this.data = {};
  }

  handleClick() {
    this.getJWTService.getToken()
      .then((data: any) => {
        this.jwtToken = data;
        this.data = {
          'containerPolicy': 'Standalone',
          'description': this.unitDescr,
          'deviceElementSchema': {
            'deviceSlots': [
            ],
            'deviceUnits': [
            ],
          },
          'imageUrl': this.selectedFile.src,
          'metadata': {
            'manufacturer': 'test',
          },
          'name': this.unitName,
          'token': 'testToken',
        };

        this.createDeviceTypeService.createNewDeviceType(this.data, this.jwtToken);
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
