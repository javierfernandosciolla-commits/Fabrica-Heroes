const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');

/**
 * POST /api/payment/create-preference
 * Crea una preferencia de pago en MercadoPago
 */
router.post('/create-preference', async (req, res) => {
  try {
    const { heroName, heroAge, superpower, villain, email } = req.body;

    if (!heroName || !heroAge || !superpower || !villain || !email) {
      return res.status(400).json({
        error: 'Faltan datos requeridos'
      });
    }

    const heroData = { heroName, heroAge, superpower, villain };
    const preference = await paymentService.createPaymentPreference(heroData, email);

    res.json({
      success: true,
      preferenceId: preference.preferenceId,
      initPoint: preference.initPoint,
      sandboxInitPoint: preference.sandboxInitPoint
    });
  } catch (error) {
    console.error('Error en /create-preference:', error);
    res.status(error.status || 500).json({
      error: error.message || 'Error creando preferencia de pago'
    });
  }
});

/**
 * GET /api/payment/info/:paymentId
 * Obtiene información de un pago
 */
router.get('/info/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({
        error: 'ID de pago requerido'
      });
    }

    const paymentInfo = await paymentService.getPaymentInfo(paymentId);

    res.json({
      success: true,
      payment: paymentInfo
    });
  } catch (error) {
    console.error('Error en /info:', error);
    res.status(error.status || 500).json({
      error: error.message || 'Error obteniendo información del pago'
    });
  }
});

/**
 * POST /api/payment/webhook
 * Webhook para recibir notificaciones de MercadoPago
 */
router.post('/webhook', async (req, res) => {
  try {
    const result = await paymentService.processWebhook(req.body);

    res.json({
      success: true,
      result: result
    });
  } catch (error) {
    console.error('Error en webhook:', error);
    res.status(500).json({
      error: error.message || 'Error procesando webhook'
    });
  }
});

module.exports = router;
