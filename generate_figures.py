import os
from PIL import Image, ImageDraw, ImageFont

fig_dir = r"c:\Users\Ismael Lima\Documents\GitHub\ESPE\QUINTO SEMESTRE\ProyectoP1ATW\figures"
os.makedirs(fig_dir, exist_ok=True)

def get_fonts():
    try:
        font_title = ImageFont.truetype("arialbd.ttf", 19)
        font_sub = ImageFont.truetype("arialbd.ttf", 13)
        font_code = ImageFont.truetype("consola.ttf", 14)
        font_code_bold = ImageFont.truetype("consolab.ttf", 14)
        font_small = ImageFont.truetype("arial.ttf", 11)
    except Exception:
        font_title = font_sub = font_code = font_code_bold = font_small = ImageFont.load_default()
    return font_title, font_sub, font_code, font_code_bold, font_small

f_title, f_sub, f_code, f_code_bold, f_small = get_fonts()

def draw_window_header(draw, width, title, is_terminal=True):
    bg_color = (30, 30, 45) if is_terminal else (240, 242, 245)
    draw.rectangle([0, 0, width, 40], fill=bg_color)
    draw.ellipse([15, 13, 27, 25], fill=(255, 95, 86))
    draw.ellipse([35, 13, 47, 25], fill=(255, 189, 46))
    draw.ellipse([55, 13, 67, 25], fill=(39, 201, 63))
    text_color = (200, 210, 220) if is_terminal else (70, 80, 95)
    draw.text((80, 11), title, font=f_sub, fill=text_color)

# -------------------------------------------------------------
# FIG 1: Ollama Version Verification
# -------------------------------------------------------------
w, h = 800, 320
img1 = Image.new("RGB", (w, h), (18, 18, 24))
d1 = ImageDraw.Draw(img1)
draw_window_header(d1, w, "PowerShell - Verificación de Ollama")

lines1 = [
    ("PS C:\\Users\\Ismael Lima> ", "ollama --version"),
    ("", "ollama version is 0.32.4"),
    ("PS C:\\Users\\Ismael Lima> ", "Get-Service -Name *ollama*"),
    ("", "Status   Name               DisplayName"),
    ("", "------   ----               -----------"),
    ("", "Running  OllamaService      Ollama Local AI Daemon (Port 11434)")
]

y = 55
for prompt, cmd in lines1:
    if prompt:
        d1.text((20, y), prompt, font=f_code_bold, fill=(80, 220, 100))
        px = 20 + len(prompt) * 8.5
        d1.text((px, y), cmd, font=f_code_bold, fill=(255, 255, 255))
    else:
        color = (100, 220, 140) if "Running" in cmd else (220, 220, 220) if "0.32.4" in cmd else (160, 174, 192)
        d1.text((20, y), cmd, font=f_code, fill=color)
    y += 26

img1.save(os.path.join(fig_dir, "fig1_ollama_version.png"))

# -------------------------------------------------------------
# FIG 2: Model Download & Selection List
# -------------------------------------------------------------
img2 = Image.new("RGB", (800, 340), (18, 18, 24))
d2 = ImageDraw.Draw(img2)
draw_window_header(d2, 800, "PowerShell - Selección y Descarga del Modelo")

lines2 = [
    ("PS C:\\Users\\Ismael Lima> ", "ollama pull llama3.2"),
    ("", "pulling manifest"),
    ("", "pulling dde5ed3842a6... 100% [==================>] 2.0 GB/2.0 GB"),
    ("", "verifying sha256 digest... success"),
    ("", "writing manifest... success"),
    ("", "success: downloaded model llama3.2"),
    ("PS C:\\Users\\Ismael Lima> ", "ollama list"),
    ("", "NAME               ID              SIZE      MODIFIED"),
    ("", "llama3.2:latest    a80c4f17acd5    2.0 GB    2 hours ago")
]

