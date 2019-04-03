import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EnvService {

  public planet = 'NoIP';

  // Whether or not to enable debug mode
  public enableDebug = true;

  constructor() { }
}
