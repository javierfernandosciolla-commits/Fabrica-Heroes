const mercadopago = require('mercadopago');

// Configurar MercadoPago
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

/**
 * Crea una preferencia de pago en MercadoPago
 */
async function createPaymentPreference(heroData, email) {
  try {
    console.log('💳 Creando preferencia de pago en MercadoPago...');

    const preference = {
      items: [
        {
          id: `story_${Date.now()}`,
          title: `Historia Personalizada: ${heroData.heroName}`,
          description: `Aventura mágica para ${heroData.heroName} (${heroData.heroAge} años) con superpoder de ${heroData.superpower}`,
          picture_url: 'https://via.placeholder.com/400x300/1e40af/ffffff?text=Fabrica+de+Heroes',
          category_id: 'art',
          quantity: 1,
          unit_price: parseFloat(process.env.STORY_PRICE_ARS || 1000)
        }
      ],
      payer: {
        email: email,
        name: heroData.heroName
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/success`,
        failure: `${process.env.FRONTEND_URL}/failure`,
        pending: `${process.env.FRONTEND_URL}/pending`
      },
      auto_return: 'approved',
      notification_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/payment/webhook`,
      external_reference: `story_${Date.now()}_${heroData.heroName}`,
      metadata: {
        heroName: heroData.heroName,
        heroAge: heroData.heroAge,
        superpower: heroData.superpower,
        villain: heroData.villain,
        userEmail: email
      }
    };

    const response = await mercadopago.preferences.create(preference);

    return {
      success: true,
      preferenceId: response.body.id,
      initPoint: response.body.init_point,
      sandboxInitPoint: response.body.sandbox_init_point
    };
  } catch (error) {
    console.error('Error creando preferencia de pago:', error);
    throw {
      status: 500,
      message: 'Error al crear preferencia de pago: ' + error.message
    };
  }
}

/**
 * Obtiene información de un pago
 */
async function getPaymentInfo(paymentId) {
  try {
    const response = await mercadopago.payment.findById(paymentId);
    return response.body;
  } catch (error) {
    console.error('Error obteniendo información del pago:', error);
    throw {
      status: 500,
      message: 'Error al obtener información del pago: ' + error.message
    };
  }
}

/**
 * Procesa el webhook de MercadoPago
 */
async function processWebhook(data) {
  try {
    console.log('🔔 Webhook recibido de MercadoPago:', data);

    if (data.type === 'payment') {
      const paymentId = data.data.id;
      const paymentInfo = await getPaymentInfo(paymentId);

      if (paymentInfo.status === 'approved') {
        console.log('✅ Pago aprobado:', paymentId);
        return {
          success: true,
          status: 'approved',
          paymentId: paymentId,
          metadata: paymentInfo.metadata
        };
      }
    }

    return {
      success: false,
      message: 'Webhook procesado pero sin acción'
    };
  } catch (error) {
    console.error('Error procesando webhook:', error);
    throw error;
  }
}

module.exports = {
  createPaymentPreference,
  getPaymentInfo,
  processWebhook
};
