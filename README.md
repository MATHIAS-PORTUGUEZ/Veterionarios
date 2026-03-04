#  Sistema de Gestión de Clínica Veterinaria

Aplicación web desarrollada con **Angular 21** y **TypeScript** para digitalizar el proceso de atención de una clínica veterinaria. Este proyecto permite registrar mascotas, agendar citas y consultar el historial médico de cada animals.

##  Características principales

 **Registro de mascota y dueños** - Formulario reactivo con validaciones tipadas
 **Agenda de citas** - Agendar y visualizar citas disponibles
 **Historial de atención** - Consultar el historial médico por mascota
 **Pipes personalizados** - Formateo de fechas y estados de cita
 **Directivas personalizadas** - Resalte visual de citas próximas
 **Arquitectura modular** - Separación de responsabilidades con servicios
 **TypeScript tipado** - Interfaces, clases y funciones bien tipadas
 **Diseño responsive** - Compatible con escritorio y dispositivos móviles
 **Componentes reutilizables** - Estructura escalable y mantenible

##  Estructura del proyecto

```
src/
├── app/
│   ├── mascotas/
│   │   ├── registro-mascota/      # Formulario de registro
│   │   └── historial-mascota/     # Vista de historial
│   ├── citas/
│   │   └── agenda-citas/          # Agenda y agendar citas
│   ├── models/
│   │   ├── mascota.model.ts       # Interface de mascota
│   │   └── cita.model.ts          # Interface de cita
│   ├── services/
│   │   ├── mascota.ts             # Servicio de mascotas
│   │   └── cita.ts                # Servicio de citas
│   ├── pipes/
│   │   └── estado-cita-pipe.ts    # Pipe para formatear estados
│   ├── directives/
│   │   └── destaca-proxima.ts     # Directiva para destacar próximas citas
│   ├── shared/                    # Recursos compartidos
│   ├── app.ts                     # Componente raíz
│   └── app.routes.ts              # Rutas principales
├── styles.scss                    # Estilos globales
└── main.ts                        # Punto de entrada
```

##  Instalación y ejecución

### Prerrequisitos

- **Node.js 18+**
- **npm 10+** (viene con Node.js)

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <URL-repositorio>
   cd mi-proyecto
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   # O equivalentemente:
   ng serve
   ```

4. **Acceder a la aplicación**
   Abre tu navegador y ve a: `http://localhost:4200`

### Comandos disponibles

```bash
# Servidor de desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar pruebas unitarias
npm test

# Observar cambios y reconstruir automáticamente
npm run watch
```

##  Uso de la aplicación

### 1. Registrar mascota

1. Navega a: **Registrar mascota**
2. Completa el formulario con:
   - Nombre de la mascota
   - Especie (perro, gato, etc.)
   - Raza (opcional)
   - Edad (opcional)
   - Datos del dueño (nombre y teléfono)
3. Haz clic en **Guardar**

### 2. Agendar cita

1. Navega a: **Agenda**
2. Selecciona una mascota registrada
3. Confirma fecha y hora de la cita
4. Agrega un motivo (opcional)
5. Haz clic en **Agendar**
6. Visualiza las citas existentes en el listado

**Nota:** Las citas próximas (próximos 7 días) aparecen resaltadas con fondo amarillo.

### 3. Consultar historial

1. Navega a: **Historial**
2. Selecciona una mascota del dropdown
3. Haz clic en **Buscar**
4. Visualiza todas las citas y atenciones de esa mascota

##  Conceptos implementados

### TypeScript

- **Interfaces tipadas** (`Mascota`, `Cita`, `Dueno`, `EstadoCita`)
- **Tipos genericos** para servicios
- **Enums** para estados de cita
- **Funciones tipadas** en servicios
- **Validación de tipos** en tiempo de compilación

### Angular

- **Componentes standalone** - Componentes autosuficientes sin necesidad de módulos
- **Reactive Forms** - Formularios con validación robusta
- **Servicios inyectables** - Gestión del estado de la aplicación
- **Directives personalizadas** - Lógica de presentación reutilizable
- **Pipes personalizados** - Transformación de datos en templates
- **Routing** - Navegación entre vistas
- **Data binding** - Sincronización bidireccional de datos
- **Directivas estructurales** - `*ngFor`, `*ngIf` para iteración y condicionales

##  Tecnologías utilizadas

- **Angular 21.1.0** - Framework frontend moderno
- **TypeScript 5.9.2** - Lenguaje con tipos estáticos
- **RxJS 7.8.0** - Programación reactiva (para futuras mejoras)
- **SCSS** - Preprocesador CSS para estilos mantenibles
- **Node.js y npm** - Entorno de ejecución y gestor de paquetes

##  Ejemplos de código

### Interfaz tipada

```typescript
export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza?: string;
  edad?: number;
  dueno: Dueno;
}
```

### Servicio inyectable

```typescript
@Injectable({ providedIn: 'root' })
export class MascotaService {
  private mascotas: Mascota[] = [];

  getAll(): Mascota[] {
    return this.mascotas;
  }

  add(mascota: Mascota): void {
    mascota.id = this.mascotas.length + 1;
    this.mascotas.push(mascota);
  }
}
```

### Pipe personalizado

```typescript
@Pipe({ name: 'estadoCita', standalone: true })
export class EstadoCitaPipe implements PipeTransform {
  transform(value: EstadoCita): string {
    const estados: Record<EstadoCita, string> = {
      pendiente: 'Pendiente',
      confirmada: 'Confirmada',
      cancelada: 'Cancelada',
      completada: 'Completada',
    };
    return estados[value];
  }
}
```

### Directiva personalizada

```typescript
@Directive({ selector: '[appDestacaProxima]', standalone: true })
export class DestacaProxima implements OnInit {
  @Input() appDestacaProxima: Date | undefined;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.appDestacaProxima) {
      const ahora = new Date();
      const proximosCinco = new Date();
      proximosCinco.setDate(ahora.getDate() + 7);

      if (this.appDestacaProxima >= ahora && this.appDestacaProxima <= proximosCinco) {
        this.el.nativeElement.style.backgroundColor = '#fff3cd';
        this.el.nativeElement.style.border = '2px solid #ffc107';
      }
    }
  }
}
```

##  Pruebas

La aplicación incluye una estructura preparada para pruebas unitarias con Vitest. Ejecuta:

```bash
npm test
```

##  Responsive Design

La aplicación está optimizada para funcionar en:
-  Dispositivos móviles (320px+)
-  Tablets (768px+)
-  Desktops (1024px+)

##  Conocidos y mejoras futuras

- [ ] Integración con API REST backend
- [ ] Persistencia de datos en base de datos
- [ ] Autenticación y autorización
- [ ] Calendario interactivo mejorado
- [ ] Notificaciones de citas próximas
- [ ] Exportar historial a PDF
- [ ] Búsqueda y filtrado avanzado
- [ ] Fotos de mascotas

##  Soporte

Para reportes de bugs o sugerencias, crea un issue en el repositorio.

##  Licencia

Este proyecto está disponible bajo la licencia MIT.

---

**Desarrollado con  usando Angular y TypeScript**

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
