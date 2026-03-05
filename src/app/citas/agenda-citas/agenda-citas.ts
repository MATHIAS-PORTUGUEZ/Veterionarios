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
  minFecha: string = '';

  // Variables para mensaje detallado
  mostrarMensajeExito: boolean = false;
  citaRegistrada: any = null;
  tipoModal: 'nueva' | 'ver' = 'nueva';

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
    this.minFecha = this.getFechaMinima();
  }

  getFechaMinima(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
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

        if (!mascota) {
          this.mensaje = '❌ Mascota no encontrada';
          setTimeout(() => this.mensaje = '', 3000);
          return;
        }

        const nuevaCita = {
          id: 0,
          mascota,
          fecha: new Date(v.fecha),
          motivo: v.motivo || 'Sin especificar',
          estado: 'pendiente' as const,
        };
        this.citaService.add(nuevaCita);
        this.citas = this.citaService.getAll();

        // Guardar datos para mensaje detallado
        this.citaRegistrada = {
          mascota: mascota.nombre,
          fecha: new Date(v.fecha),
          motivo: v.motivo || 'Sin especificar',
          dueno: mascota.dueno?.nombre || 'No especificado'
        };
        this.mostrarMensajeExito = true;

        this.form.reset();
      } catch (error) {
        console.error('Error al agendar:', error);
        this.mensaje = '❌ Error al agendar la cita';
        setTimeout(() => this.mensaje = '', 3000);
      }
    }
  }

  cerrarMensaje() {
    this.mostrarMensajeExito = false;
    this.citaRegistrada = null;
  }

  verCita(cita: any) {
    this.citaRegistrada = {
      mascota: cita.mascota.nombre,
      fecha: cita.fecha,
      motivo: cita.motivo,
      dueno: cita.mascota.dueno?.nombre || 'No especificado',
      estado: cita.estado
    };
    this.tipoModal = 'ver';
    this.mostrarMensajeExito = true;
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
