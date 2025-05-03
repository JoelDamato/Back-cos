const { MercadoPagoConfig, Preference } = require("mercadopago");

const mercadopago = new MercadoPagoConfig({
  accessToken: "APP_USR-5813778036291996-020519-622848c08b860a400ad1b5982139e6bc-77989682"
});

const crearLinkDePago = async (req, res) => {
  const { title, price } = req.body;

  if (!title || !price) {
    return res.status(400).json({ error: "Faltan datos: title y price son obligatorios" });
  }

  try {
    const preferenceClient = new Preference(mercadopago);

    const response = await preferenceClient.create({
      body: {
        items: [
          {
            title,
            description: "Pago generado desde el sitio",
            unit_price: parseFloat(price),
            currency_id: "ARS",
            quantity: 1
          }
        ],
        back_urls: {
          success: "https://tupagina.com/success",
          failure: "https://tupagina.com/failure",
          pending: "https://tupagina.com/pending"
        },
        auto_return: "approved"
      }
    });

    return res.status(200).json({ link: response.init_point });
  } catch (error) {
    console.error("Error al crear link de pago:", error);
    res.status(500).json({ error: "No se pudo generar el link de pago" });
  }
};

module.exports = crearLinkDePago;
