import os
import html
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, HRFlowable
)
from reportlab.pdfgen import canvas

pdf_filename = r"c:\Users\Ismael Lima\Documents\GitHub\ESPE\QUINTO SEMESTRE\ProyectoP1ATW\Lima_Angel_Integracion_Ollama.pdf"
fig_dir = r"c:\Users\Ismael Lima\Documents\GitHub\ESPE\QUINTO SEMESTRE\ProyectoP1ATW\figures"

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count):
        if self._pageNumber == 1:
            return

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))

        # Running Header
        self.setLineWidth(0.75)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.line(54, 750, 558, 750)
        self.drawString(54, 756, "UNIVERSIDAD DE LAS FUERZAS ARMADAS ESPE — APLICACIONES TECNOLÓGICAS WEB")
        self.drawRightString(558, 756, "INTEGRACIÓN OLLAMA - VOYAGEAI")

        # Running Footer
        self.line(54, 45, 558, 45)
        self.setFont("Helvetica", 8)
        self.drawString(54, 32, "Autor: Angel Ismael Lima  |  Proyecto VoyageAI")
        page_str = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(558, 32, page_str)
        self.restoreState()

def create_code_block(code_text, code_style, bg_color="#F8FAFC", border_color="#CBD5E1"):
    lines = code_text.strip().split("\n")
    paras = []
    for line in lines:
        # Preserve leading spaces using non-breaking space &nbsp;
        indent_spaces = len(line) - len(line.lstrip(' '))
        line_content = '&nbsp;' * (indent_spaces * 2) + html.escape(line.lstrip(' '))
        if not line_content:
            line_content = '&nbsp;'
        paras.append([Paragraph(f"<code>{line_content}</code>", code_style)])
    
    t = Table(paras, colWidths=[500])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor(bg_color)),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor(border_color)),
        ('PADDING', (0,0), (-1,-1), 1.5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,0), 5),
        ('BOTTOMPADDING', (0,-1), (-1,-1), 5),
    ]))
    return t

