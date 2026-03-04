import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../services/cita';
import { MascotaService } from '../../services/mascota';
import { Mascota } from '../../models/mascota.model';
import { EstadoCitaPipe } from '../../pipes/estado-cita-pipe';
import { DestacaProxima } from '../../directives/destaca-proxima';

@Component({
  selector: 'app-agenda-citas',
  imports: [CommonModule, ReactiveFormsModule, EstadoCitaPipe, DestacaProxima],
  templateUrl: './agenda-citas.html',
  styleUrl: './agenda-citas.scss',
})
export class AgendaCitas implements OnInit {
  form!: FormGroup;

  mascotas: Mascota[] = [];
  citas: any[] = [];
  mensaje: string = '';

  constructor(
    private fb: FormBuilder,
    private citaService: CitaService,
    private mascotaService: MascotaService
  ) {
    this.form = this.fb.group({
      mascotaId: ['', Validators.required],
      fecha: ['', Validators.required],
      motivo: [''],
    });
  }

  ngOnInit() {
    this.cargarMascotas();
    this.citas = this.citaService.getAll();
  }

  cargarMascotas() {
    this.mascotas = this.mascotaService.getAll();
  }

  submit() {
    if (this.form.valid) {
      try {
        const v = this.form.value;
        const mascotaId = Number(v.mascotaId);
        const mascota = this.mascotas.find(m => m.id === mascotaId);

        if (mascota) {
          this.citaService.add({
            id: 0,
            mascota,
            fecha: new Date(v.fecha),
            motivo: v.motivo || 'Sin especificar',
            estado: 'pendiente',
          });
          this.citas = this.citaService.getAll();
          this.form.reset();
          this.mensaje = '✅ Cita agendada exitosamente';
          setTimeout(() => this.mensaje = '', 3000);
        }
      } catch (error) {
        this.mensaje = '❌ Error al agendar la cita';
        setTimeout(() => this.mensaje = '', 3000);
      }
    }
  }

  cancelarCita(citaId: number) {
    try {
      this.citaService.update(citaId, { estado: 'cancelada' });
      this.citas = this.citaService.getAll();
      this.mensaje = '✅ Cita cancelada exitosamente';
      setTimeout(() => this.mensaje = '', 3000);
    } catch (error) {
      this.mensaje = '❌ Error al cancelar la cita';
      setTimeout(() => this.mensaje = '', 3000);
    }
  }
}
