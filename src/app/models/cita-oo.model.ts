import { BaseEntity, IValidatable } from './animal.model';
import { Mascota } from './mascota-oo.model';

export type EstadoCita = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

/**
 * Interfaz para listener de eventos de cita
 */
export interface EscuchaCambioEstado {
    onEstadoCambiado(estadoAnterior: EstadoCita, nuevoEstado: EstadoCita): void;
}

/**
 * Cita - Clase que hereda de BaseEntity
 * Demuestra: Herencia, Encapsulamiento, Interfaces, Eventos
 */
export class Cita extends BaseEntity implements IValidatable {
    private _mascota: Mascota;
    private _fecha: Date;
    private _motivo: string;
    private _estado: EstadoCita;
    private _observaciones: string = '';
    private _veterinario?: string;
    private _listeners: EscuchaCambioEstado[] = [];

    constructor(
        mascota: Mascota,
        fecha: Date,
        motivo: string = 'Sin especificar',
        estado: EstadoCita = 'pendiente',
        id: number = 0
    ) {
        super(id);
        this._mascota = mascota;
        this._fecha = fecha;
        this._motivo = motivo;
        this._estado = estado;
    }

    // Getters y Setters
    get mascota(): Mascota {
        return this._mascota;
    }

    get fecha(): Date {
        return this._fecha;
    }

    set fecha(value: Date) {
        if (!value || value < new Date()) {
            throw new Error('La fecha debe ser posterior a la actual');
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

    get observaciones(): string {
        return this._observaciones;
    }

    set observaciones(value: string) {
        this._observaciones = value;
    }

    get veterinario(): string | undefined {
        return this._veterinario;
    }

    set veterinario(value: string | undefined) {
        this._veterinario = value;
    }

    // Métodos de negocio
    confirmar(): void {
        this.cambiarEstado('confirmada');
    }

    cancelar(): void {
        this.cambiarEstado('cancelada');
    }

    completar(): void {
        this.cambiarEstado('completada');
    }

    private cambiarEstado(nuevoEstado: EstadoCita): void {
        const estadoAnterior = this._estado;
        this._estado = nuevoEstado;

        // Notificar a los listeners
        this.notifyListeners(estadoAnterior, nuevoEstado);
    }

    // Pattern Observer para eventos
    addListener(listener: EscuchaCambioEstado): void {
        this._listeners.push(listener);
    }

    removeListener(listener: EscuchaCambioEstado): void {
        const index = this._listeners.indexOf(listener);
        if (index > -1) {
            this._listeners.splice(index, 1);
        }
    }

    private notifyListeners(estadoAnterior: EstadoCita, nuevoEstado: EstadoCita): void {
        this._listeners.forEach(listener => {
            listener.onEstadoCambiado(estadoAnterior, nuevoEstado);
        });
    }

    // Implementación de IValidatable
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
        } else if (this._fecha < new Date() && this._estado === 'pendiente') {
            errores.push('La fecha no puede ser anterior a la actual');
        }

        if (!this._motivo || this._motivo.trim().length === 0) {
            errores.push('El motivo es requerido');
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }

    getIdentificador(): string {
        return `CITA-${this.id}-${this._mascota.getIdentificador()}`;
    }

    // Método para verificar si la cita es pronto
    esProxima(): boolean {
        const ahora = new Date();
        const diferenciaHoras = (this._fecha.getTime() - ahora.getTime()) / (1000 * 60 * 60);
        return diferenciaHoras > 0 && diferenciaHoras <= 24;
    }

    // Método estático factory
    static crearParaHoy(mascota: Mascota, motivo: string): Cita {
        const hoy = new Date();
        hoy.setHours(hoy.getHours() + 2);
        return new Cita(mascota, hoy, motivo);
    }

    static crearParaManana(mascota: Mascota, motivo: string): Cita {
        const manana = new Date();
        manana.setDate(manana.getDate() + 1);
        manana.setHours(10, 0, 0, 0);
        return new Cita(mascota, manana, motivo);
    }
}
