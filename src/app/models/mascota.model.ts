export interface Dueno {
    id: number;
    nombre: string;
    telefono?: string;
    email?: string;
}

export interface Mascota {
    id: number;
    nombre: string;
    especie: string;
    raza?: string;
    edad?: number;
    dueno: Dueno;
}
