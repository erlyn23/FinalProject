import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabDialogComponent } from './hab-dialog.component';

describe('HabDialogComponent', () => {
  let component: HabDialogComponent;
  let fixture: ComponentFixture<HabDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
