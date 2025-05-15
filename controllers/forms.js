const Form = require("../models/Forms.js");
const crypto = require("crypto");
const fetch = require("node-fetch");

// 👉 Reemplazá estos valores o usá variables de entorno (.env)
const accessToken = "EAATxY5C3ow4BO3WqAacwbZCvLaqeZCnZA9ORSwjZCexn1xMZCEcXsxQd9vmQ9blZA0lipyh4P6S0yaZAS3BqDSFDzyfAo3sRM1egxEZAZBpcyAiGNFEWeyHgNUdAxEfPKJYm39nMc7TtlqnD1tbCMNPJTatzfSMgojv5MZAPMZAWcsRHPyRBkZCVqIC6iVTFZCZAitIwZDZD";
const pixelId = "1090267679795676";

// 🔐 Hashear datos como exige Meta
const hash = (value) => {
  return crypto.createHash("sha256").update(String(value).trim().toLowerCase()).digest("hex");
};

// 📤 Enviar evento Purchase a Meta
const enviarEventoCompraMeta = async ({ nombre, apellido, telefono, mail, pais, ciudad, sexo, ip, userAgent }) => {
  const url = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`;

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          fn: hash(nombre),
          ln: hash(apellido),
          ph: hash(telefono),
          em: hash(mail),
          ge: hash(sexo),
          ct: hash(ciudad),
          country: hash(pais),
          client_ip_address: ip,
          client_user_agent: userAgent
        },
        custom_data: {
          currency: "USD",
          value: 197 // 💲 Valor del curso
        }
      }
    ]
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    console.log("✅ Evento de compra enviado a Meta:", result);
  } catch (err) {
    console.error("❌ Error al enviar evento a Meta:", err);
  }
};

// 🧠 Guardar Formulario y atribuir a Meta
const guardarForm = async (req, res) => {
  const { email } = req.body;

  try {
    const yaExiste = await Form.findOne({ email });
    if (yaExiste) return res.status(409).json({ message: "Ya completaste este formulario" });

    const nuevo = new Form(req.body);
    await nuevo.save();

    // 👀 Obtener IP y User Agent del navegador
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    // Enviar evento de compra a Meta
    await enviarEventoCompraMeta({ ...req.body, ip, userAgent });

    res.status(200).json({ message: "Formulario guardado correctamente" });
  } catch (err) {
    console.error("Error al guardar form:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🧾 Obtener formulario por email
const obtenerForm = async (req, res) => {
  const { email } = req.query;

  try {
    const form = await Form.findOne({ email });
    if (!form) return res.status(200).json({ firmado: false });

    res.status(200).json({ firmado: true, form });
  } catch (err) {
    console.error("Error al obtener form:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  guardarForm,
  obtenerForm
};
