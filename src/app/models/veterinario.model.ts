/**
 * Tipos de especialidades de veterinarios
 */
export type EspecialidadVeterinario =
    | 'cirugia'
    | 'nutricion'
    | 'dermatologia'
    | 'gastroenterologia'
    | 'cardiologia'
    | 'vacunacion'
    | 'general';

/**
 * Interfaz para datos de un veterinario
 */
export interface Veterinario {
    id: number;
    nombre: string;
    especialidad: EspecialidadVeterinario;
    telefono?: string;
    email?: string;
    disponible: boolean;
}

/**
 * Opciones de motivo de cita con su especialidad correspondiente
 */
export interface OpcionMotivo {
    id: string;
    label: string;
    especialidadRequerida: EspecialidadVeterinario;
}

/**
 * Lista de opciones de motivo predefinidas
 */
export const MOTIVOS_CITA: OpcionMotivo[] = [
    { id: 'cirugia', label: 'Operación/Cirugía', especialidadRequerida: 'cirugia' },
    { id: 'anemia', label: 'Anemia/Problemas de sangre', especialidadRequerida: 'nutricion' },
    { id: 'vacunacion', label: 'Vacunación', especialidadRequerida: 'vacunacion' },
    { id: 'revision', label: 'Revisión general', especialidadRequerida: 'general' },
    { id: 'dermatologia', label: 'Problemas dermatológicos', especialidadRequerida: 'dermatologia' },
    { id: 'digestivo', label: 'Problemas digestivos', especialidadRequerida: 'gastroenterologia' },
    { id: 'cardiologico', label: 'Problemas cardíacos', especialidadRequerida: 'cardiologia' },
    { id: 'otro', label: 'Otro', especialidadRequerida: 'general' }
];

/**
 * Lista de veterinarios disponibles
 */
export const VETERINARIOS: Veterinario[] = [
    {
        id: 1,
        nombre: 'Dr. Carlos Mendoza',
        especialidad: 'cirugia',
        telefono: '555-1001',
        email: 'carlos.mendoza@clinica.com',
        disponible: true
    },
    {
        id: 2,
        nombre: 'Dra. Ana López',
        especialidad: 'nutricion',
        telefono: '555-1002',
        email: 'ana.lopez@clinica.com',
        disponible: true
    },
    {
        id: 3,
        nombre: 'Dr. Roberto Sánchez',
        especialidad: 'vacunacion',
        telefono: '555-1003',
        email: 'roberto.sanchez@clinica.com',
        disponible: true
    },
    {
        id: 4,
        nombre: 'Dra. María García',
        especialidad: 'dermatologia',
        telefono: '555-1004',
        email: 'maria.garcia@clinica.com',
        disponible: true
    },
    {
        id: 5,
        nombre: 'Dr. Luis Martínez',
        especialidad: 'gastroenterologia',
        telefono: '555-1005',
        email: 'luis.martinez@clinica.com',
        disponible: true
    },
    {
        id: 6,
        nombre: 'Dra. Patricia Johnson',
        especialidad: 'cardiologia',
        telefono: '555-1006',
        email: 'patricia.johnson@clinica.com',
        disponible: true
    },
    {
        id: 7,
        nombre: 'Dr. Juan Pérez',
        especialidad: 'general',
        telefono: '555-1007',
        email: 'juan.perez@clinica.com',
        disponible: true
    }
];

