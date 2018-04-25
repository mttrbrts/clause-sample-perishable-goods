import { TestBed, inject } from '@angular/core/testing';

import { ComposerPerishableGoodsService } from './composer.service';

describe('ComposerPerishableGoodsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComposerPerishableGoodsService]
    });
  });

  it('should be created', inject([ComposerPerishableGoodsService], (service: ComposerPerishableGoodsService) => {
    expect(service).toBeTruthy();
  }));
});