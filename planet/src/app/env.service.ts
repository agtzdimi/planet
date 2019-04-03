import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EnvService {

  // API url
  public apiUrl = '';
  public planet = '160.40.49.244';
  public sitewhere = '130.192.180.234';
  public planetRESTPort = 8000;
  public sitewhereUIPort = 8080;
  public sitewhereMQTTPort = 1883;
  public planetSSHIP = '192.168.11.128';
  public planetSSHUser = 'planet';
  public planetSSHPass = '7156471564';
  public planetSSHPort = 22;

  // Whether or not to enable debug mode
  public enableDebug = true;

  constructor() { }
}
