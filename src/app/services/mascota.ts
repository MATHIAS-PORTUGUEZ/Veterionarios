import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MascotaService {
  // in-memory storage for demonstration
  private mascotas: import('../models/mascota.model').Mascota[] = [];

  constructor() { }

  getAll() {
    return this.mascotas;
  }

  add(mascota: import('../models/mascota.model').Mascota) {
    mascota.id = this.mascotas.length + 1;
    this.mascotas.push(mascota);
  }
}

