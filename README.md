# Sistema de Verificación de Identidad (Billetera Digital Uruguay)

Este proyecto implementa un sistema automatizado mediante agentes de IA y flujos deterministas para procesar el alta y validación de usuarios (KYC) en compliance con la normativa financiera del Uruguay.

## Flujo General

[Cliente carga fotos] 
        |
        v
[Subagente: doc-verifier] --(Falla CI uruguaya)--> [Rechazo Directo]
        | (Éxito)
        v
[Subagente: compliance-checker]
        |
        v
[Subagente: risk-evaluator]
        +--- Directo -------> HABILITADA / RECHAZADA
        +--- Inconsistencia -> DERIVADA A HUMANO (HITL)

## Requisitos de Ejecución
- Node.js v18+ o Python 3.10+
- Credenciales simuladas para el entorno de desarrollo.

## Contacto de Soporte
Para consultas sobre el framework de subagentes o normativas asociadas a la Ley N° 18.331, contacte al equipo de Cumplimiento Institucional.
