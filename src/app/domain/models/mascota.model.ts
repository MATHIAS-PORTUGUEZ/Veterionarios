import { BaseEntity, IValidatable, INombrable } from './animal.model';

/**
 * Tipo de especies de mascotas
 */
export type EspecieMascota = 'perro' | 'gato' | 'ave' | 'otro';

/**
 * Interfaz para datos del dueño
 */
export interface IDueno {
    id: number;
    nombre: string;
    telefono?: string;
    email?: string;
}

/**
 * Clase Mascota - representa una mascota en el sistema
 * Demuestra: Herencia, Encapsulamiento, Implementación de interfaces
 */
export class Mascota extends BaseEntity implements INombrable, IValidatable {
    private _nombre: string = '';
    private _especie: string = '';
    private _raza?: string;
    private _edad?: number;
    private _peso?: number;
    private _dueno?: IDueno;

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

    get peso(): number | undefined {
        return this._peso;
    }

    set peso(value: number | undefined) {
        if (value !== undefined && value <= 0) {
            throw new Error('El peso debe ser mayor a 0');
        }
        this._peso = value;
    }

    get dueno(): IDueno | undefined {
        return this._dueno;
    }

    set dueno(value: IDueno | undefined) {
        this._dueno = value;
    }

    // Métodos de la interfaz INombrable
    getNombre(): string {
        return this._nombre;
    }

    setNombre(nombre: string): void {
        this.nombre = nombre;
    }

    // Métodos de la interfaz IValidatable
    isValid(): boolean {
        return this.validar().valido;
    }

    validar(): { valido: boolean; errores: string[] } {
        const errores: string[] = [];

        if (!this._nombre || this._nombre.trim().length === 0) {
            errores.push('El nombre es requerido');
        }

        if (!this._especie || this._especie.trim().length === 0) {
            errores.push('La especie es requerida');
        }

        if (this._edad !== undefined && this._edad < 0) {
            errores.push('La edad no puede ser negativa');
        }

        if (this._peso !== undefined && this._peso <= 0) {
            errores.push('El peso debe ser mayor a 0');
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }

    // Métodos abstractos implementados
    getIdentificador(): string {
        return `MASCOTA-${this._id.toString().padStart(4, '0')}`;
    }

    // Métodos específicos de la clase
    getSonido(): string {
        switch (this._especie.toLowerCase()) {
            case 'perro':
                return 'Guau guau!';
            case 'gato':
                return 'Miau miau!';
            case 'ave':
                return 'Pío pío!';
            default:
                return 'Sonido desconocido';
        }
    }

    getTipoAnimal(): string {
        return this._especie;
    }

    getDescripcion(): string {
        return `${this._nombre} es un ${this._especie}${this._raza ? ' ' + this._raza : ''} de ${this._edad || 'edad desconocida'} años`;
    }

    saludar(): string {
        return `Hola, soy ${this._nombre}! ${this.getSonido()}`;
    }

    // Métodos estáticos Factory
    static crearPerro(nombre: string, raza: string, edad: number): Mascota {
        const perro = new Mascota(nombre, 'perro');
        perro.raza = raza;
        perro.edad = edad;
        return perro;
    }

    static crearGato(nombre: string, raza: string, edad: number): Mascota {
        const gato = new Mascota(nombre, 'gato');
        gato.raza = raza;
        gato.edad = edad;
        return gato;
    }

    static crearDesdeDatos(datos: {
        nombre: string;
        especie: string;
        raza?: string;
        edad?: number;
        peso?: number;
        dueno?: IDueno;
        id?: number;
    }): Mascota {
        const mascota = new Mascota(datos.nombre, datos.especie, datos.id || 0);
        mascota.raza = datos.raza;
        mascota.edad = datos.edad;
        mascota.peso = datos.peso;
        mascota.dueno = datos.dueno;
        return mascota;
    }
}
