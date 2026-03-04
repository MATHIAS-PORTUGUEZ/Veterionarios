import { BaseEntity, EscuchaCambioEstado } from './animal.model';
import { Mascota } from './mascota.model';

/**
 * Tipos de estado de cita
 */
export type EstadoCita = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

/**
 * Interfaz para datos de una cita
 */
export interface ICita {
    id: number;
    mascota: Mascota;
    fecha: Date;
    motivo?: string;
    estado: EstadoCita;
}

/**
 * Clase Cita - representa una cita veterinaria
 * Demuestra: Herencia, Implementación de interfaces, Patrón Observer
 */
export class Cita extends BaseEntity {
    private _mascota: Mascota;
    private _fecha: Date;
    private _motivo: string;
    private _estado: EstadoCita;
    private _observers: EscuchaCambioEstado[] = [];

    constructor(mascota: Mascota, fecha: Date, motivo: string, id: number = 0) {
        super(id);
        this._mascota = mascota;
        this._fecha = fecha;
        this._motivo = motivo;
        this._estado = 'pendiente';
    }

    // Getters y Setters
    get mascota(): Mascota {
        return this._mascota;
    }

    set mascota(value: Mascota) {
        this._mascota = value;
    }

    get fecha(): Date {
        return this._fecha;
    }

    set fecha(value: Date) {
        if (value < new Date()) {
            throw new Error('La fecha no puede ser anterior a hoy');
        }
        this._fecha = value;
    }

    get motivo(): string {
        return this._motivo;
    }

    set motivo(value: string) {
        this._motivo = value || 'Sin especificar';
    }

    get estado(): EstadoCita {
        return this._estado;
    }

    set estado(value: EstadoCita) {
        const estadoAnterior = this._estado;
        this._estado = value;

        // Notificar a los observers (Patrón Observer)
        if (estadoAnterior !== value) {
            this.notificarObservers(value);
        }
    }

    // Métodos de la clase abstracta
    getIdentificador(): string {
        return `CITA-${this._id.toString().padStart(4, '0')}`;
    }

    // Métodos de validación
    isValid(): boolean {
        return this.validar().valido;
    }

    validar(): { valido: boolean; errores: string[] } {
        const errores: string[] = [];

        if (!this._mascota) {
            errores.push('La mascota es requerida');
        }

        if (!this._fecha) {
            errores.push('La fecha es requerida');
        }

        if (this._fecha < new Date() && this._estado === 'pendiente') {
            errores.push('No se puede agendar una cita en el pasado');
        }

        if (!this._motivo || this._motivo.trim().length === 0) {
            errores.push('El motivo es requerido');
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }

    // Métodos para el Patrón Observer
    agregarObserver(observer: EscuchaCambioEstado): void {
        this._observers.push(observer);
    }

    removerObserver(observer: EscuchaCambioEstado): void {
        const index = this._observers.indexOf(observer);
        if (index > -1) {
            this._observers.splice(index, 1);
        }
    }

    private notificarObservers(nuevoEstado: string): void {
        this._observers.forEach(observer => {
            observer.onEstadoCambiado(nuevoEstado);
        });
    }

    // Métodos de negocio
    confirmar(): void {
        this.estado = 'confirmada';
    }

    completar(): void {
        this.estado = 'completada';
    }

    cancelar(): void {
        this.estado = 'cancelada';
    }

    estaProxima(): boolean {
        const ahora = new Date();
        const diferenciaHoras = (this._fecha.getTime() - ahora.getTime()) / (1000 * 60 * 60);
        return diferenciaHoras > 0 && diferenciaHoras <= 24;
    }

    estaVencida(): boolean {
        return this._fecha < new Date() && this._estado === 'pendiente';
    }

    // Método estático factory
    static crearDesdeDatos(datos: {
        mascota: Mascota;
        fecha: Date;
        motivo: string;
        estado?: EstadoCita;
        id?: number;
    }): Cita {
        const cita = new Cita(datos.mascota, datos.fecha, datos.motivo, datos.id || 0);
        if (datos.estado) {
            cita.estado = datos.estado;
        }
        return cita;
    }
}
