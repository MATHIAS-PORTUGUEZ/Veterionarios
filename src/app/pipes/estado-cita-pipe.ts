import { Pipe, PipeTransform } from '@angular/core';
import { EstadoCita } from '../models/cita.model';

@Pipe({
  name: 'estadoCita',
  standalone: true,
})
export class EstadoCitaPipe implements PipeTransform {
  transform(value: EstadoCita): string {
    const estados: Record<EstadoCita, string> = {
      pendiente: 'Pendiente',
      confirmada: 'Confirmada',
      cancelada: 'Cancelada',
      completada: 'Completada',
    };
    return estados[value] || value;
  }
}
