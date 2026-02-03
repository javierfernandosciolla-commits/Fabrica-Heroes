const express = require('express');
const router = express.Router();
const storyService = require('../services/storyService');
const imageService = require('../services/imageService');
const emailService = require('../services/emailService');

/**
 * POST /api/story/preview
 * Genera un preview de la historia
 */
router.post('/preview', async (req, res) => {
  try {
    const { heroName, heroAge, superpower, villain } = req.body;

    if (!heroName || !heroAge || !superpower || !villain) {
      return res.status(400).json({
        error: 'Faltan datos requeridos'
      });
    }

    const heroData = { heroName, heroAge, superpower, villain };
    const preview = await storyService.generatePreview(heroData);

    res.json({
      success: true,
      preview: preview
    });
  } catch (error) {
    console.error('Error en /preview:', error);
    res.status(error.status || 500).json({
      error: error.message || 'Error generando preview'
    });
  }
});

/**
 * POST /api/story/generate
 * Genera la historia completa
 */
router.post('/generate', async (req, res) => {
  try {
    const { heroName, heroAge, superpower, villain } = req.body;

    if (!heroName || !heroAge || !superpower || !villain) {
      return res.status(400).json({
        error: 'Faltan datos requeridos'
      });
    }

    const heroData = { heroName, heroAge, superpower, villain };

    // Generar historia y imagen en paralelo
    const [storyResult, imageResult] = await Promise.all([
      storyService.generateStory(heroData),
      imageService.generateHeroImage(heroData)
    ]);

    res.json({
      success: true,
      story: storyResult.story,
      image: imageResult.imageUrl,
      imageFallback: imageResult.fallback || false
    });
  } catch (error) {
    console.error('Error en /generate:', error);
    res.status(error.status || 500).json({
      error: error.message || 'Error generando historia'
    });
  }
});

/**
 * POST /api/story/send-pdf
 * Genera y envía el PDF por email
 */
router.post('/send-pdf', async (req, res) => {
  try {
    const { email, heroName, heroAge, superpower, villain, story, imageBase64 } = req.body;

    if (!email || !heroName || !story) {
      return res.status(400).json({
        error: 'Faltan datos requeridos (email, heroName, story)'
      });
    }

    const heroData = { heroName, heroAge, superpower, villain };

    // Generar PDF
    const pdfBuffer = await emailService.generateStoryPDF(heroData, story, imageBase64);

    // Enviar email
    const emailResult = await emailService.sendStoryEmail(email, heroData, story, pdfBuffer);

    res.json({
      success: true,
      message: 'PDF enviado exitosamente',
      messageId: emailResult.messageId
    });
  } catch (error) {
    console.error('Error en /send-pdf:', error);
    res.status(error.status || 500).json({
      error: error.message || 'Error enviando PDF'
    });
  }
});

module.exports = router;
