import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitaService } from '../../services/cita';
import { MascotaService } from '../../services/mascota';
import { Cita } from '../../models/cita.model';
import { EstadoCitaPipe } from '../../pipes/estado-cita-pipe';
import { DestacaProxima } from '../../directives/destaca-proxima';

@Component({
  selector: 'app-historial-mascota',
  imports: [CommonModule, ReactiveFormsModule, EstadoCitaPipe, DestacaProxima],
  templateUrl: './historial-mascota.html',
  styleUrl: './historial-mascota.scss',
})
export class HistorialMascota implements OnInit {
  form!: FormGroup;

  mascotas: import('../../models/mascota.model').Mascota[] = [];
  historial: Cita[] = [];

  constructor(
    private fb: FormBuilder,
    private citaService: CitaService,
    private mascotaService: MascotaService
  ) {
    this.form = this.fb.group({
      mascotaId: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.mascotas = this.mascotaService.getAll();
  }

  buscar() {
    if (this.form.valid) {
      const id = Number(this.form.value.mascotaId);
      this.historial = this.citaService.getByMascota(id);
    }
  }
}
