import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

declare var $: any;

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable()
export class ComposerPerishableGoodsService {

  constructor(private http: HttpClient) { }

  private API_HOST = 'https://composer-rest-server-cicero-perishable-network.mybluemix.net/api';
  public data = {
    shipments: [],
    growers: [],
    importers: []
  };

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
      const message = error.error.error.message.replace('Error trying invoke business network. Error: No valid responses from any peers.\nResponse from attempted peer comms was an error: Error: 2 UNKNOWN: error executing chaincode: transaction returned with failure: Error:', '');
      $('#errorMessage > p').html(message);
      $('#errorMessage').show();
    }
  }

  setupDemo() {
    return this.http.post(this.API_HOST + '/SetupDemo',
      {
        '$class': 'org.accordproject.perishablegoods.SetupDemo'
      }
    ).subscribe(data => {}, err => this.handleError(err));
  }

  addParticipant(type, email, country, balance) {
    console.log(type, email, country, balance);
    if (type !== 'Importer' && type !== 'Grower' && type !== 'Shipper') {
      throw Error(`Invalid participant name, ${type}. Choose from Importer, Grower or Shipper`);
    }

    return this.http.post(this.API_HOST + '/' + type, {
        '$class': 'org.accordproject.perishablegoods.' + type,
        'email': email,
        'address': {
            country
        },
        'accountBalance': balance
    }).subscribe(data => {}, err => this.handleError(err));
  }

  getAllParticipants() {
    this.http.get(this.API_HOST + '/Grower').subscribe(
      data => {
        this.data.growers = <Array<any>>data;
      }, err => this.handleError(err));
    this.http.get(this.API_HOST + '/Importer').subscribe(
      data => {
        this.data.importers = <Array<any>>data;
      }, err => this.handleError(err));
  }

  getAllShipments() {
    this.http.get(this.API_HOST + '/Shipment').subscribe(
      data => {
        this.data.shipments = <Array<any>>data;
      }, err => this.handleError(err));
  }

  // not guaranteed to be unique, but sufficient for our purposes
  generateShipmentId() {
    return 'SHIP_' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  generateEmail() {
    return Math.random().toString(36).substr(2, 7) + '@network';
  }

  public addShipment(shipmentId, smartClause, grower, importer) {
    grower = encodeURIComponent(grower);
    importer = encodeURIComponent(importer);
    // console.log(grower);
    return this.http.post(this.API_HOST + '/Shipment', {
        '$class': 'org.accordproject.perishablegoods.Shipment',
        shipmentId,
        'status': 'IN_TRANSIT',
        'grower': 'resource:org.accordproject.perishablegoods.Grower#' + grower,
        'importer': 'resource:org.accordproject.perishablegoods.Importer#' + importer,
        smartClause,
      }
    ).subscribe(data => {}, err => this.handleError(err));
  }

  undoSetupDemo() {
    this.http.delete(this.API_HOST + '/Shipment/SHIP_001').subscribe(data => {}, err => this.handleError(err));
    this.http.delete(this.API_HOST + '/Grower/farmer%40email.com').subscribe(data => {}, err => this.handleError(err));
    this.http.delete(this.API_HOST + '/Importer/supermarket%40email.com').subscribe(data => {}, err => this.handleError(err));
    this.http.delete(this.API_HOST + '/Shipper/shipper%40email.com').subscribe(data => {}, err => this.handleError(err));
  }

  sendSensorReading(shipment, temp, humidity) {
    return this.http.post(this.API_HOST + '/SensorReading', {
      '$class': 'org.accordproject.perishablegoods.SensorReading',
      'centigrade': temp,
      'humidity' : humidity,
      'shipment': 'resource:org.accordproject.perishablegoods.Shipment#' + shipment.id,
    }).subscribe(data => {}, err => this.handleError(err));
  }

  public ping() {
    console.log('ping called');
    console.log(this.API_HOST + '/system/ping');
    return this.http.get(this.API_HOST + '/system/ping', httpOptions).subscribe(
      data => {
        console.log(data);
      },
      err => {
        this.handleError(err);
      }
    );
  }

  sendReceived(shipment) {
    return this.http.post(this.API_HOST + '/ShipmentReceived', {
          '$class': 'org.accordproject.perishablegoods.ShipmentReceived',
          'unitCount': 3000,
          'shipment': 'resource:org.accordproject.perishablegoods.Shipment#' + shipment.id
        }
      );
  }

}
