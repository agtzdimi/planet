import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EnvService {

  public planet = window['__env'].planet;
  public sitewhere = window['__env'].sitewhere;
  public planetRESTPort = window['__env'].planetRESTPort;
  public sitewhereUIPort = window['__env'].sitewhereUIPort;
  public sitewhereMQTTPort = window['__env'].sitewhereMQTTPort;
  public mongoIP = window['__env'].mongoIP;
  public mongoPort = window['__env'].mongoPort;
  public mongoUser = window['__env'].mongoUser;
  public mongoPassword = window['__env'].mongoPassword;
  public mongoAuthDB = window['__env'].mongoAuthDB;
  public simulationMachine = window['__env'].simulationMachine;

  constructor() {
  }
}
