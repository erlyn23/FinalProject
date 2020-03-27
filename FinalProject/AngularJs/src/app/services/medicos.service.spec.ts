import { TestBed } from '@angular/core/testing';

import { MedicosService } from './medicos.service';

describe('MedicosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MedicosService = TestBed.get(MedicosService);
    expect(service).toBeTruthy();
  });
});
