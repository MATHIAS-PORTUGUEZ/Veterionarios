import { Mascota } from './mascota.model';

export type EstadoCita = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

export interface Cita {
    id: number;
    mascota: Mascota;
    fecha: Date;
    motivo?: string;
    estado: EstadoCita;
}
