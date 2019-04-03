import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../../env.service';

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

  constructor(private httpClient: HttpClient,
    env: EnvService) {
    this.sitewhereIP = env.sitewhere;
    this.planetRestIP = env.planet;
    this.planetRestPort = env.planetRESTPort;
    this.planetUISSHIP = env.planetSSHIP;
    this.planetUISSHPass = env.planetSSHPass;
    this.planetUISSHPort = env.planetSSHPort;
    this.sitewhereUIPort = env.sitewhereUIPort;
    this.sitewhereMQTTPort = env.sitewhereMQTTPort;
    this.planetUISSHUser = env.planetSSHUser;
  }

  startUpload() {
    this.loading = true;
    const url = 'http://' + this.planetRestIP + ':' + this.planetRestPort + '/update_IPs';
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
