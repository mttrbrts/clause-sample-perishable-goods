import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';

declare var $: any;

@Injectable()
export class ComposerPerishableGoodsService {

  constructor(private http: HttpClient) {}

  private API_HOST = environment.apiUrl + '/api';

  public Status = {
    NOT_CREATED: 0,
    CREATED_PARTICIPANTS: 1,
    CREATING_SHIPMENT: 2,
    IN_TRANSIT: 3,
    ARRIVED: 4,
    FAILED: -1,
  };

  public data = {
    shipment: {
      shipmentId: this.generateId(),
      smartClause: '',
      status: this.Status.NOT_CREATED,
      sensorReadings: [],
      currentTemp: 2,
      currentHumidity: 75,
    },
    grower: {
      email: 'grower' + this.generateEmail(),
      accountBalance: 0,
    },
    importer: {
      email: 'importer' + this.generateEmail(),
      accountBalance: 3000,
    },
    historian: []
  };

  blockHeight = -1;
  public readingCounter = 0;

  public statusString() {
    for (const k in this.Status) {
      if (this.Status[k] === this.data.shipment.status) {
        return k.replace('_', ' ');
      }
    }
    return 'FAILED';
  }

  private handleSuccess(response) {
    this.getHistorian();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      $('#errorMessage > p').html(error.error.message);
      $('#errorMessage').show();
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error.message}`);

      // tslint:disable-next-line:max-line-length
      // const message = error.error.error.message.replace('Error trying invoke business network. Error: No valid responses from any peers.\nResponse from attempted peer comms was an error: Error: 2 UNKNOWN: error executing chaincode: transaction returned with failure: Error:', '');
      // $('#errorMessage > p').html(message);
      // $('#errorMessage').show();
    }
  }

  public setupDemo() {
    this.data.importer = this.addParticipant('Importer', () => {
      this.data.grower = this.addParticipant('Grower', () => {
        this.data.shipment.status = this.Status.CREATED_PARTICIPANTS;
      });
    });
  }

  private addParticipant(type, cb) {
    let participant;
    if (type === 'Importer') {
      participant = this.data.importer;
    }
    if (type === 'Grower') {
      participant = this.data.grower;
    }

    const request = {
      '$class': 'org.accordproject.perishablegoods.' + type,
      'email': participant.email,
      'address': {
        country: 'gb'
      },
      'accountBalance': participant.accountBalance
    };

    this.http.post(this.API_HOST + '/' + type, request)
    .subscribe(data => {
      this.handleSuccess(data);
      cb();
    }, err => this.handleError(err));

    return participant;
  }

  getParticipants() {
    interface Participant {
      accountBalance: number;
    }
    this.http.get(this.API_HOST + '/Grower/' + (this.data.grower.email)).subscribe(
      data => {
        this.data.grower.accountBalance = (<Participant>data).accountBalance;
      }, err => this.handleError(err));
    this.http.get(this.API_HOST + '/Importer/' + (this.data.importer.email)).subscribe(
      data => {
        this.data.importer.accountBalance = (<Participant>data).accountBalance;
      }, err => this.handleError(err));
  }

  // not guaranteed to be unique, but sufficient for our purposes
  public generateId() {
    return Math.random().toString(36).substr(2, 6);
  }

  private generateEmail() {
    return this.generateId() + '@network';
  }

  public addShipment() {
    this.data.grower.email = encodeURIComponent(this.data.grower.email);
    this.data.importer.email = encodeURIComponent(this.data.importer.email);
    this.data.shipment.status = this.Status.CREATING_SHIPMENT;
    $('#shipment').removeClass('dimmed');
    // console.log(grower);
    return this.http.post(this.API_HOST + '/Shipment', {
        '$class': 'org.accordproject.perishablegoods.Shipment',
        shipmentId: this.data.shipment.shipmentId,
        'status': 'IN_TRANSIT',
        'grower': 'resource:org.accordproject.perishablegoods.Grower#' + this.data.grower.email,
        'importer': 'resource:org.accordproject.perishablegoods.Importer#' + this.data.importer.email,
        smartClause: this.data.shipment.smartClause,
      }
    ).subscribe(data => {
      this.handleSuccess(data);
      this.data.shipment.status = this.Status.IN_TRANSIT;
    }, err => {
      this.handleError(err);
      this.data.shipment.status = this.Status.FAILED;
    });
  }

  sendSensorReading() {
    return this.http.post(this.API_HOST + '/SensorReading', {
      '$class': 'org.accordproject.perishablegoods.SensorReading',
      'centigrade': this.data.shipment.currentTemp,
      'humidity' : this.data.shipment.currentHumidity,
      'shipment': 'resource:org.accordproject.perishablegoods.Shipment#' + this.data.shipment.shipmentId,
    }).subscribe(data => {
      this.handleSuccess(data);
      this.readingCounter += 1;
    }, err => this.handleError(err));
  }

  public getHistorian() {
    console.log('historian called');
    return this.http.get(this.API_HOST + '/system/historian').subscribe(
      data => {
        function compare(a, b) {
          if (a.transactionTimestamp < b.transactionTimestamp) {
            return -1;
          } else if (a.transactionTimestamp > b.transactionTimestamp) {
            return 1;
          }
          return 0;
        }
        if (this.blockHeight === -1) {
          this.blockHeight = (<Array<any>>data).length;
        }

        this.data.historian = (<Array<any>>data).sort(compare);
        this.data.historian.splice(0, this.blockHeight - 1);
      },
      err => {
        this.handleError(err);
      }
    );
  }

  public ping() {
    console.log('ping called');
    console.log(this.API_HOST + '/system/ping');
    return this.http.get(this.API_HOST + '/system/ping').subscribe(
      data => {
        this.handleSuccess(data);
      },
      err => {
        this.handleError(err);
      }
    );
  }

  sendReceived() {
    this.http.post(this.API_HOST + '/ShipmentReceived', {
        '$class': 'org.accordproject.perishablegoods.ShipmentReceived',
        'unitCount': 3000,
        'shipment': 'resource:org.accordproject.perishablegoods.Shipment#' + this.data.shipment.shipmentId
      }
    ).subscribe(data => {
      this.handleSuccess(data);
      this.data.shipment.status = this.Status.ARRIVED;
      this.getParticipants();
    }, err => this.handleError(err));
  }

}
