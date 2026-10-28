# Bloque 05

## Resultado
- Qué añadí al proyecto: Aplicación cliente en `mobile/` usando Expo (SDK 54) y React Native. Se configuró `package.json`, `app.json`, `tsconfig.json`, `src/types.ts` y el componente raíz `App.tsx`.
- Ruta o pantalla comprobada: Interfaz web de Expo en local.
- Estado y respuesta observados: Se muestran dos tarjetas con los eventos locales (`EVT-101` y `EVT-102`). Al pulsar el botón cambia el estado reflejando la selección activa.

## Comprensión
- Recorrido del dato, explicado con mis palabras: Los eventos se definen en una constante local tipada y se gestionan en React con `useState`. Al hacer `.map()`, cada objeto se renderiza en una tarjeta (`View`, `Text`, `Pressable`). Al pulsar el botón `onPress`, se llama a `setSelected(item.id)`, lo que actualiza el estado y provoca un nuevo render mostrando el texto de selección correspondiente.
- Cambio guiado y resultado: Se comprobó cambiando la selección a `EVT-102` y el botón reflejó `Selección: EVT-102`. Después se restauró el comportamiento estándar donde cada tarjeta selecciona su propio ID.
- Error encontrado y cómo lo resolví: Ninguno; tras guardar los archivos de configuración, `npm install` instaló las dependencias fijadas y `npm run typecheck` pasó sin errores de TypeScript.

## Evidencias
- Captura o transcripción breve, sin credenciales:
  - Dos tarjetas renderizadas: `Neon Waves (Main Stage · 22:30)` y `Midnight Session (Club Stage · 23:45)`.
  - Botón: `Seleccionar EVT-101` -> Subtítulo: `Selección: EVT-101`.
  - Verificación estática: `npm run typecheck` finalizó con código 0.
- Limitaciones del ejercicio: Los datos provienen exclusivamente de un array en memoria dentro de `App.tsx`. Todavía no existe comunicación por red ni llamadas `fetch` contra el backend.
