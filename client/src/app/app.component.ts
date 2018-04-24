import { Component, OnInit } from '@angular/core';
import { ComposerPerishableGoodsService } from './composer-perishable-goods.service';
import {Observable} from 'rxjs/Observable';
import {ShipmentPipePipe} from './shipment-pipe.pipe';
import * as moment from 'moment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Smart Legal Contracts with IBM Blockchain, by Clause';
  urlStatus = 'UNSET';

  constructor(public service: ComposerPerishableGoodsService, private http: HttpClient) {}


  public validateClauseURL(event) {
    console.log('validing URL');
    this.urlStatus = 'LOADING';

    // Trim any extra whitespace
    this.service.data.shipment.smartClause = this.service.data.shipment.smartClause.trim();

    // Does it match the regex pattern?
    const regex = /https:\/\/api\.clause\.io\/api\/clauses\/[0-9a-z]{24}\/execute\?access_token=[0-9a-zA-Z]{64}/g;
    if (regex.exec(this.service.data.shipment.smartClause) === null) {
      this.urlStatus = 'INVALID';
      return;
    }

    // Does it accept data?
    const request = {
      '$class': 'org.accordproject.perishablegoods.ShipmentReceived',
      'unitCount': 3000,
      'shipment': {
          '$class': 'org.accordproject.perishablegoods.Shipment',
          'shipmentId': 'SHIP_001',
          'sensorReadings': [
              {
                  '$class': 'org.accordproject.perishablegoods.SensorReading',
                  'centigrade': 2,
                  'humidity': 80,
                  'shipment': 'resource:org.accordproject.perishablegoods.Shipment#SHIP_001',
                  'transactionId': 'a'
              },
              {
                  '$class': 'org.accordproject.perishablegoods.SensorReading',
                  'centigrade': 5,
                  'humidity': 90,
                  'shipment': 'resource:org.accordproject.perishablegoods.Shipment#SHIP_001',
                  'transactionId': 'b'
              },
              {
                  '$class': 'org.accordproject.perishablegoods.SensorReading',
                  'centigrade': 15,
                  'humidity': 65,
                  'shipment': 'resource:org.accordproject.perishablegoods.Shipment#SHIP_001',
                  'transactionId': 'c'
              }
          ]
      },
      'transactionId': '99c64b8a-b3b0-408a-8ec4-7820776cd447',
      'timestamp': '2018-02-18T11:11:41.264Z'
    };

    this.http.post(this.service.data.shipment.smartClause, request)
    .subscribe(response => {
      this.urlStatus = 'VALID';
      this.service.addShipment();

    }, err => { this.urlStatus = 'INVALID'; });
  }

  public sendReceived() {
    this.service.sendReceived();
  }


  public showAddReadingModal() {
    $('#new-reading-modal')
      .modal('show')
    ;
  }

  public addReading() {
    this.service.sendSensorReading();
  }

  // public addShipmentModal() {
  //   $('#newShipmentForm-id').val(this.service.generateId());
  //   $('#newShipmentForm-modal').modal('show');
  // }

  // public addImporterModal() {
  //   $('#newImporterForm-id').val(this.service.generateEmail());
  //   $('#newImporterForm-modal').modal('show');
  // }

  // public addGrowerModal() {
  //   $('#newGrowerForm-id').val(this.service.generateEmail());
  //   $('#newGrowerForm-modal').modal('show');
  // }

    //
  //   resetDemo();
  //   ping();

  //   $('#newTemp').range({
  //     min: -20,
  //     max: 60,
  //     start: newTemp,
  //     onChange: function(val) {
  //       newTemp = val;
  //       $('#display-temp').html(val);
  //     }
  //   });

  //   $('#newHumidity').range({
  //     min: 0,
  //     max: 100,
  //     start: newHumidity,
  //     onChange: function(val) {
  //       newHumidity = val;
  //       $('#display-humidity').html(val);
  //     }
  //   });


  public fromNow(date) {
    return moment(date).fromNow();
  }

  public ngOnInit() {
    $(document).ready(function() {

      // fix menu when passed
      $('.masthead')
      .visibility({
        once: false,
        onBottomPassed: function() {
          $('.fixed.menu').transition('fade in');
        },
        onBottomPassedReverse: function() {
          $('.fixed.menu').transition('fade out');
        }
      });

      // create sidebar and attach to menu open
      $('.ui.sidebar').sidebar('attach events', '.toc.item');

        $('.message .close')
          .on('click', function() {
            $(this)
            .closest('.message')
            .transition('fade')
            ;
          });

          $('.dropdown').dropdown();
          $('.ui.checkbox').checkbox();
      }
    );

    this.service.ping();
    this.service.setupDemo();
  }
}
