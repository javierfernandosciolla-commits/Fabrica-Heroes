const mercadopago = require('mercadopago');

// Inicializar MercadoPago con el access token
const client = new mercadopago.MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

const payment = new mercadopago.Payment(client);
const preference = new mercadopago.Preference(client);

async function createPaymentPreference(heroData) {
  try {
    const preferenceData = {
      items: [
        {
          title: `Aventura Completa - ${heroData.heroName}`,
          description: `Historia personalizada del héroe ${heroData.heroName}`,
          quantity: 1,
          currency_id: 'ARS',
          unit_price: parseInt(process.env.STORY_PRICE_ARS || '1000')
        }
      ],
      payer: {
        email: heroData.email || 'cliente@example.com'
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success`,
        failure: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/failure`,
        pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pending`
      },
      auto_return: 'approved',
      notification_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/webhook/mercadopago`
    };

    const response = await preference.create({ body: preferenceData } );
    return {
      success: true,
      preferenceId: response.id,
      initPoint: response.init_point
    };
  } catch (error) {
    console.error('Error creating payment preference:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function verifyPayment(paymentId) {
  try {
    const response = await payment.get(paymentId);
    return {
      success: true,
      status: response.status,
      paymentData: response
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  createPaymentPreference,
  verifyPayment
};
