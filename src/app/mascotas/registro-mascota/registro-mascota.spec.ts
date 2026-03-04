import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroMascota } from './registro-mascota';

describe('RegistroMascota', () => {
  let component: RegistroMascota;
  let fixture: ComponentFixture<RegistroMascota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroMascota]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroMascota);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
