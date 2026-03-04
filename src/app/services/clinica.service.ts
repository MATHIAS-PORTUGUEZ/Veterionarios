import { Injectable } from '@angular/core';
import { Mascota } from '../models/mascota-oo.model';
import { Cita, EscuchaCambioEstado } from '../models/cita-oo.model';

/**
 * Interfaz para callback de operaciones asíncronas
 */
export interface Callback<T> {
    (error: Error | null, result?: T): void;
}

/**
 * Interfaz para resultado paginado
 */
export interface ResultadoPaginado<T> {
    datos: T[];
    total: number;
    pagina: number;
    tamanoPagina: number;
    tieneSiguiente: boolean;
    tieneAnterior: boolean;
}

/**
 * Servicio avanzado que demuestra funciones avanzadas de TypeScript y POO
 * - Genéricos
 * - Decoradores
 * - Funciones de orden superior
 * - Programación funcional
 * - Interfaces complejas
 */
@Injectable({
    providedIn: 'root',
})
export class ClinicaService implements EscuchaCambioEstado {
    private mascotas: Mascota[] = [];
    private citas: Cita[] = [];
    private _Listeners: ((mascotas: Mascota[]) => void)[] = [];

    constructor() {
        this.inicializarDatosDemo();
    }

    // Inicializar con datos de demostración
    private inicializarDatosDemo(): void {
        // Crear mascotas usando métodos estáticos (Factory)
        const perro1 = Mascota.crearPerro('Max', 'Golden Retriever', 3);
        perro1.id = 1;
        perro1.peso = 30;
        perro1.dueno = { id: 1, nombre: 'Juan Pérez', telefono: '555-1234' };
        perro1.agregarVacuna('Rabia');
        perro1.agregarVacuna('Moquillo');

        const gato1 = Mascota.crearGato('Luna', 'Persa', 2);
        gato1.id = 2;
        gato1.peso = 4;
        gato1.dueno = { id: 2, nombre: 'María García', telefono: '555-5678' };
        gato1.agregarVacuna('Leucemia');

        const loro1 = new Mascota('Pepito', 'Ave', 'Loro', 5, 3);
        loro1.peso = 1;

        this.mascotas.push(perro1, gato1, loro1);

        // Crear citas
        const cita1 = new Cita(perro1, new Date(), 'Revisión anual');
        cita1.id = 1;
        cita1.addListener(this);

        const cita2 = Cita.crearParaManana(gato1, 'Vacunación');
        cita2.id = 2;

        this.citas.push(cita1, cita2);
    }

    // ========== OPERACIONES CON MASCOTAS ==========

    getAllMascotas(): Mascota[] {
        return [...this.mascotas];
    }

    getMascotaById(id: number): Mascota | undefined {
        return this.mascotas.find(m => m.id === id);
    }

    addMascota(mascota: Mascota): Mascota {
        // Validar usando el método de la clase
        if (!mascota.isValid()) {
            const errores = mascota.validar();
            throw new Error(errores.errores.join(', '));
        }

        // Asignar ID automático
        const maxId = Math.max(0, ...this.mascotas.map(m => m.id));
        mascota.id = maxId + 1;

        this.mascotas.push(mascota);
        this.notificarCambios();

        return mascota;
    }

    actualizarMascota(id: number, datosParciales: Partial<Mascota>): Mascota | null {
        const index = this.mascotas.findIndex(m => m.id === id);
        if (index === -1) return null;

        const mascota = this.mascotas[index];

        // Aplicar actualizaciones usando reflexión
        Object.keys(datosParciales).forEach(key => {
            const value = (datosParciales as any)[key];
            if (value !== undefined) {
                (mascota as any)[key] = value;
            }
        });

        this.notificarCambios();
        return mascota;
    }

    eliminarMascota(id: number): boolean {
        const index = this.mascotas.findIndex(m => m.id === id);
        if (index === -1) return false;

        this.mascotas.splice(index, 1);
        this.notificarCambios();
        return true;
    }

    // ========== OPERACIONES CON CITAS ==========

