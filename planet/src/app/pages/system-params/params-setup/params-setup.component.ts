import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../../env.service';
import { GetDeviceByTypeService } from '../../../@theme/services/unit-management-services/get-deviceByType.service';

@Component({
  selector: 'ngx-params-setup',
  styleUrls: ['./params-setup.component.scss'],
  templateUrl: './params-setup.component.html',
  providers: [GetDeviceByTypeService],
})
export class ParamsSetupComponent {

  sitewhereIP: string = '';
  sitewhereUIPort: number = 0;
  sitewhereMQTTPort = 0;
  saveMessage: string = '';
  planetRestPort: number = 0;
  planetRestIP: string = '';
  loading = false;
  mongoIP: string;
  mongoPort: number;
  mongoUser: string;
  mongoPassword: string;
  mongoAuthDB: string;
  simulationMachine: string;
  planetUIPort: string;
  simulationMachinePort: number;
  simulationMachineTopic: string;
  loaded = false;
  simUnit = [{}];
  jwtToken: any;

  constructor(private httpClient: HttpClient,
    env: EnvService,
    private getDeviceByType: GetDeviceByTypeService) {
    this.sitewhereIP = env.sitewhere;
    this.planetRestIP = env.planet;
    this.planetRestPort = env.planetRESTPort;
    this.sitewhereUIPort = env.sitewhereUIPort;
    this.sitewhereMQTTPort = env.sitewhereMQTTPort;
    this.mongoIP = env.mongoIP;
    this.mongoPort = env.mongoPort;
    this.mongoUser = env.mongoUser;
    this.mongoPassword = env.mongoPassword;
    this.mongoAuthDB = env.mongoAuthDB;
    this.simulationMachine = env.simulationMachine;
    this.planetUIPort = window.location.port;
    this.simulationMachinePort = env.simulationMachinePort;
    this.simulationMachineTopic = env.simulationMachineTopic;

    this.getDeviceByType.getDeviceByType()
      .then(devices => {
        this.simUnit = devices['results']['resources'].filter((record) => {
          return record['unitType'] === 'Sim';
        });
        this.loaded = true;
      });
  }

  startUpload() {
    this.loading = true;
    const url = '/planet/rest/update_IPs';
    this.httpClient.post(url, {
      'planet': this.planetRestIP,
      'sitewhere': this.sitewhereIP,
      'planetRESTPort': this.planetRestPort,
      'sitewhereUIPort': this.sitewhereUIPort,
      'sitewhereMQTTPort': this.sitewhereMQTTPort,
      'mongoIP': this.mongoIP,
      'mongoPort': this.mongoPort,
      'mongoUser': this.mongoUser,
      'mongoPassword': this.mongoPassword,
      'mongoAuthDB': this.mongoAuthDB,
      'simulationMachine': this.simulationMachine,
      'planetUIPort': this.planetUIPort,
      'simulationMachinePort': this.simulationMachinePort,
      'simulationMachineTopic': this.simulationMachineTopic,
    })
      .subscribe(res => {
        this.saveMessage = res['text'];
      });
    this.loading = false;
  }

  handleUnit(simulator) {
    this.simulationMachine = simulator['metadata']['IP'];
    this.simulationMachinePort = simulator['metadata']['Port'];
    this.simulationMachineTopic = simulator['metadata']['Topic'];
  }

  checkSimulator(simulator) {
    if (simulator['metadata']['Topic'] === this.simulationMachineTopic) {
      return true;
    } else {
      return false;
    }
  }

}
