import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ComposerPerishableGoodsService } from '../composer-perishable-goods.service';
declare var $: any;

@Component({
  selector: 'app-participant-modal',
  templateUrl: './participant-modal.component.html',
  styleUrls: ['./participant-modal.component.css']
})
export class ParticipantModalComponent implements OnInit {

  @Input() public participant: String;
  @Output() closed = new EventEmitter<{
    participant: String,
    email: String,
    country: String,
    balance: Number
  }>();
  email: String;
  country: String = 'gb';
  balance: Number = 3000;

  constructor(private service: ComposerPerishableGoodsService) {
    this.email = service.generateEmail();
  }

  ngOnInit() {
  }

  public submitAddParticipantForm() {
    // Hack using JQuery to get around broken Angular binding when using hidden Semantic UI inputs
    this.country = $('#country').val();
    this.closed.emit({participant: this.participant, email: this.email, country: this.country, balance: this.balance});
  }

}
