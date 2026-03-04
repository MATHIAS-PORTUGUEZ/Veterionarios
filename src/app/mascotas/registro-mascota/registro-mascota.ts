import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../../services/mascota';

@Component({
  selector: 'app-registro-mascota',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './registro-mascota.html',
  styleUrl: './registro-mascota.scss',
})
export class RegistroMascota {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private mascotaService: MascotaService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      especie: ['', Validators.required],
      raza: [''],
      edad: [''],
      duenoNombre: ['', Validators.required],
      duenoTelefono: [''],
    });
  }

  submit() {
    if (this.form.valid) {
      const value = this.form.value as any;
      const nueva = {
        id: 0,
        nombre: value.nombre || '',
        especie: value.especie || '',
        raza: value.raza || undefined,
        edad: value.edad ? Number(value.edad) : undefined,
        dueno: {
          id: 0,
          nombre: value.duenoNombre || '',
          telefono: value.duenoTelefono || undefined,
        },
      };
      this.mascotaService.add(nueva as any);
      this.form.reset();
      alert('Mascota registrada');
    }
  }
}


