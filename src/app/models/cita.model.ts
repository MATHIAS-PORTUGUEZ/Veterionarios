import { Mascota } from './mascota.model';
import { Veterinario, OpcionMotivo } from './veterinario.model';

export type EstadoCita = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

export interface Cita {
    id: number;
    mascota: Mascota;
    fecha: Date;
    motivoId?: string;
    motivoLabel?: string;
    motivo?: string; // Compatibilidad hacia atrás
    veterinario?: Veterinario;
    estado: EstadoCita;
}
