import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../services/cita';
import { MascotaService } from '../../services/mascota';
import { RecomendacionService } from '../../services/recomendacion.service';
import { Mascota } from '../../models/mascota.model';
import { Veterinario, MOTIVOS_CITA, OpcionMotivo } from '../../models/veterinario.model';
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

  // Opciones de motivos para el dropdown
  motivos: OpcionMotivo[] = MOTIVOS_CITA;

  // Veterinario recomendado según el motivo seleccionado
  veterinarioRecomendado: Veterinario | null = null;

  // Variables para mensaje detallado
  mostrarMensajeExito: boolean = false;
  citaRegistrada: any = null;
  tipoModal: 'nueva' | 'ver' = 'nueva';

  constructor(
    private fb: FormBuilder,
    private citaService: CitaService,
    private mascotaService: MascotaService,
    private recomendacionService: RecomendacionService
  ) {
    this.form = this.fb.group({
      mascotaId: ['', Validators.required],
      fecha: ['', Validators.required],
      motivoId: ['', Validators.required],
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

  /**
   * Se ejecuta cuando el usuario selecciona un motivo
   * Recomienda automáticamente un veterinario especializado
   */
  onMotivoChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const motivoId = select.value;

    if (motivoId) {
      this.veterinarioRecomendado = this.recomendacionService.obtenerVeterinarioRecomendado(motivoId) || null;
    } else {
      this.veterinarioRecomendado = null;
    }
  }

  /**
   * Obtiene el label del motivo por su ID
   */
  getLabelMotivo(motivoId: string): string {
    const motivo = this.motivos.find(m => m.id === motivoId);
    return motivo?.label || 'Sin especificar';
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

        if (!this.veterinarioRecomendado) {
          this.mensaje = '❌ Por favor selecciona un motivo para recomendar un veterinario';
          setTimeout(() => this.mensaje = '', 3000);
          return;
        }

        const labelMotivo = this.getLabelMotivo(v.motivoId);

        const nuevaCita = {
          id: 0,
          mascota,
          fecha: new Date(v.fecha),
          motivoId: v.motivoId,
          motivoLabel: labelMotivo,
          motivo: labelMotivo, // Guardamos también en motivo para compatibilidad con historial
          veterinario: this.veterinarioRecomendado,
          estado: 'pendiente' as const,
        };
        this.citaService.add(nuevaCita);
        this.citas = this.citaService.getAll();

        // Guardar datos para mensaje detallado
        this.citaRegistrada = {
          mascota: mascota.nombre,
          fecha: new Date(v.fecha),
          motivo: this.getLabelMotivo(v.motivoId),
          motivoId: v.motivoId,
          dueno: mascota.dueno?.nombre || 'No especificado',
          veterinario: this.veterinarioRecomendado
        };
        this.mostrarMensajeExito = true;

        this.form.reset();
        this.veterinarioRecomendado = null;
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
      motivo: cita.motivoLabel || cita.motivo,
      dueno: cita.mascota.dueno?.nombre || 'No especificado',
      estado: cita.estado,
      veterinario: cita.veterinario
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

