# 📋 Guía de Uso - Sistema de Verificación de Identidad KYC

## ✅ Instalación y Ejecución

### 1. Instalación
```bash
npm install
```

### 2. Ejecución del Pipeline

#### Caso 1: Usuario Válido (APROBADO)
```bash
npm run start:dev -- --test-case=./data/synthetic_user_01.json
```
**Resultado esperado:** `HABILITADA`

#### Caso 2: Documento Inválido (RECHAZADO)
```bash
npm run start:dev -- --test-case=./data/synthetic_user_02_rechazo.json
```
**Resultado esperado:** `RECHAZADA` (Checksum inválido)

#### Caso 3: Coincidencia PEP (DERIVADA A HUMANO)
```bash
npm run start:dev -- --test-case=./data/synthetic_user_03_pep.json
```
**Resultado esperado:** `DERIVADA_A_HUMANO` (HITL - Human-In-The-Loop)

### 3. Ejecución por Defecto
```bash
npm start
```
Ejecuta automáticamente: `./data/synthetic_user_01.json`

---

## 🏗️ Arquitectura del Sistema

### 3 Subagentes Orquestados:

1. **doc-verifier (Haiku)**
   - Extrae datos de la Cédula de Identidad
   - Valida checksum Módulo 11 uruguayo
   - Inspecciona autenticidad documental

2. **compliance-checker (Haiku)**
   - Verifica biometría facial (similitud %)
   - Prueba de vida (video/selfie)
   - Búsqueda en listas PEP y Sanciones

3. **risk-evaluator (Opus)**
   - Orquesta decisión final
   - Aplica reglas de HITL (Human-In-The-Loop)
   - Ejecuta acciones de alta/rechazo/derivación

---

## 📊 Flujo de Decisión

```
[Entrada: Imágenes + Datos]
    ↓
[doc-verifier] → Validar documento
    ↓
¿Checksum válido?
    ├→ NO → RECHAZADA ✗
    └→ SÍ
        ↓
    [compliance-checker] → Validar biometría y listas
        ↓
    [risk-evaluator] → Decisión final
        ├→ HABILITADA ✅ (todos OK)
        ├→ RECHAZADA ✗ (sanciones)
        └→ DERIVADA_A_HUMANO 👤 (HITL)
```

---

## 🔐 Datos Sintéticos Utilizados

Todos los test cases utilizan **datos sintéticos** en cumplimiento con:
- Ley N° 18.331 de Uruguay (Protección de Datos Personales)
- AGENTS.md - Regla: "Uso Exclusivo de Datos Sintéticos"

---

## 📁 Estructura de Archivos

```
verificacion-identidad-uy/
├── index.js                          # Pipeline principal
├── test.js                           # Suite de pruebas
├── package.json                      # Dependencias
├── README.md                         # Este archivo
├── AGENTS.md                         # Definición de arquitectura
├── CLAUDE.md                         # Guía para asistentes
├── data/
│   ├── synthetic_user_01.json       # Caso: Usuario Válido
│   ├── synthetic_user_02_rechazo.json # Caso: Documento Inválido
│   ├── synthetic_user_03_pep.json   # Caso: Coincidencia PEP
│   └── resultado_*.json             # Outputs generados
└── .claude/
    └── agents/
        ├── doc-verifier.md
        ├── compliance-checker.md
        └── risk-evaluator.md
```

---

## 🎯 Criterios de Aprobación

### ✅ HABILITADA
- ✓ Checksum válido (Módulo 11)
- ✓ Inspección visual OK
- ✓ Biometría ≥ 85%
- ✓ Sin coincidencias PEP
- ✓ Sin sanciones

### ✗ RECHAZADA
- ✗ Checksum inválido
- ✗ Documento vencido
- ✗ Coincidencia en sanciones

### 👤 DERIVADA_A_HUMANO (HITL)
- ⚠ Biometría 70-84% (ambigua)
- ⚠ Coincidencia PEP parcial
- ⚠ Inconsistencias menores
- ⚠ Dudas en lectura visual

---

## 🧪 Validación Módulo 11 Uruguayo

El algoritmo implementado:
```javascript
const pesos = [3, 2, 9, 8, 7, 6, 5, 4];
suma = Σ(dígito[i] × peso[i]) para i=0 a 6
residuo = suma % 11
dígito_verificador = residuo === 0 ? 0 : 11 - residuo
```

**Ejemplo:**
- Cédula: `12345678`
- Dígitos 1-7: `1234567`
- Checksum: `8` ← Posición [7]

---

## 📞 Contacto de Soporte

Para consultas sobre:
- Framework de subagentes → Equipo de Arquitectura
- Normativas Ley N° 18.331 → Equipo de Cumplimiento Institucional
- Biometría y seguridad → Equipo de Seguridad

---

**Última actualización:** 2026-09-14  
**Versión:** 1.0.0
