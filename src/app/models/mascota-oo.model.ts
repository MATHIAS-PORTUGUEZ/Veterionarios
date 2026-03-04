import { Animal, IValidatable } from './animal.model';
import { Dueno } from './mascota.model';

export class Mascota extends Animal implements IValidatable {
    private _dueno?: Dueno;
    private _peso?: number;
    private _vacunas: string[] = [];
    private _enfermedadesCronicas: string[] = [];
    private _observaciones: string = '';

    constructor(
        nombre: string,
        especie: string,
        raza?: string,
        edad?: number,
        id: number = 0
    ) {
        super(nombre, especie, id);
        this._raza = raza;
        this._edad = edad;
    }

    get dueno(): Dueno | undefined {
        return this._dueno;
    }

    set dueno(value: Dueno | undefined) {
        this._dueno = value;
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

    get vacunas(): string[] {
        return [...this._vacunas];
    }

    get enfermedadesCronicas(): string[] {
        return [...this._enfermedadesCronicas];
    }

    get observaciones(): string {
        return this._observaciones;
    }

    set observaciones(value: string) {
        this._observaciones = value;
    }

    getSonido(): string {
        const especie = this.especie.toLowerCase();
        if (especie.includes('perro')) return 'Guau guau!';
        if (especie.includes('gato')) return 'Miau!';
        if (especie.includes('ave')) return 'Pío pío!';
        return '...';
    }

    getTipoAnimal(): string {
        return 'Mascota';
    }

    override getDescripcion(): string {
        let desc = super.getDescripcion();
        if (this._dueno) {
            desc += `, pertenece a ${this._dueno.nombre}`;
        }
        return desc;
    }

    agregarVacuna(vacuna: string): void {
        if (vacuna && !this._vacunas.includes(vacuna)) {
            this._vacunas.push(vacuna);
        }
    }

    eliminarVacuna(vacuna: string): void {
        const index = this._vacunas.indexOf(vacuna);
        if (index > -1) {
            this._vacunas.splice(index, 1);
        }
    }

    agregarEnfermedad(enfermedad: string): void {
        if (enfermedad && !this._enfermedadesCronicas.includes(enfermedad)) {
            this._enfermedadesCronicas.push(enfermedad);
        }
    }

    isValid(): boolean {
        return this.validar().valido;
    }

    validar(): { valido: boolean; errores: string[] } {
        const errores: string[] = [];

        if (!this.nombre || this.nombre.trim().length === 0) {
            errores.push('El nombre es requerido');
        }

        if (!this.especie || this.especie.trim().length === 0) {
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

    override saludar(): string {
        return `${super.saludar()} Soy una mascota!`;
    }

    static crearPerro(nombre: string, raza: string, edad: number): Mascota {
        return new Mascota(nombre, 'Perro', raza, edad);
    }

    static crearGato(nombre: string, raza: string, edad: number): Mascota {
        return new Mascota(nombre, 'Gato', raza, edad);
    }

    getIdentificador(): string {
        return `MASCOTA-${this.id}`;
    }
}
