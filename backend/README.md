# VoyageAI — Backend API REST

API REST desarrollada con Spring Boot y MySQL para la plataforma de planificación
de viajes con inteligencia artificial **VoyageAI**.

---

## Tecnologías utilizadas

| Tecnología | Versión |
|---|---|
| Java | 21 |
| Spring Boot | 3.4.5 |
| Spring Data JPA | Incluido en Spring Boot |
| Spring Validation | Incluido en Spring Boot |
| MySQL | 8.x |
| Maven | 3.x |
| Lombok | Incluido en Spring Boot |
| Springdoc OpenAPI (Swagger) | 2.8.8 |

---

## Requisitos previos

Antes de ejecutar el proyecto asegúrate de tener instalado:

- Java 21 o superior
- Maven 3.x
- MySQL activo (WampServer, XAMPP o instalación directa)
- Postman, Insomnia o cualquier cliente HTTP para probar la API

---

## Configuración de la base de datos

**1. Inicia WampServer y accede a phpMyAdmin**
http://localhost/phpmyadmin

**2. Ejecuta el script SQL**

En la pestaña SQL de phpMyAdmin, ejecuta el archivo:
voyageai_db.sql

Este script crea la base de datos, las tablas y los datos de prueba.

---

## Configuración del proyecto

El archivo de configuración se encuentra en:
src/main/resources/application.properties

Ajusta las credenciales de MySQL si es necesario:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/voyageai_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=        # agrega tu contraseña si tienes una
```

> ⚠️ Nunca subas contraseñas reales a repositorios públicos.

---

## Instalación y ejecución

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/voyageai-backend.git

# 2. Entra a la carpeta
cd voyageai-backend

# 3. Compila e instala dependencias
./mvnw clean install

# 4. Ejecuta el servidor
./mvnw spring-boot:run
```

El servidor queda disponible en:
http://localhost:8080

---

## Documentación Swagger

Con el servidor corriendo, accede a la documentación interactiva en:
http://localhost:8080/swagger-ui.html

---

## Estructura del proyecto
src/main/java/com/voyageai/backend/

├── config/

│   ├── CorsConfig.java

│   └── SwaggerConfig.java

├── controller/

│   ├── DestinoController.java

│   ├── FeatureController.java

│   ├── PlanController.java

│   ├── StatController.java

│   └── UsuarioController.java

├── entity/

│   ├── Destino.java

│   ├── Feature.java

│   ├── Plan.java

│   ├── PlanFeature.java

│   ├── Stat.java

│   └── Usuario.java

├── exception/

│   ├── GlobalExceptionHandler.java

│   └── ResourceNotFoundException.java

├── repository/

│   ├── DestinoRepository.java

│   ├── FeatureRepository.java

│   ├── PlanFeatureRepository.java

│   ├── PlanRepository.java

│   ├── StatRepository.java

│   └── UsuarioRepository.java

└── service/

├── DestinoService.java

├── FeatureService.java

├── PlanService.java

├── StatService.java

└── UsuarioService.java

---

## Endpoints disponibles

### Usuarios `/api/usuarios`

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/usuarios` | Obtener todos los usuarios |
| GET | `/api/usuarios/{id}` | Obtener usuario por ID |
| GET | `/api/usuarios/rol/{rol}` | Obtener usuarios por rol |
| POST | `/api/usuarios` | Registrar nuevo usuario |
| POST | `/api/usuarios/login` | Iniciar sesión |
| PUT | `/api/usuarios/{id}` | Actualizar usuario |
| DELETE | `/api/usuarios/{id}` | Eliminar usuario |

### Destinos `/api/destinos`

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/destinos` | Obtener todos los destinos |
| GET | `/api/destinos/{id}` | Obtener destino por ID |
| GET | `/api/destinos/buscar?nombre=tok` | Buscar destino por nombre |
| POST | `/api/destinos` | Crear nuevo destino |
| PUT | `/api/destinos/{id}` | Actualizar destino |
| DELETE | `/api/destinos/{id}` | Eliminar destino |

### Planes `/api/planes`

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/planes` | Obtener todos los planes |
| GET | `/api/planes/{id}` | Obtener plan por ID |
| POST | `/api/planes` | Crear nuevo plan |
| PUT | `/api/planes/{id}` | Actualizar plan |
| DELETE | `/api/planes/{id}` | Eliminar plan |

### Features `/api/features`

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/features` | Obtener todas las características |
| GET | `/api/features/{id}` | Obtener característica por ID |
| POST | `/api/features` | Crear característica |
| PUT | `/api/features/{id}` | Actualizar característica |
| DELETE | `/api/features/{id}` | Eliminar característica |

### Stats `/api/stats`

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/stats` | Obtener todas las estadísticas |
| GET | `/api/stats/hero` | Obtener estadísticas del Hero |
| GET | `/api/stats/{id}` | Obtener estadística por ID |
| POST | `/api/stats` | Crear estadística |
| PUT | `/api/stats/{id}` | Actualizar estadística |
| DELETE | `/api/stats/{id}` | Eliminar estadística |

---

## Ejemplos de solicitudes JSON

**Registrar usuario**
```json
POST /api/usuarios
{
  "nombre": "María López",
  "correo": "maria@gmail.com",
  "password": "maria123",
  "rol": "usuario",
  "avatar": "ML"
}
```

**Iniciar sesión**
```json
POST /api/usuarios/login
{
  "correo": "admin@voyageai.com",
  "password": "admin123"
}
```

**Crear destino**
```json
POST /api/destinos
{
  "imgKey": "paris",
  "name": "París, Francia",
  "place": "Europa Occidental",
  "price": "$1,100",
  "tags": "Romance,Arte",
  "descripcion": "La ciudad de la luz, el amor y la moda."
}
```

**Crear plan**
```json
POST /api/planes
{
  "name": "Corporativo",
  "monthlyPrice": 99,
  "annualDiscount": 20,
  "descripcion": "Para equipos y empresas viajeras.",
  "featured": false,
  "cta": "Contactar ventas"
}
```

---

## Credenciales de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| administrador | admin@voyageai.com | admin123 |
| usuario | carlos@gmail.com | carlos123 |
| usuario | laura@gmail.com | laura123 |

---

## Variables de entorno requeridas

Para producción se recomienda usar variables de entorno en lugar de valores directos:

| Variable | Descripción |
|---|---|
| `DB_URL` | URL de conexión a MySQL |
| `DB_USERNAME` | Usuario de la base de datos |
| `DB_PASSWORD` | Contraseña de la base de datos |

---

## Códigos de respuesta HTTP

| Código | Significado |
|---|---|
| 200 | Solicitud procesada correctamente |
| 201 | Registro creado correctamente |
| 204 | Operación completada sin contenido |
| 400 | Datos enviados incorrectamente |
| 404 | Recurso no encontrado |
| 409 | Conflicto con información existente |
| 500 | Error interno del servidor |
