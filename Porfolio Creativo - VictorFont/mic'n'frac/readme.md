# Árbol Fractal Audio-Reactivo

## Título y descripción

**Título:** Árbol Fractal Audio-Reactivo  
**Descripción:**  
Este proyecto genera un árbol fractal recursivo en p5.js que reacciona en tiempo real al sonido capturado por el micrófono. El volumen y el contenido en frecuencias agudas del audio modifican la forma, el color y la complejidad del árbol, creando una pieza de arte generativo audiovisual.

---

## Tipo de fractal implementado

Se ha implementado un **árbol fractal recursivo** (tipo "fractal de árbol binario").  
Cada rama genera dos ramas hijas con un cierto ángulo respecto al tronco, y el proceso se repite hasta alcanzar una profundidad máxima de recursión.

---

## Parámetros del sonido y su efecto en el fractal

Se usan dos tipos de información del sonido:

1. **Amplitud / volumen global (p5.Amplitude):**
   - Se usa el valor suavizado `smoothedLevel`.
   - Controla:
     - **Longitud de las ramas:**  
       `lengthScale` se mapea desde el nivel de audio para que el árbol crezca más cuando el volumen es alto y se contraiga cuando el ambiente está silencioso.
     - **Profundidad de recursión (`maxDepth`):**  
       A más volumen, mayor profundidad de recursión (más niveles de ramas). Con poco volumen, el árbol es más simple y minimalista.
     - **Movimiento / sway:**  
       El árbol "oscila" ligeramente con el sonido, dándole sensación de vida.

2. **Energía en frecuencias agudas (p5.FFT con `getEnergy("treble")`):**
   - Controla:
     - **Ángulo de las ramas (`angleRange`):**  
       A más contenido en agudos, mayor apertura del árbol (ramas más abiertas).
     - **Tono de color (en espacio HSB):**  
       Se mapea la energía de agudos a un `hueBase` que va de tonos azulados a magentas, de modo que los sonidos más brillantes generan colores más vivos.

Además, cuando la profundidad de recursión es baja (ramas finales), se añaden pequeñas elipses a modo de **hojas** cuyo tamaño también crece con el nivel de audio.

---

## Técnicas y funciones de p5.sound utilizadas

- **Captura de audio:**
  - `new p5.AudioIn()` para acceder al micrófono.
  - `mic.start()` para iniciar la captura de sonido.
  - `userStartAudio()` para reanudar el contexto de audio al inicio (envuelve internamente `getAudioContext().resume()`).

- **Análisis de amplitud:**
  - `new p5.Amplitude()` para obtener el nivel global del audio.
  - `amp.setInput(mic)` para conectar el micrófono al analizador de amplitud.
  - `amp.smooth(0.9)` para suavizar las variaciones rápidas.
  - `amp.getLevel()` para obtener el nivel de volumen en cada frame.

- **Análisis en frecuencia:**
  - `new p5.FFT(0.8, 1024)` para calcular la transformada rápida de Fourier.
  - `fft.setInput(mic)` para usar el micrófono como fuente de entrada.
  - `fft.analyze()` para obtener el espectro completo.
  - `fft.getEnergy("treble")` para medir la energía en las frecuencias agudas.

---

## Interfaz de usuario

Se incluye una interfaz mínima dibujada directamente en el lienzo:

- Un pequeño **panel** en la esquina superior izquierda con:
  - **Texto**: "Nivel de audio".
  - **Barra de nivel** que se llena en función del volumen actual.
  - **Indicador de profundidad** de recursión (`maxDepth`), que se actualiza en tiempo real.

Además, mientras el micrófono no esté activado, aparece un mensaje centrado:

> "Haz clic o toca la pantalla para activar el micrófono"

---

## Decisiones estéticas y artísticas

- **Fondo oscuro y colores brillantes:**  
  El fondo casi negro permite que el árbol y sus colores en HSB resalten con mucha fuerza, recordando a una estética de visualizador musical o paisaje nocturno.

- **Uso de HSB para el color del árbol:**  
  El tono (`hueBase`) depende de las frecuencias agudas:  
  - Agudos bajos → tonos azul/verde.  
  - Agudos altos → tonos púrpura/magenta.  
  Esto crea una relación intuitiva entre timbre (brillo del sonido) y color.

- **Profundidad dinámica:**  
  La recursión cambia con el volumen, de modo que los sonidos más fuertes generan árboles más densos y complejos, mientras que el silencio simplifica la escena.

- **Movimiento sutil:**  
  El leve `sway` en las ramas evita una imagen estática y transmite sensación de organismo vivo que respira con el sonido.

---

## Reflexión / idea conceptual

La pieza explora la idea de un **"árbol sonoro"** que crece, se abre, cambia de color y vibra en función del entorno acústico. El fractal representa cómo pequeñas variaciones en una señal (el audio) pueden amplificarse visualmente en múltiples escalas, de forma similar a cómo en la naturaleza fenómenos simples generan estructuras complejas.

---

## Uso de IA o referencias externas

- El código y la documentación han sido creados con la ayuda de **ChatGPT (modelo GPT-5.1 Thinking de OpenAI)** como asistente de programación y de diseño audiovisual.
- Librerías externas utilizadas:
  - [p5.js](https://p5js.org/)
  - [p5.sound](https://p5js.org/reference/#/libraries/p5.sound)
