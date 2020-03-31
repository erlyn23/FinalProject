import { TestBed } from '@angular/core/testing';

import { AltasService } from './altas.service';

describe('AltasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AltasService = TestBed.get(AltasService);
    expect(service).toBeTruthy();
  });
});
