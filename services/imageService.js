const axios = require('axios');

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

/**
 * Genera una imagen del héroe usando Hugging Face
 */
async function generateHeroImage(heroData) {
  const { heroName, superpower, villain } = heroData;

  // Crear un prompt descriptivo para la imagen
  const prompt = `A magical hero portrait of a child named ${heroName} with the superpower of ${superpower}, fantasy art style, vibrant colors, epic adventure, glowing magical aura, heroic pose, detailed illustration, high quality, 4k`;

  try {
    console.log('🎨 Generando imagen con Hugging Face...');
    
    const response = await axios.post(
      HUGGINGFACE_API_URL,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer',
        timeout: 60000
      }
    );

    // Convertir el buffer a base64
    const base64Image = Buffer.from(response.data).toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    return {
      success: true,
      imageUrl: imageUrl,
      prompt: prompt
    };
  } catch (error) {
    console.error('Error generando imagen:', error.message);
    
    // Si falla, retornar una imagen placeholder con el nombre del héroe
    return {
      success: false,
      imageUrl: `https://via.placeholder.com/400x300/1e40af/ffffff?text=${encodeURIComponent('🦸 ' + heroName)}`,
      prompt: prompt,
      fallback: true,
      error: error.message
    };
  }
}

/**
 * Genera múltiples variaciones de imágenes
 */
async function generateHeroImageVariations(heroData, count = 1) {
  const images = [];
  
  for (let i = 0; i < count; i++) {
    const image = await generateHeroImage(heroData);
    images.push(image);
  }

  return images;
}

module.exports = {
  generateHeroImage,
  generateHeroImageVariations
};
