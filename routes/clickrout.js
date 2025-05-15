const express = require("express");
const router = express.Router();

const registrarClick = require("../controllers/Clickcontroller.js");
const obtenerTodosLosClicks = require("../controllers/getclick.js");
const registrarProgreso = require("../controllers/progrescontroller.js");
const obtenerProgresoPorUsuario = require("../controllers/getprogres.js");
const crearLinkDePago = require("../controllers/paymentmp.js");
const { guardarForm, obtenerForm } = require("../controllers/forms.js");



// forms
router.post("/form", guardarForm);
router.get("/form", obtenerForm);

// Clicks
router.post("/clicks", registrarClick);
router.get("/getclicks", obtenerTodosLosClicks);

// Progreso
router.post("/progreso", registrarProgreso);
router.get("/progresoget", obtenerProgresoPorUsuario);

router.post("/generar-link", crearLinkDePago);

module.exports = router;
