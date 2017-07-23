import { TestBed, inject } from '@angular/core/testing';

import { InverterConfigService } from './inverter-config.service';

describe('InverterConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InverterConfigService]
    });
  });

  it('should ...', inject([InverterConfigService], (service: InverterConfigService) => {
    expect(service).toBeTruthy();
  }));
});
