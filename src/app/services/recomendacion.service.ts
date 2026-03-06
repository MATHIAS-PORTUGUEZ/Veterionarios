import { Injectable } from '@angular/core';
import {
    Veterinario,
    VETERINARIOS,
    EspecialidadVeterinario
} from '../models/veterinario.model';

/**
 * Servicio de recomendaciones de veterinarios
 * Proporciona recomendaciones basadas en el motivo de la consulta
 */
@Injectable({
    providedIn: 'root'
})
export class RecomendacionService {

    /**
     * Obtiene un veterinario recomendado según el motivo de la cita
     * @param motivoId - ID del motivo de la cita
     * @returns Veterinario recomendado o el primero disponible si no hay coincidencia exacta
     */
    obtenerVeterinarioRecomendado(motivoId: string): Veterinario | undefined {
        // Mapear motivoId a especialidad
        const especialidadRequerida = this.obtenerEspecialidadPorMotivo(motivoId);

        // Buscar veterinario de la especialidad requerida
        const vetEspecializado = VETERINARIOS.find(
            v => v.especialidad === especialidadRequerida && v.disponible
        );

        // Si hay un especializado disponible, retornarlo
        if (vetEspecializado) {
            return vetEspecializado;
        }

        // Si no hay especializado, buscar cualquier veterinario disponible
        return VETERINARIOS.find(v => v.disponible);
    }

    /**
     * Obtiene la especialidad requerida según el motivo
     */
    private obtenerEspecialidadPorMotivo(motivoId: string): EspecialidadVeterinario {
        const mapeo: Record<string, EspecialidadVeterinario> = {
            'cirugia': 'cirugia',
            'anemia': 'nutricion',
            'vacunacion': 'vacunacion',
            'revision': 'general',
            'dermatologia': 'dermatologia',
            'digestivo': 'gastroenterologia',
            'cardiologico': 'cardiologia',
            'otro': 'general'
        };

        return mapeo[motivoId] || 'general';
    }

    /**
     * Obtiene todos los veterinarios disponibles
     */
    getVeterinarios(): Veterinario[] {
        return VETERINARIOS.filter(v => v.disponible);
    }

    /**
     * Obtiene veterinarians por especialidad
     */
    getVeterinariosPorEspecialidad(especialidad: EspecialidadVeterinario): Veterinario[] {
        return VETERINARIOS.filter(v => v.especialidad === especialidad && v.disponible);
    }

    /**
     * Obtiene la descripción de una especialidad
     */
    getDescripcionEspecialidad(especialidad: EspecialidadVeterinario): string {
        const descripciones: Record<EspecialidadVeterinario, string> = {
            'cirugia': 'Especialista en cirugías generales y especializadas',
            'nutricion': 'Especialista en nutrición y problemas de sangre',
            'dermatologia': 'Especialista en problemas de piel y pelaje',
            'gastroenterologia': 'Especialista en problemas digestivos',
            'cardiologia': 'Especialista en problemas cardíacos',
            'vacunacion': 'Especialista en vacunación y medicina preventiva',
            'general': 'Médico veterinario general'
        };

        return descripciones[especialidad] || 'Especialista general';
    }
}

