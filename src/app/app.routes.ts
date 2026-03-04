import { Routes } from '@angular/router';
import { RegistroMascota } from './mascotas/registro-mascota/registro-mascota';
import { AgendaCitas } from './citas/agenda-citas/agenda-citas';
import { HistorialMascota } from './mascotas/historial-mascota/historial-mascota';
import { DemoOOComponent } from './demo-oo/demo-oo';

export const routes: Routes = [
    { path: '', redirectTo: 'registro', pathMatch: 'full' },
    { path: 'registro', component: RegistroMascota },
    { path: 'agenda', component: AgendaCitas },
    { path: 'historial', component: HistorialMascota },
    { path: 'demo-poo', component: DemoOOComponent },
];
