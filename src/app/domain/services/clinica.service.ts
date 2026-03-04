import { Injectable } from '@angular/core';
import { Mascota } from '../models/mascota.model';
import { Cita, EstadoCita } from '../models/cita.model';

export interface EstadisticasClinica {
    totalMascotas: number;
    totalCitas: number;
    citasProximas: number;
    mascotasPorEspecie: Record<string, number>;
}

export interface ResultadoBusqueda<T> {
    datos: T[];
    total: number;
    pagina: number;
    tamanoPagina: number;
}

@Injectable({
    providedIn: 'root'
})
export class ClinicaService {
    private mascotas: Mascota[] = [];
    private citas: Cita[] = [];
    private nextMascotaId: number = 1;
    private nextCitaId: number = 1;

    constructor() {
        this.inicializarDatosDemo();
    }

    private inicializarDatosDemo(): void {
        const perro1 = Mascota.crearPerro('Buddy', 'Labrador', 3);
        perro1.id = this.nextMascotaId++;
        perro1.peso = 25;

        const gato1 = Mascota.crearGato('Luna', 'Siamés', 2);
        gato1.id = this.nextMascotaId++;
        gato1.peso = 4;

        const perro2 = Mascota.crearPerro('Max', 'Golden Retriever', 5);
        perro2.id = this.nextMascotaId++;
        perro2.peso = 30;

        const gato2 = Mascota.crearGato('Milo', 'Persa', 1);
        gato2.id = this.nextMascotaId++;
        gato2.peso = 3;

        this.mascotas.push(perro1, gato1, perro2, gato2);

        const cita1 = new Cita(perro1, new Date(Date.now() + 86400000), 'Revisión anual');
        cita1.id = this.nextCitaId++;

        const cita2 = new Cita(gato1, new Date(Date.now() + 172800000), 'Vacunación');
        cita2.id = this.nextCitaId++;

        this.citas.push(cita1, cita2);
    }

    getAllMascotas(): Mascota[] {
        return [...this.mascotas];
    }

    getMascotaById(id: number): Mascota | undefined {
        return this.mascotas.find(m => m.id === id);
    }

    addMascota(mascota: Mascota): void {
        if (!mascota.id) {
            mascota.id = this.nextMascotaId++;
        }
        this.mascotas.push(mascota);
    }

    updateMascota(id: number, datos: Partial<Mascota>): boolean {
        const index = this.mascotas.findIndex(m => m.id === id);
        if (index >= 0) {
            Object.assign(this.mascotas[index], datos);
            return true;
        }
        return false;
    }

    deleteMascota(id: number): boolean {
        const index = this.mascotas.findIndex(m => m.id === id);
        if (index >= 0) {
            this.mascotas.splice(index, 1);
            return true;
        }
        return false;
    }

    getAllCitas(): Cita[] {
        return [...this.citas];
    }

    getCitaById(id: number): Cita | undefined {
        return this.citas.find(c => c.id === id);
    }

    addCita(cita: Cita): void {
        if (!cita.id) {
            cita.id = this.nextCitaId++;
        }
        this.citas.push(cita);
    }

    updateCita(id: number, datos: Partial<{ mascota: Mascota; fecha: Date; motivo: string; estado: EstadoCita }>): boolean {
        const index = this.citas.findIndex(c => c.id === id);
        if (index >= 0) {
            if (datos.mascota) this.citas[index].mascota = datos.mascota;
            if (datos.fecha) this.citas[index].fecha = datos.fecha;
            if (datos.motivo) this.citas[index].motivo = datos.motivo;
            if (datos.estado) this.citas[index].estado = datos.estado;
            return true;
        }
        return false;
    }

    getCitasByMascota(mascotaId: number): Cita[] {
        return this.citas.filter(c => c.mascota.id === mascotaId);
    }

    getCitasProximas(): Cita[] {
        return this.citas.filter(c => c.estaProxima());
    }

    getCitasPorEstado(estado: EstadoCita): Cita[] {
        return this.citas.filter(c => c.estado === estado);
    }

    buscar<T>(
        entidades: T[],
        filtro: (entidad: T) => boolean,
        ordenamiento?: (a: T, b: T) => number,
        pagina: number = 1,
        tamanoPagina: number = 10
    ): T[] {
        let resultado = entidades.filter(filtro);

        if (ordenamiento) {
            resultado.sort(ordenamiento);
        }

        const inicio = (pagina - 1) * tamanoPagina;
        const fin = inicio + tamanoPagina;

        return resultado.slice(inicio, fin);
    }

    buscarMascotas(
        criterio?: { nombre?: string; especie?: string; raza?: string },
        pagina: number = 1,
        tamanoPagina: number = 10
    ): ResultadoBusqueda<Mascota> {
        const filtro = (m: Mascota): boolean => {
            if (!criterio) return true;
            const nombreCoincide = !criterio.nombre || m.nombre.toLowerCase().includes(criterio.nombre.toLowerCase());
            const especieCoincide = !criterio.especie || m.especie.toLowerCase().includes(criterio.especie.toLowerCase());
            const razaCoincide = !criterio.raza || (m.raza ? m.raza.toLowerCase().includes(criterio.raza.toLowerCase()) : false);
            return nombreCoincide && especieCoincide && razaCoincide;
        };

        const todas = this.buscar(this.mascotas, filtro, undefined, pagina, tamanoPagina);
        const filtradas = this.mascotas.filter(filtro);

        return {
            datos: todas,
            total: filtradas.length,
            pagina,
            tamanoPagina
        };
    }

    getEstadisticas(): EstadisticasClinica {
        const mascotasPorEspecie = this.mascotas.reduce((acc, m) => {
            acc[m.especie] = (acc[m.especie] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalMascotas: this.mascotas.length,
            totalCitas: this.citas.length,
            citasProximas: this.getCitasProximas().length,
            mascotasPorEspecie
        };
    }

    puedeEliminarMascota(id: number): { puede: boolean; razon?: string } {
        const tieneCitas = this.citas.some(c => c.mascota.id === id && (c.estado === 'pendiente' || c.estado === 'confirmada'));
        if (tieneCitas) {
            return { puede: false, razon: 'La mascota tiene citas pendientes o confirmadas' };
        }
        return { puede: true };
    }
}
