const express = require('express');
const router = express.Router();
const imageService = require('../services/imageService');

/**
 * POST /api/image/generate
 * Genera una imagen del héroe
 */
router.post('/generate', async (req, res) => {
  try {
    const { heroName, superpower, villain } = req.body;

    if (!heroName || !superpower || !villain) {
      return res.status(400).json({
        error: 'Faltan datos requeridos (heroName, superpower, villain)'
      });
    }

    const heroData = { heroName, superpower, villain };
    const imageResult = await imageService.generateHeroImage(heroData);

    res.json({
      success: true,
      imageUrl: imageResult.imageUrl,
      fallback: imageResult.fallback || false,
      prompt: imageResult.prompt
    });
  } catch (error) {
    console.error('Error en /generate:', error);
    res.status(error.status || 500).json({
      error: error.message || 'Error generando imagen'
    });
  }
});

module.exports = router;
