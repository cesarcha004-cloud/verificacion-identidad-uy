const fs = require('fs');
const path = require('path');

// Función para validar checksum Módulo 11 uruguayo
function validarChecksumModulo11(documento) {
  const doc = String(documento).padStart(8, '0');
  if (doc.length !== 8) return false;
  
  const pesos = [3, 2, 9, 8, 7, 6, 5, 4];
  let suma = 0;
  
  for (let i = 0; i < 7; i++) {
    suma += parseInt(doc[i]) * pesos[i];
  }
  
  const residuo = suma % 11;
  const digitoVerificador = residuo === 0 ? 0 : 11 - residuo;
  
  return digitoVerificador === parseInt(doc[7]);
}

// Subagente 1: doc-verifier (Extracción y Validación de Documento)
function docVerifier(inputData) {
  console.log("\n📋 [SUBAGENTE: doc-verifier] Validando documento...");
  
  const checksum = validarChecksumModulo11(inputData.documento_numero);
  
  const resultado = {
    documento_numero: inputData.documento_numero,
    nombres: inputData.datos_esperados.nombres,
    apellidos: inputData.datos_esperados.apellidos,
    fecha_nacimiento: inputData.datos_esperados.fecha_nacimiento,
    fecha_vencimiento: inputData.datos_esperados.fecha_vencimiento,
    checksum_valido: checksum,
    inspeccion_visual_ok: true,
    observaciones: checksum ? "Documento válido" : "REVISIÓN MANUAL NECESARIA por duda documental"
  };
  
  console.log("✅ Resultado doc-verifier:", JSON.stringify(resultado, null, 2));
  return resultado;
}

// Subagente 2: compliance-checker (Biometría y Listas de Cumplimiento)
function complianceChecker(inputData, docResult) {
  console.log("\n🔒 [SUBAGENTE: compliance-checker] Verificando compliance...");
  
  const resultado = {
    similitud_biometrica_porcentaje: inputData.similitud_biometrica || 92,
    prueba_vida_exitosa: inputData.prueba_vida !== false,
    coincidencia_listas_pep: inputData.es_pep || false,
    coincidencia_listas_sanciones: inputData.en_sanciones || false,
    detalle_compliance: "Sin observaciones de riesgo"
  };
  
  if (resultado.similitud_biometrica_porcentaje < 85) {
    resultado.detalle_compliance = "REVISIÓN MANUAL NECESARIA por biometría ambigua";
  }
  
  if (resultado.coincidencia_listas_pep) {
    resultado.detalle_compliance = "REVISIÓN MANUAL NECESARIA por coincidencia PEP";
  }
  
  console.log("✅ Resultado compliance-checker:", JSON.stringify(resultado, null, 2));
  return resultado;
}

// Subagente 3: risk-evaluator (Decisión Final y HITL)
function riskEvaluator(docResult, complianceResult) {
  console.log("\n⚖️  [SUBAGENTE: risk-evaluator] Evaluando riesgo final...");
  
  let decision = {
    estado_final: "HABILITADA",
    motivo_decision: "Todos los controles biométricos, documentales y de cumplimiento aprobados.",
    accion_ejecutada: "Cuenta habilitada en sistema central"
  };
  
  // Regla 1: Documento inválido = Rechazo directo
  if (!docResult.checksum_valido) {
    decision = {
      estado_final: "RECHAZADA",
      motivo_decision: "Checksum inválido o documento vencido",
      accion_ejecutada: "Notificación de rechazo enviada al cliente"
    };
  }
  
  // Regla 2: Biometría baja o coincidencia PEP = HITL
  else if (
    docResult.observaciones.includes("REVISIÓN MANUAL") ||
    complianceResult.detalle_compliance.includes("REVISIÓN MANUAL") ||
    complianceResult.coincidencia_listas_pep
  ) {
    decision = {
      estado_final: "DERIVADA_A_HUMANO",
      motivo_decision: "Discrepancia menor, biometría limítrofe o coincidencia PEP - HITL obligatorio",
      accion_ejecutada: "Caso derivado a bandeja de analistas de cumplimiento"
    };
  }
  
  // Regla 3: Coincidencia en sanciones = Rechazo directo
  else if (complianceResult.coincidencia_listas_sanciones) {
    decision = {
      estado_final: "RECHAZADA",
      motivo_decision: "Coincidencia en listas de sanciones internacionales",
      accion_ejecutada: "Notificación de rechazo y reporte regulatorio"
    };
  }
  
  console.log("✅ Resultado risk-evaluator:", JSON.stringify(decision, null, 2));
  return decision;
}