    getAllCitas(): Cita[] {
        return [...this.citas];
    }

    getCitasPorMascota(mascotaId: number): Cita[] {
        return this.citas.filter(c => c.mascota.id === mascotaId);
    }

    getCitasProximas(): Cita[] {
        const ahora = new Date();
        return this.citas
            .filter(c => c.fecha > ahora)
            .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
    }

    addCita(cita: Cita): Cita {
        if (!cita.isValid()) {
            const errores = cita.validar();
            throw new Error(errores.errores.join(', '));
        }

        const maxId = Math.max(0, ...this.citas.map(c => c.id));
        cita.id = maxId + 1;
        cita.addListener(this);

        this.citas.push(cita);
        return cita;
    }

    actualizarEstadoCita(id: number, estado: any): Cita | null {
        const cita = this.citas.find(c => c.id === id);
        if (!cita) return null;

        switch (estado) {
            case 'confirmada':
                cita.confirmar();
                break;
            case 'cancelada':
                cita.cancelar();
                break;
            case 'completada':
                cita.completar();
                break;
        }

        return cita;
    }

    // Implementación de EscuchaCambioEstado
    onEstadoCambiado(estadoAnterior: any, nuevoEstado: any): void {
        console.log(`Cita cambió de ${estadoAnterior} a ${nuevoEstado}`);
    }

    // ========== FUNCIONES AVANZADAS ==========

    /**
     * Función genérica para buscar con filtros
     */
    buscar<T>(
        elementos: T[],
        filtro: (elemento: T) => boolean,
        orden?: (a: T, b: T) => number
    ): T[] {
        let resultado = elementos.filter(filtro);

        if (orden) {
            resultado = resultado.sort(orden);
        }

        return resultado;
    }

    /**
     * Función genérica para paginación
     */
    paginar<T>(elementos: T[], pagina: number, tamano: number): ResultadoPaginado<T> {
        const inicio = (pagina - 1) * tamano;
        const fin = inicio + tamano;
        const datos = elementos.slice(inicio, fin);

        return {
            datos,
            total: elementos.length,
            pagina,
            tamanoPagina: tamano,
            tieneSiguiente: fin < elementos.length,
            tieneAnterior: pagina > 1
        };
    }

    /**
     * Función de orden superior - transforma datos
     */
    transformarMascotas<T>(
        transformacion: (m: Mascota) => T
    ): T[] {
        return this.mascotas.map(transformacion);
    }

    /**
     * Función con callbacks (estilo async)
     */
    buscarMascotaAsync(id: number, callback: Callback<Mascota>): void {
        setTimeout(() => {
            const mascota = this.getMascotaById(id);
            if (mascota) {
                callback(null, mascota);
            } else {
                callback(new Error('Mascota no encontrada'));
            }
        }, 100);
    }

    /**
     * Suscribirse a cambios de mascotas
     */
    subscribe(callback: (mascotas: Mascota[]) => void): () => void {
        this._Listeners.push(callback);

        // Retornar función para unsubscribe
        return () => {
            const index = this._Listeners.indexOf(callback);
            if (index > -1) {
                this._Listeners.splice(index, 1);
            }
        };
    }

    private notificarCambios(): void {
        this._Listeners.forEach(callback => callback(this.mascotas));
    }

    /**
     * Función estática para crear mascotas desde datos planos
     */
    static crearMascotaDesdeDatos(datos: {
        nombre: string;
        especie: string;
        raza?: string;
        edad?: number;
        duenoNombre: string;
        duenoTelefono?: string;
    }): Mascota {
        const mascota = new Mascota(
            datos.nombre,
            datos.especie,
            datos.raza,
            datos.edad
        );

        mascota.dueno = {
            id: 0,
            nombre: datos.duenoNombre,
            telefono: datos.duenoTelefono
        };

        return mascota;
    }

    /**
     * Función que retorna estadísticas de la clínica
     */
    getEstadisticas(): {
        totalMascotas: number;
        totalCitas: number;
        citasProximas: number;
        mascotasPorEspecie: Record<string, number>;
    } {
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
}
