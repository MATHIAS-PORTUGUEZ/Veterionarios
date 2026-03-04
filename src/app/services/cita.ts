import { Injectable } from '@angular/core';
import { Cita } from '../models/cita.model';

@Injectable({
  providedIn: 'root',
})
export class CitaService {
  private citas: Cita[] = [];

  constructor() { }

  getAll(): Cita[] {
    return this.citas;
  }

  add(cita: Cita) {
    cita.id = this.citas.length + 1;
    this.citas.push(cita);
  }

  getByMascota(mascotaId: number): Cita[] {
    return this.citas.filter(c => c.mascota.id === mascotaId);
  }

  update(id: number, cita: Partial<Cita>) {
    const index = this.citas.findIndex(c => c.id === id);
    if (index >= 0) {
      this.citas[index] = { ...this.citas[index], ...cita };
    }
  }
}

