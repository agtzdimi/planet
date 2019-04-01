import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import ipJson from '../../../../assets/data/planet_IPs.json';

@Component({
  selector: 'ngx-params-setup',
  styleUrls: ['./params-setup.component.scss'],
  templateUrl: './params-setup.component.html',
})
export class ParamsSetupComponent {

  sitewhereIP = '';
  sitewhereUIPort = 0;
  sitewhereMQTTPort = 0;
  saveMessage = '';
  planetRestPort = 0;
  planetUISSHPort = 0;
  planetUISSHPass = '';
  planetUISSHUser = '';
  planetUISSHIP = '';
  planetRestIP = '';
  loading = false;

  constructor(private httpClient: HttpClient) {
    this.httpClient.get('assets/data/planet_IPs.json', {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      }),
    })
      .subscribe(res => {
        // console.log(res)
      });
    this.sitewhereIP = ipJson['sitewhere'];
    this.planetRestIP = ipJson['planet'];
    this.planetRestPort = ipJson['planetRESTPort'];
    this.planetUISSHIP = ipJson['planetSSHIP'];
    this.planetUISSHPass = ipJson['planetSSHPass'];
    this.planetUISSHPort = ipJson['planetSSHPort'];
    this.sitewhereUIPort = ipJson['sitewhereUIPort'];
    this.sitewhereMQTTPort = ipJson['sitewhereMQTTPort'];
    this.planetUISSHUser = ipJson['planetSSHUser'];
  }

  startUpload() {
    this.loading = true;
    const url = 'http://' + this.planetRestIP + ':8000/update_IPs';
    this.httpClient.post(url, {
      'planet': this.planetRestIP,
      'sitewhere': this.sitewhereIP,
      'planetRESTPort': this.planetRestPort,
      'sitewhereUIPort': this.sitewhereUIPort,
      'sitewhereMQTTPort': this.sitewhereMQTTPort,
      'planetSSHIP': this.planetUISSHIP,
      'planetSSHUser': this.planetUISSHUser,
      'planetSSHPass': this.planetUISSHPass,
      'planetSSHPort': this.planetUISSHPort,
    })
      .subscribe(res => {
        this.saveMessage = res['text'];
      });
    this.loading = false;
  }

}