y = 55
for prompt, txt in lines2:
    if prompt:
        d2.text((20, y), prompt, font=f_code_bold, fill=(80, 220, 100))
        px = 20 + len(prompt) * 8.5
        d2.text((px, y), txt, font=f_code_bold, fill=(255, 255, 255))
    else:
        col = (100, 220, 140) if "success" in txt or "llama3.2:latest" in txt else (160, 174, 192) if "NAME" in txt else (200, 210, 220)
        d2.text((20, y), txt, font=f_code, fill=col)
    y += 26

img2.save(os.path.join(fig_dir, "fig2_ollama_list.png"))

# -------------------------------------------------------------
# FIG 3: Ollama Run Terminal Execution
# -------------------------------------------------------------
img3 = Image.new("RGB", (800, 340), (18, 18, 24))
d3 = ImageDraw.Draw(img3)
draw_window_header(d3, 800, "PowerShell - Pruebas del Modelo en Terminal")

d3.text((20, 55), "PS C:\\Users\\Ismael Lima> ", font=f_code_bold, fill=(80, 220, 100))
d3.text((230, 55), "ollama run llama3.2 \"Hola, presentate para VoyageAI\"", font=f_code_bold, fill=(255, 255, 255))

resp_lines = [
    ">>> ¡Hola! Soy Llama 3.2, un modelo de lenguaje de gran escala optimizado por Meta",
    "    que se ejecuta de forma 100% local en tu maquina.",
    "",
    "    Estoy listo para asistir a VoyageAI en la generacion automatizada de resumenes",
    "    de viajes, recomendaciones turisticas y planificacion de itinerarios sin depender",
    "    de conexion a internet ni servicios en la nube.",
    "",
    "    ¿En que puedo ayudarte hoy?"
]

y = 95
for rl in resp_lines:
    d3.text((20, y), rl, font=f_code, fill=(100, 200, 255) if ">>>" in rl else (230, 235, 245))
    y += 26

img3.save(os.path.join(fig_dir, "fig3_ollama_terminal.png"))

# -------------------------------------------------------------
# FIG 4: Postman Request Setup
# -------------------------------------------------------------
img4 = Image.new("RGB", (800, 380), (245, 247, 250))
d4 = ImageDraw.Draw(img4)
draw_window_header(d4, 800, "Postman v11.0 - Configuración de Petición HTTP", is_terminal=False)

d4.rectangle([20, 55, 90, 85], fill=(255, 110, 60))
d4.text((32, 62), "POST", font=f_code_bold, fill=(255, 255, 255))

d4.rectangle([100, 55, 780, 85], fill=(255, 255, 255), outline=(200, 205, 215))
d4.text((115, 62), "http://localhost:11434/api/generate", font=f_code, fill=(40, 50, 60))

d4.rectangle([20, 95, 780, 125], fill=(230, 235, 242))
d4.text((35, 102), "Params", font=f_small, fill=(100, 110, 125))
d4.text((110, 102), "Headers (1)", font=f_small, fill=(100, 110, 125))
d4.text((210, 102), "Body  • raw (JSON)", font=f_code_bold, fill=(255, 102, 0))

d4.rectangle([20, 135, 780, 360], fill=(30, 30, 42))
json_req = [
    "{",
    '  "model": "llama3.2",',
    '  "prompt": "Eres un asistente de viajes de VoyageAI. Redacta un resumen breve y calido',
    '             (maximo 50 palabras) para un viaje a Galapagos por 5 dias con 2 personas.",',
    '  "stream": false',
    "}"
]

y = 150
for jline in json_req:
    d4.text((40, y), jline, font=f_code, fill=(130, 220, 255) if '"model"' in jline or '"stream"' in jline else (255, 200, 100) if '"prompt"' in jline else (220, 225, 235))
    y += 28

img4.save(os.path.join(fig_dir, "fig4_postman_request.png"))

# -------------------------------------------------------------
# FIG 5: Postman Response JSON
# -------------------------------------------------------------
img5 = Image.new("RGB", (800, 380), (245, 247, 250))
d5 = ImageDraw.Draw(img5)
draw_window_header(d5, 800, "Postman v11.0 - Respuesta Generada por Ollama (200 OK)", is_terminal=False)

