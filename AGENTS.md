# Definición de Agentes y Arquitectura del Proyecto (KYC Billetera Digital Uruguay)

## Objetivo
Automatizar y orquestar el proceso de verificación de identidad (Onboarding/KYC) para nuevos usuarios de una Billetera Digital en Uruguay, garantizando el cumplimiento regulatorio, la prevención de fraudes y el correcto derivamiento a revisión humana.

## Pasos del Proceso (8 Pasos)
1. Recepción de Evidencias: Carga de imágenes (Frente CI, Dorso CI, Selfie).
2. Extracción OCR de CI (Subagente doc-verifier): Lectura de Nombres, Apellidos, Documento y Vencimiento.
3. Validación Algorítmica Módulo 11: Verificación estricta del dígito verificador uruguayo.
4. Inspección de Autenticidad Documental (Subagente doc-verifier): Comprobación visual de validez y detección de alteraciones.
5. Verificación Biometría y Prueba de Vida (Subagente compliance-checker): Validación de coincidencia facial rostro vs. CI.
6. Chequeo de Listas de Cumplimiento (Subagente compliance-checker): Búsqueda en listas PEP (Personas Expuestas Políticamente) y Sanciones.
7. Evaluación de Riesgo y Decisión (Subagente risk-evaluator): Determinación de resolución: HABILITADA, RECHAZADA o DERIVADA.
8. Ejecución de Alta y Notificación: Actualización del sistema central y envío de resolución al usuario.

## Reglas y LÍMITES Estrictos
- Uso Exclusivo de Datos Sintéticos: Queda estrictamente prohibido utilizar datos de personas reales durante el desarrollo, pruebas y staging.
- Protección de Datos Personales (Ley N° 18.331 de Uruguay): Ningún dato de identificación o imagen biométrica debe registrarse en logs sin encriptación previa. No enviar datos a endpoints externos no autenticados.
- Archivos que NO se deben modificar/tocar:
  - src/legal/terms_uruguay.pdf
  - src/security/encryption_keys.pem
  - config/production_db.json
- Criterio de Seguridad (HITL): Si existe una discrepancia en el dígito verificador, discrepancia biométrica o duda razonable en la lectura visual, la cuenta DEBE ser derivada a revisión humana (Human-In-The-Loop).

## Cómo Ejecutar el Proyecto
npm install
npm run start:dev -- --test-case=synthetic_user_01.json
