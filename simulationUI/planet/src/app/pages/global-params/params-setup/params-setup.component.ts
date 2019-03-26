import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import ipJson from '../../../../../public/planetParams/planet_IPs.json';

@Component({
  selector: 'ngx-params-setup',
  styleUrls: ['./params-setup.component.scss'],
  templateUrl: './params-setup.component.html',
})
export class ParamsSetupComponent {

  sitewhereIP = '';
  planetIP = '';
  saveMessage = '';
  loading = false;

  constructor(private httpClient: HttpClient) {
    this.sitewhereIP = ipJson['sitewhere'];
    this.planetIP = ipJson['planet'];
  }

  startUpload() {
    this.loading = true;
    const url = 'http://' + this.planetIP + ':8000/update_IPs';
    this.httpClient.post(url, {
      "planet": this.planetIP,
      "sitewhere": this.sitewhereIP,
    })
      .subscribe(res => {
        this.saveMessage = res['text'];
      })
    this.loading = false;
  }

}
