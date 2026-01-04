# Ball Attack

## Interfaz alternativa
He eliminado los tres botones del juego y los he sustituido por una interfaz basada en **micrófono**.
El juego detecta **volumen** (para saber si hay sonido real) y la **frecuencia dominante** (FFT) para activar una de las 3 acciones.

## Input elegido y por qué
He elegido el micrófono porque es un input no convencional, accesible y expresivo.
Permite mapear 3 acciones con sonidos diferentes sin usar ratón, botones HTML ni teclado.

## Cómo se juega (controles)
1. Abre el juego y acepta permisos de micrófono.
2. Haz un sonido estable durante ~0.3–0.6s (según tu micro).
3. Rangos de frecuencia:
   - 🔴 ROJO: 150–450 Hz 
   - 🟢 VERDE: 450–900 Hz 
   - 🔵 AZUL: 900–2500 Hz 

La interfaz muestra en pantalla:
- Estado del micrófono (ON/OFF)
- Amp (volumen)
- Freq (frecuencia en Hz)
- Acción detectada (Detected)
- Cooldown (anti-spam)
- Barra de volumen y gráfico FFT

## Consejos de uso
- Si el micrófono es poco sensible, baja el umbral `ampThreshold`.
- Si dispara demasiado fácil, sube `stableNeeded` o `cooldownMs`.
- Para AZUL, el silbido suele funcionar mejor.

## Librerías / créditos
- p5.js
- p5.sound (AudioIn + FFT)
