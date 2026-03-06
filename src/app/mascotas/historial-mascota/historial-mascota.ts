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

  // Variables para mostrar detalles de la mascota
  mascotaSeleccionada: any = null;
  mostrarDetalleMascota: boolean = false;

  // Variables para modal de cita
  mostrarModalCita: boolean = false;
  citaSeleccionada: any = null;

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

      // Guardar datos de la mascota seleccionada
      this.mascotaSeleccionada = this.mascotas.find(m => m.id === id);
      // Ya no mostrar modal, solo mostrar la lista directamente
      this.mostrarDetalleMascota = false;
    }
  }

  cerrarDetalle() {
    this.mostrarDetalleMascota = false;
    this.mascotaSeleccionada = null;
  }

  verCita(cita: any) {
    // Obtener la mascota de la cita o buscar en la lista
    let mascota = cita.mascota;
    if (!mascota && cita.mascotaId) {
      mascota = this.mascotas.find(m => m.id === cita.mascotaId);
    }
    if (!mascota && this.mascotaSeleccionada) {
      mascota = this.mascotaSeleccionada;
    }

    // Obtener el motivo - probar diferentes propiedades
    const motivoMostrar = cita.motivoLabel || cita.motivo || cita.motivoId || 'Sin motivo';

    this.citaSeleccionada = {
      mascota: mascota?.nombre || 'No especificado',
      especie: mascota?.especie || 'No especificada',
      raza: mascota?.raza || 'No especificada',
      edad: mascota?.edad || 'No especificada',
      fecha: cita.fecha,
      motivo: motivoMostrar,
      dueno: mascota?.dueno?.nombre || this.mascotaSeleccionada?.dueno?.nombre || 'No especificado',
      telefono: mascota?.dueno?.telefono || this.mascotaSeleccionada?.dueno?.telefono || 'No especificado',
      estado: cita.estado,
      // Información del veterinario
      veterinario: cita.veterinario || null,
    };
    this.mostrarModalCita = true;
    this.mostrarDetalleMascota = false;
  }

  cerrarModalCita() {
    this.mostrarModalCita = false;
    this.citaSeleccionada = null;
    // Volver a mostrar el detalle de la mascota
    this.mostrarDetalleMascota = true;
  }
}
