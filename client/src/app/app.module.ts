import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ComposerPerishableGoodsService } from './composer-perishable-goods.service';
import { ShipmentModalComponent } from './shipment-modal/shipment-modal.component';
import { ParticipantModalComponent } from './participant-modal/participant-modal.component';
import { CountrySelectorComponent } from './country-selector/country-selector.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ShipmentModalComponent,
    ParticipantModalComponent,
    CountrySelectorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ComposerPerishableGoodsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
