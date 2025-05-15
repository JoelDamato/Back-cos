const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  telefono: { type: String, required: true },
  mail: { type: String, required: true },
  pais: { type: String, required: true },
  ciudad: { type: String, required: true },
  sexo: { type: String, enum: ["M", "F"], required: true },
  gananciaPromedio: { type: String, required: true },
  horasTrabajo: { type: String, required: true },
  empleados: { type: String, required: true },
  redSocial: { type: String, required: true },
  diasLibres: { type: String, required: true },
  anioEgreso: { type: String, required: true },
  email: { type: String, required: true },
  aceptoCondiciones: { type: Boolean, default: false },
  firmaDigital: { type: String, required: true }, // base64
  contrato: { type: String, required: true }, // ✅ NUEVO CAMPO para guardar el contrato generado
  fechaRegistro: { type: Date, default: Date.now },
  contratoPdfBase64: { type: String } // PDF en base64 (opcional)

});

module.exports = mongoose.model("Form", FormSchema);
