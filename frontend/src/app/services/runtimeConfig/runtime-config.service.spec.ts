import { TestBed, inject } from '@angular/core/testing';

import { RuntimeConfigService } from './runtime-config.service';

describe('RuntimeConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RuntimeConfigService]
    });
  });

  it('should ...', inject([RuntimeConfigService], (service: RuntimeConfigService) => {
    expect(service).toBeTruthy();
  }));
});
