const mercadopago = require('mercadopago');

// Configurar MercadoPago con el access token
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

async function createPaymentPreference(heroData) {
  try {
    const preference = {
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
      notification_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/webhook/mercadopago`,
      metadata: {
        heroName: heroData.heroName,
        heroAge: heroData.heroAge,
        superpower: heroData.superpower,
        villain: heroData.villain
      }
    };

    const response = await mercadopago.preferences.create(preference );
    return {
      success: true,
      preferenceId: response.body.id,
      initPoint: response.body.init_point
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
    const payment = await mercadopago.payment.findById(paymentId);
    return {
      success: true,
      status: payment.body.status,
      paymentData: payment.body
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
