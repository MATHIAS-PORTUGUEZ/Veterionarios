/**
 * Interfaz base para todas las entidades del sistema
 * Implementa el principio de abstracción
 */
export interface IEntity {
    id: number;
    getId(): number;
    setId(id: number): void;
}

/**
 * Interfaz para objetos que pueden ser nombrados
 */
export interface INombrable {
    nombre: string;
    getNombre(): string;
    setNombre(nombre: string): void;
}

/**
 * Interfaz para validatable - objetos que pueden validar sus datos
 */
export interface IValidatable {
    isValid(): boolean;
    validar(): { valido: boolean; errores: string[] };
}

/**
 * Interfaz para observer - patrón observer
 */
export interface EscuchaCambioEstado {
    onEstadoCambiado(nuevoEstado: string): void;
}

/**
 * Clase abstracta base para todas las entidades
 * Implementa encapsulamiento y abstracción
 */
export abstract class BaseEntity implements IEntity {
    protected _id: number = 0;
    protected _fechaCreacion: Date = new Date();

    constructor(id: number = 0) {
        this._id = id;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        if (value < 0) {
            throw new Error('El ID no puede ser negativo');
        }
        this._id = value;
    }

    getId(): number {
        return this._id;
    }

    setId(id: number): void {
        this.id = id;
    }

    abstract getIdentificador(): string;

    protected getFechaCreacion(): Date {
        return this._fechaCreacion;
    }
}
