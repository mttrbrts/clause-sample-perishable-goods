import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentModalComponent } from './shipment-modal.component';

describe('ShipmentModalComponent', () => {
  let component: ShipmentModalComponent;
  let fixture: ComponentFixture<ShipmentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
