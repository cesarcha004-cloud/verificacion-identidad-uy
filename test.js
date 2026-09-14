const fs = require('fs');
const path = require('path');

console.log("\n" + "=".repeat(70));
console.log("🧪 SUITE DE PRUEBAS - SISTEMA DE VERIFICACIÓN DE IDENTIDAD KYC");
console.log("=".repeat(70));

const testCases = [
  { file: './data/synthetic_user_01.json', name: 'Usuario Válido (APROBADO)' },
  { file: './data/synthetic_user_02_rechazo.json', name: 'Documento Inválido (RECHAZADO)' },
  { file: './data/synthetic_user_03_pep.json', name: 'Coincidencia PEP (DERIVADA A HUMANO)' }
];

testCases.forEach((testCase, index) => {
  console.log(`\n\n${'#'.repeat(70)}`);
  console.log(`TEST CASE ${index + 1}: ${testCase.name}`);
  console.log(`${'#'.repeat(70)}\n`);
  
  try {
    require('./index.js');
    // Nota: Ejecutar con: node index.js --test-case=./data/synthetic_user_XX.json
  } catch (error) {
    console.error(`Error ejecutando prueba: ${error.message}`);
  }
});

console.log("\n" + "=".repeat(70));
console.log("✅ SUITE DE PRUEBAS COMPLETADA");
console.log("=".repeat(70) + "\n");
