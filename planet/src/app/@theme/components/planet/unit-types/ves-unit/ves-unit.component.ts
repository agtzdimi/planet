import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { DialogInfoPromptComponentWithBody } from '../../../../components/planet/dialogs/DialogInfoPromptComponentWithBody';


@Component({
  selector: 'ngx-ves-unit',
  styleUrls: ['./ves-unit.component.scss'],
  templateUrl: './ves-unit.component.html',
})
export class VESUnitComponent implements OnInit, OnChanges {

  vesParams: Object;
  @Input() vesInput: Object;
  @Input() mode: string;
  @Output() ves: EventEmitter<Object>;
  parametersColumnSize = 'col-md-8';
  tbHeadPump: boolean;
  tbNominalPower: boolean;



  constructor(private dialogService: NbDialogService) {
    this.vesParams = {
      'hardwareId': 'VES1',
      'topic': 'VES/1',
      'payload': {
        'simulationID': '',
        'nodeID': '',
        'VESID': '',
        'parameters': {
          'timeStamp': '',
          'vesHorizon': '',
          'timeStep': '',
          'noAssets': 100,
          'assetType': 'residential',
        },
        'optionalParameters': {
          'conductance': 800,
          'capacity': 6000000,
          'hvacCOP': {
            'heat': {
              'a': 0.046,
              'b': 2.906,
            },
            'cool': {
              'a': -0.108,
              'b': 7.107,
            },
          },
          'pMax': 4000,
          'mode': 'HEAT',
        },
        'inputData': {
          'tOutForecast': [13, 13, 13, 13, 13, 13],
          'tInInit': 21.5,
        },
        'optionalInputData': {
          'tInBaseMin': [21, 21, 21, 21, 21, 21],
          'tInBaseMax': [22, 22, 22, 22, 22, 22],
          'tInAltMin': [20, 20, 20, 20, 20, 20],
          'tInAltMax': [23, 23, 23, 23, 23, 23],
        },
      },
      'description': '',
    };
    this.ves = new EventEmitter<Object>();
    this.tbHeadPump = true;
    this.tbNominalPower = false;

  }

      /**
    *
    * Function responsible for Opening a dialog box over the current screen
    * @example
    * openDialogBox(context)
    * context = { context: { title: 'This is a title passed to the dialog component'}}
    *
    * @param {Object} context Object holding the title for the dialog box
    * @returns A dialog box with some information for the user
    */
   private openDialogBox(context: Object): void {
    // Function to open a new dialog box given its corresponding component
    this.dialogService.open(DialogInfoPromptComponentWithBody, context)
        .onClose.subscribe(value => { });
}


  ngOnInit() {
    if (this.mode === 'edit') {
      this.parametersColumnSize = 'col-md-12';
    }
    this.ves.emit(this.vesParams);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['vesInput']['currentValue']['metadata']) {
      const defaultValues = this.changeDotsToUnderScores(changes['vesInput']['currentValue']['metadata']);
      this.vesParams['payload'] = JSON.parse(defaultValues);
      this.vesParams['payload']['parameters']['configuration'] = JSON.parse(defaultValues);
      this.vesParams['description'] = changes['vesInput']['currentValue']['description'];
      this.ves.emit(this.vesParams);
    } else if (changes['vesInput']['currentValue']['parameters']) {
      const defaultValues = this.changeDotsToUnderScores(changes['vesInput']['currentValue']);
      this.vesParams['payload'] = JSON.parse(defaultValues);
      this.ves.emit(this.vesParams);
    }
  }

  changeDotsToUnderScores(vesObject: Object): string {
    let vesObjectValue = JSON.stringify(vesObject).replace('nominal.heat.power', 'nominal_heat_power');
    vesObjectValue = JSON.stringify(vesObject).replace('efficiency.thermal', 'efficiency_thermal');
    return vesObjectValue;
  }

  onChange(attribute, event, attributeType) {
    this.vesParams['payload'][attributeType][attribute] = event;
    if (this.vesParams['payload']['parameters']['configuration']) {
      this.vesParams['payload']['parameters']['configuration']['parameters']['vesHorizon'] = this.vesParams['payload']['parameters']['vesHorizon'];
      this.vesParams['payload']['parameters']['configuration']['parameters']['vesHorizon'] = this.vesParams['payload']['parameters']['vesHorizon'];
      this.vesParams['payload']['parameters']['configuration']['parameters']['assetType'] = this.vesParams['payload']['parameters']['assetType'];
      this.vesParams['payload']['parameters']['configuration']['optionalParameters'] = this.vesParams['payload']['optionalParameters'];
      this.vesParams['payload']['parameters']['configuration']['inputData'] = this.vesParams['payload']['inputData'];
      this.vesParams['payload']['parameters']['configuration']['optionalInputData'] = this.vesParams['payload']['optionalInputData'];
    }
    this.ves.emit(this.vesParams);
  }

  onTGchange(event: any) {
    if (event === true) {
      this.openDialogBox(null);
    }
  }

}
