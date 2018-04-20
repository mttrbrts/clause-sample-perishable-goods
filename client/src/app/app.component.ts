import { Component, OnInit } from '@angular/core';
import { ComposerPerishableGoodsService } from './composer-perishable-goods.service';
import {Observable} from 'rxjs/Observable';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Smart Legal Contracts with IBM Blockchain, by Clause';
  step = 0;
  newTemp = 5;
  newHumidity = 53;
  readings = [];
  shipment: {id: String, api: String, grower: String, importer: String};
  importer: {id: String, country: String, balance: number};
  grower: {id: String, country: String, balance: number};

  constructor(public service: ComposerPerishableGoodsService) {
    this.shipment = {
      id: service.generateShipmentId(),
      // tslint:disable-next-line:max-line-length
      api: 'https://api.clause.io/api/clauses/5ac61e0d36174c0b99ad4f57/execute?access_token=CHgHb7yfgFp5RsY2QbJ6CyShouMvJHrS84lHzDUdrpzQFelnJFTxmb6s0P6mvi4E',
      grower: '',
      importer: ''
    };
    this.importer = {
      id: service.generateEmail(), country: 'gb', balance: 3000
    };
    this.grower = {
      id: service.generateEmail(), country: 'gb', balance: 3000
    };
  }

  public createDefaultAssets() {
    this.service.setupDemo();
  }

  public deleteDefaultAssets() {
    this.service.undoSetupDemo();
  }

  public submitAddShipmentForm() {
    this.service.addShipment(
      this.shipment.id,
      this.shipment.api,
      this.shipment.grower,
      this.shipment.importer
    );
  }

  public submitAddParticipantForm(event) {
    this.service.addParticipant(
      event.participant,
      event.email,
      event.country,
      event.balance,
    );
  }

  public addReading() {
    console.log('add reading');
    console.log('temp:', this.newTemp);
    console.log('humidity:', this.newHumidity);

    this.service.sendSensorReading(this.shipment, this.newTemp, this.newHumidity);
      // .subscribe(response => {
      //     console.log('reading submitted');
          // $( '.ui.fluid.card:last' ).after(`
          //   <div class="ui fluid card">
          //     <div class="content">
          //     <div class="header">${new Date()}</div>
          //       <div class="meta">74972368f01cf55025d9332005b2f659</div>
          //       <div class="description">
          //         <div class="ui teal progress" data-percent="${newTemp}" id="temp${readings.length}">
          //           <div class="bar"></div>
          //           <div class="label">Temperature</div>
          //         </div>
          //         <div class="ui orange progress" data-percent="${newHumidity}" id="humidity${readings.length}">
          //           <div class="bar"></div>
          //           <div class="label">Humidity</div>
          //         </div>
          //       </div>
          //     </div>
          //   </div>
          // `);

          // $( "#temp"+readings.length ).progress();
          // $( "#humidity"+readings.length ).progress();

    //       this.readings.push({temp: this.newTemp, humidity: this.newHumidity});
    //   }
    // );
  }

  public resetDemo() {
    this.step = 0;

  }

  public nextStep() {
    console.log('next step clicked');
    this.step += 1;
  }

  public backStep() {

    console.log('back step clicked');
    this.step -= 1;
  }

  public addShipmentModal() {
    $('#newShipmentForm-id').val(this.service.generateShipmentId());
    $('#newShipmentForm-modal').modal('show');
  }

  public addImporterModal() {
    $('#newImporterForm-id').val(this.service.generateEmail());
    $('#newImporterForm-modal').modal('show');
  }

  public addGrowerModal() {
    $('#newGrowerForm-id').val(this.service.generateEmail());
    $('#newGrowerForm-modal').modal('show');
  }

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
    this.service.getAllParticipants();
    this.service.getAllShipments();
  }
}
