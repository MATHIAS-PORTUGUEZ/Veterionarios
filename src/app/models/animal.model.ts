
export interface IEntity {
    id: number;
    getId(): number;
    setId(id: number): void;
}


export interface INombrable {
    nombre: string;
    getNombre(): string;
    setNombre(nombre: string): void;
}


export interface IValidatable {
    isValid(): boolean;
    validar(): { valido: boolean; errores: string[] };
}


export abstract class BaseEntity implements IEntity {
    protected _id: number = 0;
    protected _fechaCreacion: Date = new Date();

    constructor(id: number = 0) {
        this._id = id;
    }

    // Getter encapsulado
    get id(): number {
        return this._id;
    }

    // Setter encapsulado con validación
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

    // Método abstracto que las subclases deben implementar
    abstract getIdentificador(): string;

    // Método común a todas las entidades
    protected getFechaCreacion(): Date {
        return this._fechaCreacion;
    }
}

/**
 * Clase abstracta Animal - padre de Mascota
 * Demuestra herencia y polimorfismo
 */
export abstract class Animal extends BaseEntity implements INombrable {
    protected _nombre: string = '';
    protected _especie: string = '';
    protected _raza?: string;
    protected _edad?: number;

    constructor(nombre: string, especie: string, id: number = 0) {
        super(id);
        this._nombre = nombre;
        this._especie = especie;
    }

    // Getters y Setters con encapsulamiento
    get nombre(): string {
        return this._nombre;
    }

    set nombre(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('El nombre no puede estar vacío');
        }
        this._nombre = value.trim();
    }

    get especie(): string {
        return this._especie;
    }

    set especie(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('La especie no puede estar vacía');
        }
        this._especie = value.trim();
    }

    get raza(): string | undefined {
        return this._raza;
    }

    set raza(value: string | undefined) {
        this._raza = value?.trim();
    }

    get edad(): number | undefined {
        return this._edad;
    }

    set edad(value: number | undefined) {
        if (value !== undefined && value < 0) {
            throw new Error('La edad no puede ser negativa');
        }
        this._edad = value;
    }

    // Métodos getter/setter de la interfaz
    getNombre(): string {
        return this._nombre;
    }

    setNombre(nombre: string): void {
        this.nombre = nombre;
    }

    // Método abstracto - cada subclase lo implementa diferente (polimorfismo)
    abstract getSonido(): string;
    abstract getTipoAnimal(): string;

    // Método que puede ser sobreescrito por las subclases
    getDescripcion(): string {
        return `${this._nombre} es un ${this._especie} de ${this._edad || 'edad desconocida'} años`;
    }

    // Método con implementación por defecto que puede ser sobreescrito
    saludar(): string {
        return `Hola, soy ${this._nombre}!`;
    }
}
