import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Mascota } from '../domain/models/mascota.model';
import { Cita } from '../domain/models/cita.model';
import { ClinicaService } from '../domain/services/clinica.service';

@Component({
    selector: 'app-demo-oo',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './demo-oo.html',
    styleUrls: ['./demo-oo.scss']
})
export class DemoOOComponent implements OnInit {
    mascotas: Mascota[] = [];
    citas: Cita[] = [];
    mascotaSeleccionada: Mascota | null = null;
    nuevaEdad: number = 0;
    mensajeError: string = '';
    mensajeExito: string = '';
    resultadoPolimorfismo: string = '';
    notificaciones: string[] = [];
    busquedaNombre: string = '';
    busquedaEspecie: string = '';
    resultadosBusqueda: Mascota[] = [];
    estadisticas = {
        totalMascotas: 0,
        totalCitas: 0,
        citasProximas: 0,
        mascotasPorEspecie: {} as Record<string, number>
    };

    constructor(private clinicaService: ClinicaService) { }

    ngOnInit(): void {
        this.cargarDatos();
        this.cargarEstadisticas();
    }

    cargarDatos(): void {
        this.mascotas = this.clinicaService.getAllMascotas();
        this.citas = this.clinicaService.getAllCitas();

        this.citas.forEach(cita => {
            cita.agregarObserver({
                onEstadoCambiado: (nuevoEstado: string) => {
                    this.notificaciones.push(
                        'La cita ' + cita.getIdentificador() + ' cambio a: ' + nuevoEstado
                    );
                }
            });
        });

        if (this.mascotas.length > 0) {
            this.mascotaSeleccionada = this.mascotas[0];
        }
    }

    cargarEstadisticas(): void {
        this.estadisticas = this.clinicaService.getEstadisticas();
    }

    crearNuevaMascota(): void {
        const nueva = Mascota.crearPerro('Thor', 'Husky', 2);
        this.clinicaService.addMascota(nueva);
        this.mascotas = this.clinicaService.getAllMascotas();
        this.cargarEstadisticas();
        this.mensajeExito = 'Nueva mascota creada!';
        setTimeout(() => this.mensajeExito = '', 3000);
    }

    mostrarDetalles(mascota: Mascota): void {
        this.mascotaSeleccionada = mascota;
    }

    demostrarPolimorfismo(): void {
        const sonidos = this.mascotas.map(m => m.nombre + ': ' + m.getSonido());
        this.resultadoPolimorfismo = 'Sonidos: ' + sonidos.join(' | ');
    }

    actualizarEdad(): void {
        if (this.mascotaSeleccionada) {
            try {
                this.mascotaSeleccionada.edad = this.nuevaEdad;
                this.mensajeExito = 'Edad actualizada a ' + this.nuevaEdad + ' anos';
                this.mensajeError = '';
            } catch (e: any) {
                this.mensajeError = e.message;
                this.mensajeExito = '';
            }
        }
    }

    buscarMascotas(): void {
        const criterio: any = {};
        if (this.busquedaNombre) criterio.nombre = this.busquedaNombre;
        if (this.busquedaEspecie) criterio.especie = this.busquedaEspecie;

        const resultado = this.clinicaService.buscarMascotas(
            Object.keys(criterio).length > 0 ? criterio : undefined
        );
        this.resultadosBusqueda = resultado.datos;
    }

    obtenerEspecies(): { nombre: string; cantidad: number }[] {
        return Object.entries(this.estadisticas.mascotasPorEspecie).map(
            ([nombre, cantidad]) => ({ nombre, cantidad })
        );
    }
}
