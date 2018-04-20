import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CountrySelectorComponent } from '../country-selector/country-selector.component';

declare var $: any;

@Component({
  selector: 'app-shipment-modal',
  templateUrl: './shipment-modal.component.html',
  styleUrls: ['./shipment-modal.component.css']
})
export class ShipmentModalComponent implements OnInit {
  @Input() public shipment: {
    id: String,
    grower: String,
    importer: String,
    api: String,
  };
  @Input() data: {
    shipments: any,
    growers: any,
    importers: any
  };
  @Output() closed = new EventEmitter<{
    id: String,
    grower: String,
    importer: String,
    api: String,
  }>();

  constructor() { }

  ngOnInit() {
  }

  public submitAddShipmentForm() {
    // Hack using JQuery to get around broken Angular binding when using hidden Semantic UI inputs
    this.shipment.grower = $('#grower').val();
    this.shipment.importer = $('#importer').val();
    this.closed.emit(this.shipment);
  }


}
