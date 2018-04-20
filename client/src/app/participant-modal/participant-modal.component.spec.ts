import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantModalComponent } from './participant-modal.component';

describe('ParticipantModalComponent', () => {
  let component: ParticipantModalComponent;
  let fixture: ComponentFixture<ParticipantModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