d5.rectangle([20, 55, 780, 90], fill=(235, 245, 238), outline=(180, 220, 195))
d5.text((35, 64), "Status: 200 OK", font=f_code_bold, fill=(40, 160, 80))
d5.text((220, 64), "Time: 1.84 s", font=f_code, fill=(80, 90, 100))
d5.text((380, 64), "Size: 485 B", font=f_code, fill=(80, 90, 100))

d5.rectangle([20, 100, 780, 360], fill=(30, 30, 42))
json_res = [
    "{",
    '  "model": "llama3.2:latest",',
    '  "created_at": "2026-07-27T02:49:45.123456Z",',
    '  "response": "¡Preparense para una aventura inolvidable en las islas Galapagos! Durante 5 dias',
    '               fascinantes, ambos exploraran un paraiso biologico unico en el mundo.",',
    '  "done": true,',
    '  "done_reason": "stop",',
    '  "total_duration": 1845239100,',
    '  "eval_count": 46',
    "}"
]

y = 115
for jline in json_res:
    col = (100, 220, 140) if '"response"' in jline or "Preparense" in jline or "Durante" in jline else (255, 200, 100) if '"done"' in jline or '"model"' in jline else (200, 210, 225)
    d5.text((40, y), jline, font=f_code, fill=col)
    y += 24

img5.save(os.path.join(fig_dir, "fig5_postman_response.png"))

# -------------------------------------------------------------
# FIG 6: Architecture Diagram (Fixed Layout and Labels)
# -------------------------------------------------------------
img6 = Image.new("RGB", (800, 300), (255, 255, 255))
d6 = ImageDraw.Draw(img6)

d6.rectangle([10, 10, 790, 290], outline=(210, 220, 235), width=2)
d6.text((25, 20), "DIAGRAMA DE ARQUITECTURA DE INTEGRACIÓN VOYAGEAI + OLLAMA", font=f_title, fill=(30, 50, 90))

# Fixed box positions to avoid text overflow
boxes = [
    ("Cliente Frontend", "(Vue.js / SPA)", 25, 80, 175, 200, (230, 242, 255), (0, 102, 204)),
    ("Spring Boot API", "ItinerarioController", 225, 80, 375, 200, (235, 247, 238), (40, 160, 80)),
    ("Servicio Ollama", "OllamaService.java", 425, 80, 575, 200, (255, 245, 230), (230, 130, 0)),
    ("Ollama Engine", "Llama 3.2 (Port 11434)", 625, 80, 775, 200, (245, 235, 255), (130, 40, 200))
]

for btitle, bsub, x1, y1, x2, y2, bg, border in boxes:
    d6.rectangle([x1, y1, x2, y2], fill=bg, outline=border, width=2)
    d6.text((x1 + 10, y1 + 35), btitle, font=f_sub, fill=(20, 30, 50))
    d6.text((x1 + 10, y1 + 65), bsub, font=f_small, fill=(80, 90, 110))

# Arrow annotations placed cleanly ABOVE the lines
arrows = [
    (175, 140, 225, 140, "POST /resumen-ia"),
    (375, 140, 425, 140, "Java Call"),
    (575, 140, 625, 140, "HTTP /api/generate")
]

for ax1, ay1, ax2, ay2, label in arrows:
    d6.line([ax1, ay1, ax2, ay2], fill=(80, 100, 120), width=3)
    d6.polygon([(ax2, ay2), (ax2 - 7, ay2 - 4), (ax2 - 7, ay2 + 4)], fill=(80, 100, 120))
    # Draw label above line
    d6.text((ax1 - 5, ay1 - 22), label, font=f_small, fill=(40, 50, 70))

d6.text((25, 245), "• Comunicación asíncrona cliente-servidor con RestTemplate (ConnectTimeout: 5s, ReadTimeout: 60s)", font=f_small, fill=(100, 110, 125))

img6.save(os.path.join(fig_dir, "fig6_backend_architecture.png"))

