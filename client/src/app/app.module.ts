import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ComposerPerishableGoodsService } from './composer-perishable-goods.service';
import { FormsModule } from '@angular/forms';
import { ShipmentPipePipe } from './shipment-pipe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ShipmentPipePipe
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