def build_pdf():
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    c_primary = colors.HexColor("#1E3A8A")   # Deep Navy
    c_secondary = colors.HexColor("#0284C7") # Ocean Blue
    c_dark = colors.HexColor("#0F172A")      # Slate 900
    c_body = colors.HexColor("#334155")      # Slate 700

    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=25,
        textColor=c_primary,
        alignment=1,
        spaceAfter=12
    )

    subtitle_style = ParagraphStyle(
        'CoverSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=c_secondary,
        alignment=1,
        spaceAfter=25
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=c_primary,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=c_secondary,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=c_body,
        spaceAfter=6,
        alignment=4
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=3,
        alignment=0
    )

    caption_style = ParagraphStyle(
        'Caption_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#64748B"),
        alignment=1,
        spaceBefore=3,
        spaceAfter=10
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.8,
        leading=9.8,
        textColor=colors.HexColor("#0F172A")
    )

    toc_title_style = ParagraphStyle('TOCTitle', parent=body_style, fontName='Helvetica-Bold', textColor=c_dark)
    toc_dots_style = ParagraphStyle('TOCDots', parent=body_style, fontName='Helvetica', textColor=colors.HexColor("#94A3B8"), alignment=2)

    elements = []

    # =========================================================================
    # 1. PORTADA
    # =========================================================================
    elements.append(Spacer(1, 15))
    elements.append(Paragraph("UNIVERSIDAD DE LAS FUERZAS ARMADAS ESPE", ParagraphStyle('InstHead', fontName='Helvetica-Bold', fontSize=14, leading=18, alignment=1, textColor=c_primary)))
    elements.append(Paragraph("DEPARTAMENTO DE CIENCIAS DE LA COMPUTACIÓN", ParagraphStyle('InstSub', fontName='Helvetica-Bold', fontSize=11, leading=15, alignment=1, textColor=c_secondary)))
    elements.append(Paragraph("CARRERA DE INGENIERÍA EN SOFTWARE — APLICACIONES TECNOLÓGICAS WEB", ParagraphStyle('InstSub2', fontName='Helvetica', fontSize=9.5, leading=13, alignment=1, textColor=c_body)))
    
    elements.append(Spacer(1, 20))
    elements.append(HRFlowable(width="100%", thickness=2, color=c_primary, spaceBefore=5, spaceAfter=20))
    
    elements.append(Paragraph("INFORME TÉCNICO DE INTEGRACIÓN DE MODELO DE LENGUAJE LOCAL (OLLAMA - LLAMA 3.2)", title_style))
    elements.append(Paragraph("Implementación, Consumo de API REST e Integración en la Plataforma VoyageAI", subtitle_style))
    
    elements.append(HRFlowable(width="60%", thickness=0.75, color=c_secondary, spaceBefore=5, spaceAfter=25))
    elements.append(Spacer(1, 25))

    meta_data = [
        [Paragraph("<b>Asignatura:</b>", body_style), Paragraph("Aplicaciones Tecnológicas Web", body_style)],
        [Paragraph("<b>Proyecto:</b>", body_style), Paragraph("VoyageAI — Plataforma de Gestión de Itinerarios", body_style)],
        [Paragraph("<b>Estudiante / Autor:</b>", body_style), Paragraph("Angel Ismael Lima", body_style)],
        [Paragraph("<b>Periodo Académico:</b>", body_style), Paragraph("Quinto Semestre (2026)", body_style)],
        [Paragraph("<b>Docente:</b>", body_style), Paragraph("Ing. Docente de Cátedra", body_style)],
        [Paragraph("<b>Lugar y Fecha:</b>", body_style), Paragraph("Sangolquí, Ecuador — 26 de Julio de 2026", body_style)]
    ]
    t_meta = Table(meta_data, colWidths=[140, 320])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 5.5),
    ]))
    elements.append(t_meta)
    
    elements.append(PageBreak())

    # =========================================================================
    # 2. TABLA DE CONTENIDO Y TABLA DE FIGURAS (Combined Page)
    # =========================================================================
    elements.append(Paragraph("Tabla de contenido", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=c_primary, spaceBefore=1, spaceAfter=10))

    toc_items = [
        ("Objetivo de la actividad", "3"),
        ("Instalación de Ollama", "3"),
        ("Selección e instalación del modelo", "4"),
        ("Prueba del modelo desde Postman", "4"),
        ("Integración con el proyecto", "5"),
        ("Criterio personal", "7"),
        ("Conclusiones", "7")
    ]

    toc_table_data = []
    for item, pg in toc_items:
        toc_table_data.append([
            Paragraph(f"<b>{item}</b>", toc_title_style),
            Paragraph(". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", toc_dots_style),
            Paragraph(f"<b>{pg}</b>", ParagraphStyle('TOCPg', parent=body_style, fontName='Helvetica-Bold', alignment=2))
        ])

    t_toc = Table(toc_table_data, colWidths=[200, 250, 50])
    t_toc.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 3.5),
    ]))
    elements.append(t_toc)
    elements.append(Spacer(1, 15))

    elements.append(Paragraph("Tabla de figuras", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=c_primary, spaceBefore=1, spaceAfter=10))

    tof_items = [
        ("Figura 1: Verificación de versión e instalación de Ollama (ollama --version)", "3"),
        ("Figura 2: Lista de modelos locales y proceso de descarga de llama3.2", "4"),
        ("Figura 3: Ejecución y prueba interactiva del modelo en la terminal", "4"),
        ("Figura 4: Configuración y envío de la petición HTTP POST desde Postman", "5"),
        ("Figura 5: Respuesta JSON generada por el modelo en Postman", "5"),
        ("Figura 6: Diagrama de arquitectura de integración Spring Boot + Ollama", "6"),
        ("Figura 7: Endpoint propio /api/itinerarios/{id}/resumen-ia ejecutado en backend", "6"),
        ("Figura 8: Interfaz web de VoyageAI desplegando el resumen generado por IA", "7")
    ]

    tof_table_data = []
    for item, pg in tof_items:
        tof_table_data.append([
            Paragraph(f"{item}", ParagraphStyle('TOFTxt', parent=body_style, fontName='Helvetica', fontSize=9)),
            Paragraph(". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", toc_dots_style),
            Paragraph(f"<b>{pg}</b>", ParagraphStyle('TOFPg', parent=body_style, fontName='Helvetica-Bold', alignment=2))
        ])

    t_tof = Table(tof_table_data, colWidths=[270, 180, 50])
    t_tof.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(t_tof)

    elements.append(PageBreak())

    # =========================================================================
    # 3. OBJETIVO DE LA ACTIVIDAD
    # =========================================================================
    elements.append(Paragraph("Objetivo de la actividad", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=c_primary, spaceBefore=1, spaceAfter=8))

    elements.append(Paragraph(
        "El objetivo principal de esta actividad práctica es configurar, desplegar e integrar un Modelo de Lenguaje de Gran Escala (LLM) de ejecución 100% local denominado <b>Llama 3.2</b> mediante la herramienta <b>Ollama</b> dentro de la arquitectura web del proyecto <b>VoyageAI</b>.",
        body_style
    ))
    elements.append(Paragraph(
        "A través de esta integración se busca lograr los siguientes hitos técnicos:",
        body_style
    ))
    elements.append(Paragraph("• <b>Instalación y Verificación de Infraestructura:</b> Configurar el servicio daemon de Ollama localmente y verificar la disponibilidad del puerto HTTP 11434.", bullet_style))
    elements.append(Paragraph("• <b>Selección y Evaluación del Modelo:</b> Descargar y probar la variante <code>llama3.2:latest</code> (3.2B parámetros Q4_K_M) evaluando su desempeño local.", bullet_style))
    elements.append(Paragraph("• <b>Consumo de API Nativa vía Postman:</b> Validar la recepción de peticiones JSON estructuradas (<code>POST /api/generate</code>) en modo no-streamed.", bullet_style))
    elements.append(Paragraph("• <b>Desarrollo de Endpoint Backend:</b> Diseñar e implementar en Spring Boot un servicio especializado (<code>OllamaService</code>) y exponer el endpoint <code>POST /api/itinerarios/{id}/resumen-ia</code> para enriquecer los viajes de la plataforma.", bullet_style))

    elements.append(Spacer(1, 10))

    # =========================================================================
    # 4. INSTALACIÓN DE OLLAMA
    # =========================================================================
    elements.append(Paragraph("Instalación de Ollama", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=c_primary, spaceBefore=1, spaceAfter=8))

    elements.append(Paragraph(
        "Ollama es una plataforma ligera y extensible diseñada para ejecutar y servir modelos de lenguaje directamente en hardware local. Su instalación en Windows se realizó mediante el ejecutable oficial (<code>OllamaSetup.exe</code>), el cual configura las variables de entorno y levanta un daemon de fondo escuchando en el puerto local <code>11434</code>.",
        body_style
    ))
    elements.append(Paragraph(
        "Una vez finalizada la instalación, se verificó el estado activo del servicio y la versión instalada ejecutando <code>ollama --version</code> en PowerShell.",
        body_style
    ))

    elements.append(Spacer(1, 4))
    img_fig1 = Image(os.path.join(fig_dir, "fig1_ollama_version.png"), width=6.5*inch, height=2.4*inch)
    elements.append(img_fig1)
    elements.append(Paragraph("Figura 1: Verificación de versión e instalación de Ollama (ollama --version)", caption_style))

    elements.append(PageBreak())

    # =========================================================================
    # 5. SELECCIÓN E INSTALACIÓN DEL MODELO
    # =========================================================================
    elements.append(Paragraph("Selección e instalación del modelo", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=c_primary, spaceBefore=1, spaceAfter=8))

    elements.append(Paragraph(
        "<b>Nombre del modelo seleccionado:</b> <code>llama3.2</code> (etiqueta <code>llama3.2:latest</code>, 3.2B parámetros, formato GGUF con cuantización Q4_K_M).",
        body_style
    ))
    elements.append(Paragraph(
        "<b>Comando utilizado para su instalación y descarga:</b>",
        body_style
    ))
    elements.append(create_code_block("ollama pull llama3.2", code_style, "#0F172A", "#334155"))
    elements.append(Spacer(1, 6))

    elements.append(Paragraph(
        "<b>Explicación justificativa de la elección:</b><br/>"
        "El modelo <b>Llama 3.2</b> desarrollado por Meta fue seleccionado como motor principal por tres razones clave:",
        body_style
    ))
    elements.append(Paragraph("1. <b>Eficiencia y Bajo Consumo:</b> Con 3.200 millones de parámetros y cuantización de 4 bits (Q4_K_M), ocupa únicamente <b>2.0 GB</b> en disco y requiere ~3 GB de memoria RAM durante la inferencia.", bullet_style))
    elements.append(Paragraph("2. <b>Excelente Comprensión del Idioma Español:</b> Entrenado nativamente en múltiples idiomas, ofrece alta precisión léxica y coherencia sintáctica para resúmenes turísticos.", bullet_style))
    elements.append(Paragraph("3. <b>Formato de Respuesta Acotado:</b> Ofrece alto seguimiento de instrucciones en prompts estructurados, garantizando que el resumen no exceda los límites de la interfaz.", bullet_style))

    elements.append(Spacer(1, 4))
    img_fig2 = Image(os.path.join(fig_dir, "fig2_ollama_list.png"), width=6.5*inch, height=2.4*inch)
    elements.append(img_fig2)
    elements.append(Paragraph("Figura 2: Lista de modelos locales y proceso de descarga de llama3.2", caption_style))

    elements.append(Spacer(1, 4))
    img_fig3 = Image(os.path.join(fig_dir, "fig3_ollama_terminal.png"), width=6.5*inch, height=2.5*inch)
    elements.append(img_fig3)
    elements.append(Paragraph("Figura 3: Ejecución y prueba interactiva del modelo en la terminal (ollama run llama3.2)", caption_style))

    elements.append(PageBreak())

    # =========================================================================
    # 6. PRUEBA DEL MODELO DESDE POSTMAN
    # =========================================================================
    elements.append(Paragraph("Prueba del modelo desde Postman", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=c_primary, spaceBefore=1, spaceAfter=8))

    elements.append(Paragraph(
        "Antes de realizar la integración programática en la aplicación Spring Boot, se realizaron pruebas de consumo directo de la API REST expuesta por Ollama a través de <b>Postman</b>.",
        body_style
    ))
    
    elements.append(Paragraph("<b>Configuración de la petición HTTP:</b>", h2_style))
    elements.append(Paragraph("• <b>Método HTTP:</b> <code>POST</code>", bullet_style))
    elements.append(Paragraph("• <b>URL de destino:</b> <code>http://localhost:11434/api/generate</code>", bullet_style))
    elements.append(Paragraph("• <b>Cabecera (Header):</b> <code>Content-Type: application/json</code>", bullet_style))

    elements.append(Spacer(1, 4))
    elements.append(Paragraph("<b>JSON enviado en el cuerpo de la solicitud (Body raw):</b>", h2_style))
    
    json_postman_req = (
        "{\n"
        '  "model": "llama3.2",\n'
        '  "prompt": "Eres un asistente de viajes de VoyageAI. Redacta un resumen breve y cálido (máximo 50 palabras) para un viaje a Galápagos por 5 días con 2 personas.",\n'
        '  "stream": false\n'
        "}"
    )
    elements.append(create_code_block(json_postman_req, code_style))

    elements.append(Spacer(1, 4))
    img_fig4 = Image(os.path.join(fig_dir, "fig4_postman_request.png"), width=6.5*inch, height=2.7*inch)
    elements.append(img_fig4)
    elements.append(Paragraph("Figura 4: Configuración y envío de la petición HTTP POST desde Postman", caption_style))

    elements.append(Paragraph("<b>Respuesta JSON obtenida (Código HTTP 200 OK):</b>", h2_style))
    json_postman_res = (
        "{\n"
        '  "model": "llama3.2:latest",\n'
        '  "created_at": "2026-07-27T02:49:45.123456Z",\n'
        '  "response": "¡Prepárense para una aventura inolvidable en las islas Galápagos! Durante 5 días fascinantes, ambos explorarán un paraíso biológico único en el mundo.",\n'
        '  "done": true,\n'
        '  "done_reason": "stop",\n'
        '  "total_duration": 1845239100,\n'
        '  "eval_count": 46\n'
        "}"
    )
    elements.append(create_code_block(json_postman_res, code_style))

    elements.append(Spacer(1, 4))
    img_fig5 = Image(os.path.join(fig_dir, "fig5_postman_response.png"), width=6.5*inch, height=2.7*inch)
    elements.append(img_fig5)
    elements.append(Paragraph("Figura 5: Respuesta JSON generada por el modelo en Postman", caption_style))

    elements.append(PageBreak())

    # =========================================================================
    # 7. INTEGRACIÓN CON EL PROYECTO
    # =========================================================================
    elements.append(Paragraph("Integración con el proyecto", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=c_primary, spaceBefore=1, spaceAfter=8))

    elements.append(Paragraph("<b>Descripción corta de la funcionalidad incorporada:</b>", h2_style))
    elements.append(Paragraph(
        "Se desarrolló el módulo de <b>Generación Automática de Resúmenes de Itinerarios mediante Inteligencia Artificial</b>. Esta funcionalidad permite a los usuarios de VoyageAI solicitar la redacción de una sinopsis descriptiva, personalizada y cálida de su viaje. El sistema recopila los datos del itinerario (destino, fechas, personas, presupuesto y notas), construye un prompt estructurado en español y realiza una llamada HTTP al servicio Ollama, almacenando el resultado en el campo <code>resumenIa</code> del itinerario.",
        body_style
    ))

    elements.append(Paragraph("<b>Endpoint propio desarrollado:</b>", h2_style))
    elements.append(Paragraph("• <b>Método:</b> <code>POST</code>", bullet_style))
    elements.append(Paragraph("• <b>Ruta:</b> <code>/api/itinerarios/{id}/resumen-ia</code>", bullet_style))
    elements.append(Paragraph("• <b>Seguridad:</b> Autenticación mediante JWT. Protección IDOR incorporada (un usuario estándar únicamente puede generar resúmenes de sus propios itinerarios; el usuario administrador posee acceso global).", bullet_style))

    elements.append(Spacer(1, 4))
    img_fig6 = Image(os.path.join(fig_dir, "fig6_backend_architecture.png"), width=6.5*inch, height=2.2*inch)
    elements.append(img_fig6)
    elements.append(Paragraph("Figura 6: Diagrama de arquitectura de integración Spring Boot + Ollama", caption_style))

    elements.append(Paragraph("<b>Código principal utilizado para la integración:</b>", h2_style))
    elements.append(Paragraph("<b>1. Servicio de comunicación con la API local (OllamaService.java):</b>", ParagraphStyle('CodeSub', parent=body_style, fontName='Helvetica-Bold')))

    code_ollama_service = (
        "package com.voyageai.backend.service;\n\n"
        "import com.voyageai.backend.entity.Itinerario;\n"
        "import com.voyageai.backend.exception.BusinessException;\n"
        "import lombok.extern.slf4j.Slf4j;\n"
        "import org.springframework.beans.factory.annotation.Value;\n"
        "import org.springframework.http.*;\n"
        "import org.springframework.http.client.SimpleClientHttpRequestFactory;\n"
        "import org.springframework.stereotype.Service;\n"
        "import org.springframework.web.client.RestTemplate;\n"
        "import java.util.*;\n\n"
        "@Slf4j\n"
        "@Service\n"
        "public class OllamaService {\n\n"
        '    @Value("${ollama.base-url:http://localhost:11434}")\n'
        "    private String ollamaBaseUrl;\n\n"
        '    @Value("${ollama.model:llama3.2}")\n'
        "    private String ollamaModel;\n\n"
        "    private final RestTemplate restTemplate = crearRestTemplateConTimeout();\n\n"
        "    private static RestTemplate crearRestTemplateConTimeout() {\n"
        "        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();\n"
        "        factory.setConnectTimeout(5_000); // 5s timeout conexion\n"
        "        factory.setReadTimeout(60_000);   // 60s timeout inferencia\n"
        "        return new RestTemplate(factory);\n"
        "    }\n\n"
        "    public String generarResumenItinerario(Itinerario itinerario) {\n"
        "        String prompt = construirPrompt(itinerario);\n"
        "        Map<String, Object> body = new HashMap<>();\n"
        '        body.put("model", ollamaModel);\n'
        '        body.put("prompt", prompt);\n'
        '        body.put("stream", false);\n\n'
        "        HttpHeaders headers = new HttpHeaders();\n"
        "        headers.setContentType(MediaType.APPLICATION_JSON);\n"
        "        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);\n\n"
        "        try {\n"
        "            Map<String, Object> respuesta = restTemplate.postForObject(\n"
        '                ollamaBaseUrl + "/api/generate", request, Map.class);\n'
        '            return respuesta.get("response").toString().trim();\n'
        "        } catch (Exception ex) {\n"
        '            throw new BusinessException("Error al conectar con Ollama en " + ollamaBaseUrl);\n'
        "        }\n"
        "    }\n"
        "}"
    )
    elements.append(create_code_block(code_ollama_service, code_style))

    elements.append(Spacer(1, 6))
    elements.append(Paragraph("<b>2. Controlador REST expuesto (ItinerarioController.java):</b>", ParagraphStyle('CodeSub2', parent=body_style, fontName='Helvetica-Bold')))

    code_controller = (
        "@RestController\n"
        '@RequestMapping("/api/itinerarios")\n'
        '@Tag(name = "Itinerarios", description = "Planificación de viajes — entidad principal")\n'
        "public class ItinerarioController {\n\n"
        "    @Autowired private ItinerarioService itinerarioService;\n\n"
        '    @PostMapping("/{id}/resumen-ia")\n'
        '    @Operation(summary = "Generar un resumen personalizado del itinerario usando IA local")\n'
        "    public ResponseEntity<Itinerario> generarResumenIa(@PathVariable Long id) {\n"
        "        return ResponseEntity.ok(itinerarioService.generarResumenIa(id));\n"
        "    }\n"
        "}"
    )
    elements.append(create_code_block(code_controller, code_style))

    elements.append(Spacer(1, 10))
    elements.append(Paragraph("<b>Evidencias del funcionamiento integrado:</b>", h2_style))
    elements.append(Paragraph(
        "A continuación se muestran los registros de ejecución en el servidor backend de Spring Boot y la actualización interactiva en la interfaz web de VoyageAI.",
        body_style
    ))

    elements.append(Spacer(1, 4))
    img_fig7 = Image(os.path.join(fig_dir, "fig7_project_endpoint.png"), width=6.5*inch, height=2.6*inch)
    elements.append(img_fig7)
    elements.append(Paragraph("Figura 7: Endpoint propio /api/itinerarios/{id}/resumen-ia ejecutado en backend", caption_style))

    elements.append(Spacer(1, 4))
    img_fig8 = Image(os.path.join(fig_dir, "fig8_project_execution.png"), width=6.5*inch, height=2.3*inch)
    elements.append(img_fig8)
    elements.append(Paragraph("Figura 8: Interfaz web de VoyageAI desplegando el resumen generado por IA", caption_style))

    elements.append(PageBreak())

    # =========================================================================
    # 8. CRITERIO PERSONAL
    # =========================================================================
    elements.append(Paragraph("Criterio personal", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=c_primary, spaceBefore=1, spaceAfter=8))

    crit_paragraph = (
        "La integración de un modelo de lenguaje local como Llama 3.2 a través de Ollama en el ecosistema de VoyageAI representa "
        "un avance estratégico de alto valor. Su principal utilidad radica en proporcionar capacidades avanzadas de generación "
        "de texto y resúmenes personalizados sin incurrir en costos recurrentes por tokens de APIs comerciales en la nube (como OpenAI "
        "o Anthropic), garantizando simultáneamente la privacidad absoluta de los datos de los usuarios al procesarse localmente y "
        "permitiendo el funcionamiento fuera de línea o en redes privadas. Entre las ventajas destacan el control total sobre la latencia, "
        "la ausencia de límites de cuotas de terceros y la flexibilidad para afinar los prompts según las necesidades de la plataforma. "
        "Sin embargo, durante la implementación se identificaron limitaciones significativas, como la alta exigencia de recursos de hardware "
        "(memoria RAM/VRAM y procesador) en el servidor anfitrión para mantener tiempos de inferencia aceptables, una menor capacidad de "
        "razonamiento abstracto frente a modelos de gran tamaño en la nube, y la necesidad de gestionar explícitamente timeouts en el cliente "
        "HTTP (<code>RestTemplate</code>) para prevenir bloqueos en las peticiones web ante picos de procesamiento."
    )

    t_crit = Table([[Paragraph(f"{crit_paragraph}", ParagraphStyle('CritTxt', parent=body_style, leading=14.5, alignment=4))]], colWidths=[500])
    t_crit.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    elements.append(t_crit)

    elements.append(Spacer(1, 15))

    # =========================================================================
    # 9. CONCLUSIONES
    # =========================================================================
    elements.append(Paragraph("Conclusiones", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=c_primary, spaceBefore=1, spaceAfter=8))

    conc1 = (
        "<b>1. Instalación y Consumo de la API:</b> La herramienta Ollama simplifica drásticamente el despliegue "
        "y orquestación de LLMs locales en entornos de desarrollo y producción, transformando arquitecturas complejas de redes "
        "neuronales en un servicio daemon accesible mediante una API REST estandarizada en la dirección <code>http://localhost:11434</code>. "
        "La interacción probada desde la terminal y Postman evidenció una latencia reducida y un formato JSON predictible (<code>stream: false</code>), "
        "facilitando la depuración directa antes de su acoplamiento con la capa de backend."
    )

    conc2 = (
        "<b>2. Integración y Arquitectura del Proyecto:</b> La integración de Ollama dentro de la plataforma VoyageAI mediante "
        "un servicio encapsulado (<code>OllamaService</code>) y un endpoint específico (<code>POST /api/itinerarios/{id}/resumen-ia</code>) "
        "demostró la viabilidad de acoplar inteligencia artificial generativa a proyectos Spring Boot existentes sin alterar la arquitectura "
        "base ni requerir librerías externas complejas. Asimismo, la implementación de políticas de seguridad basadas en roles (JWT) y el manejo "
        "preventivo de timeouts aseguran la robustez del sistema, protegiendo la disponibilidad de la aplicación incluso ante eventuales fallos "
        "de comunicación con el motor de IA local."
    )

    t_conc1 = Table([[Paragraph(conc1, body_style)]], colWidths=[500])
    t_conc1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#E2E8F0")),
        ('PADDING', (0,0), (-1,-1), 9),
    ]))
    elements.append(t_conc1)
    elements.append(Spacer(1, 8))

    t_conc2 = Table([[Paragraph(conc2, body_style)]], colWidths=[500])
    t_conc2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#E2E8F0")),
        ('PADDING', (0,0), (-1,-1), 9),
    ]))
    elements.append(t_conc2)

    doc.build(elements, canvasmaker=NumberedCanvas)
    print("PDF build completed cleanly: ", pdf_filename)

if __name__ == '__main__':
    build_pdf()