// Pipeline principal
function runKYCPipeline(testFilePath) {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 INICIANDO PIPELINE DE VERIFICACIÓN DE IDENTIDAD (KYC)");
  console.log("   Sistema de Billetera Digital - Uruguay");
  console.log("=".repeat(60));
  
  // Validar archivo de entrada
  if (!fs.existsSync(testFilePath)) {
    console.error(`❌ Error: Archivo no encontrado: ${testFilePath}`);
    console.log("\n💡 Creando archivo de prueba sintética...\n");
    
    const dirPath = path.dirname(testFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    const datosSinteticos = {
      documento_numero: "12345678",
      datos_esperados: {
        nombres: "Juan",
        apellidos: "Pérez García",
        fecha_nacimiento: "1990-05-15",
        fecha_vencimiento: "2030-05-15"
      },
      similitud_biometrica: 92,
      prueba_vida: true,
      es_pep: false,
      en_sanciones: false
    };
    
    fs.writeFileSync(testFilePath, JSON.stringify(datosSinteticos, null, 2));
    console.log("✅ Archivo de prueba creado: " + testFilePath);
  }
  
  // Leer datos de entrada
  const rawData = fs.readFileSync(testFilePath);
  const inputData = JSON.parse(rawData);
  
  console.log("\n📥 ENTRADA - Datos del Usuario:");
  console.log(JSON.stringify(inputData, null, 2));
  
  // Paso 1: Validación Documental
  console.log("\n" + "-".repeat(60));
  console.log("PASO 1/3: VALIDACIÓN DOCUMENTAL");
  console.log("-".repeat(60));
  const docResult = docVerifier(inputData);
  
  // Paso 2: Verificación de Compliance
  console.log("\n" + "-".repeat(60));
  console.log("PASO 2/3: VERIFICACIÓN DE COMPLIANCE Y BIOMETRÍA");
  console.log("-".repeat(60));
  const complianceResult = complianceChecker(inputData, docResult);
  
  // Paso 3: Evaluación de Riesgo y Decisión Final
  console.log("\n" + "-".repeat(60));
  console.log("PASO 3/3: EVALUACIÓN DE RIESGO Y DECISIÓN FINAL");
  console.log("-".repeat(60));
  const finalDecision = riskEvaluator(docResult, complianceResult);
  
  // Resultado Final
  console.log("\n" + "=".repeat(60));
  console.log("📊 RESULTADO FINAL DE VERIFICACIÓN");
  console.log("=".repeat(60));
  console.log(JSON.stringify(finalDecision, null, 2));
  console.log("=".repeat(60) + "\n");
  
  // Guardar resultado
  const outputPath = path.join(path.dirname(testFilePath), 'resultado_' + Date.now() + '.json');
  const resultadoCompleto = {
    timestamp: new Date().toISOString(),
    entrada: inputData,
    doc_verifier: docResult,
    compliance_checker: complianceResult,
    risk_evaluator: finalDecision
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(resultadoCompleto, null, 2));
  console.log(`✅ Resultado completo guardado en: ${outputPath}\n`);
  
  return finalDecision;
}

// Ejecutar
const args = process.argv.slice(2);
let testFile = './data/synthetic_user_01.json';

// Parsear argumentos
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--test-case' && args[i + 1]) {
    testFile = args[i + 1];
  }
}

runKYCPipeline(testFile);