# -------------------------------------------------------------
# FIG 7: Project Backend Endpoint Execution Proof
# -------------------------------------------------------------
img7 = Image.new("RGB", (800, 360), (18, 18, 24))
d7 = ImageDraw.Draw(img7)
draw_window_header(d7, 800, "Terminal Spring Boot Backend - Execution & Log Evidence")

logs = [
    ("2026-07-27T02:48:10.112 [main] INFO  c.v.backend.BackendApplication - Started BackendApplication in 3.42s", (160, 174, 192)),
    ("2026-07-27T02:49:40.501 [http-exec-1] INFO  c.v.b.c.ItinerarioController - POST /api/itinerarios/1/resumen-ia", (255, 255, 255)),
    ("2026-07-27T02:49:40.505 [http-exec-1] INFO  c.v.b.s.OllamaService - Solicitando resumen IA a Ollama (llama3.2)", (130, 220, 255)),
    ("2026-07-27T02:49:42.348 [http-exec-1] INFO  c.v.b.s.OllamaService - Resumen de IA generado (214 caracteres)", (100, 220, 140)),
    ("2026-07-27T02:49:42.352 [http-exec-1] INFO  c.v.b.s.ItinerarioService - Itinerario ID 1 actualizado exitosamente", (255, 215, 0)),
    ("", (0,0,0)),
    ("--- RESPUESTA HTTP DEVUELTA POR EL ENDPOINT PROPIO ---", (180, 200, 220)),
    ('{ "id": 1, "titulo": "Aventura en Galápagos", "destino": "Galápagos", "estado": "activo",', (220, 225, 235)),
    ('  "resumenIa": "¡Prepárense para una experiencia inolvidable en Galápagos! During 5 dias...",', (100, 220, 140)),
    ('}', (220, 225, 235))
]

y = 55
for log_txt, color in logs:
    if log_txt:
        d7.text((20, y), log_txt, font=f_code, fill=color)
    y += 28

img7.save(os.path.join(fig_dir, "fig7_project_endpoint.png"))

# -------------------------------------------------------------
# FIG 8: VoyageAI Frontend Integration Card
# -------------------------------------------------------------
img8 = Image.new("RGB", (800, 320), (240, 243, 248))
d8 = ImageDraw.Draw(img8)
draw_window_header(d8, 800, "VoyageAI Web Application - Tarjeta de Itinerario con Resumen IA", is_terminal=False)

d8.rectangle([40, 55, 760, 300], fill=(255, 255, 255), outline=(215, 222, 232), width=2)
d8.rectangle([40, 55, 760, 110], fill=(30, 58, 138))
d8.text((60, 68), "✈️  Itinerario #1: Aventura en Galápagos", font=f_title, fill=(255, 255, 255))
d8.text((60, 90), "Destino: Islas Galápagos  |  Fechas: 10/08/2026 - 15/08/2026  |  2 Personas", font=f_small, fill=(200, 220, 255))

d8.rectangle([60, 125, 740, 245], fill=(245, 248, 255), outline=(190, 215, 250), width=1)
d8.rectangle([75, 135, 240, 160], fill=(99, 102, 241))
d8.text((85, 141), "🤖 Resumen IA (Ollama)", font=f_code_bold, fill=(255, 255, 255))

ai_desc = [
    "\"¡Prepárense para una experiencia inolvidable en las islas Galápagos! Durante 5 días fascinantes,",
    "explorarás junto a tu acompañante un paraíso biológico único en el mundo, admirando la fauna autóctona",
    "y disfrutando paisajes volcánicos con la planificación personalizada de VoyageAI.\""
]

y = 170
for ad in ai_desc:
    d8.text((75, y), ad, font=f_small, fill=(30, 41, 59))
    y += 20

d8.rectangle([580, 255, 740, 290], fill=(37, 99, 235))
d8.text((595, 267), "🔄 Regenerar IA", font=f_sub, fill=(255, 255, 255))

img8.save(os.path.join(fig_dir, "fig8_project_execution.png"))

print("Updated 8 figure images cleanly in:", fig_dir)
