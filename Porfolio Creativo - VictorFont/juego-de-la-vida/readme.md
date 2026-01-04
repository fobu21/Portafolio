# Juego de la Vida Cromático 

## Descripción general

Este proyecto es una reinterpretación visual y dinámica del **Juego de la Vida de Conway** implementado en **p5.js**.  
Además de reproducir el funcionamiento clásico del autómata celular, incorpora una estética cromática basada en la edad de las células, una interfaz organizada en paneles y un efecto de estela que realza los patrones emergentes.

---

## Características principales

### Lógica completa del Juego de la Vida
- Rejilla bidimensional de células vivas/muertas.
- Vecindad Moore (8 vecinos).
- Reglas de Conway: **B3/S23**.
- Alternativa opcional: **B36/S23** (tipo HighLife).
- Mundo toroidal: bordes conectados.

### Interfaz visual estructurada en tres columnas
1. **Panel izquierdo — Estado**
   - Muestra la generación, el estado (reproduciendo/pausado) y la regla activa.

2. **Centro — Simulación**
   - Área principal donde se dibuja el autómata.

3. **Panel derecho — Controles**
   - Explica los atajos de teclado y permite ajustar la velocidad (FPS).

---

## Variación creativa añadida

### Células cromáticas con edad
Cada célula viva aumenta su edad por generación.  
Su color evoluciona:

- Azul → célula joven  
- Rosa/magenta → célula vieja  

Esta idea hace visible la estabilidad y la historia del sistema.

### Efecto de estela
La simulación usa un fondo semitransparente para dejar un rastro suave del movimiento, creando una representación más fluida y artística.

### Interacción directa
- Dibujar vida con el ratón.
- Cambiar reglas con teclas.
- Ajustar velocidad a tiempo real.

---

## Controles

### Teclado
- **Espacio** — Pausar / Reanudar  
- **R** — Estado aleatorio  
- **C** — Limpiar mundo  
- **1** — Reglas Conway (B3/S23)  
- **2** — Variante (B36/S23)  

### Ratón
- **Clic o arrastrar** — Crear células vivas

### Velocidad
- Slider (1–30 FPS)

---

## Estructura del proyecto
/proyecto
│
├── index.html
├── styles.css
├── sketch.js
└── README.md


---

## Decisiones visuales y de diseño

- Paneles laterales con estilo uniforme y bordes suavizados.
- Simulación centrada visualmente.
- Tipografía clara y minimalista.
- No hay scroll en la página para mantener apariencia de aplicación interactiva.
- Estética basada en tonos fríos y magentas para contraste y legibilidad.

---

## Tecnologías utilizadas
- **p5.js** — Motor visual y lógica de simulación.  
- **HTML + CSS** — Interfaz y estructura.  
- **JavaScript** — Implementación del autómata celular.

---

## Inspiración y uso de IA
- Parte del diseño visual y la estructuración del proyecto se apoyó en herramientas de IA.
- El código se adaptó y refinó manualmente.
- Referencia conceptual: **Juego de la Vida de John Conway (1970)**.

---

## Cómo ejecutar el proyecto

1. Descarga o descomprime el contenido.
2. Abre `index.html` en un navegador moderno.
3. Interactúa con la simulación mediante teclado y ratón.

---

