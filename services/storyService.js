const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Genera una historia completa basada en los datos del héroe
 */
async function generateStory(heroData) {
  const { heroName, heroAge, superpower, villain } = heroData;

  const prompt = `Escribe una historia infantil emocionante y mágica de 5-7 párrafos para un niño/a de ${heroAge} años llamado/a ${heroName}. 

Detalles:
- Protagonista: ${heroName}, un niño/a de ${heroAge} años
- Superpoder: ${superpower}
- Villano/Miedo a vencer: ${villain}

La historia debe:
1. Ser emocionante y cautivadora
2. Tener un inicio atractivo
3. Desarrollar el conflicto con el villano
4. Mostrar cómo ${heroName} usa su superpoder (${superpower})
5. Tener un final épico y satisfactorio
6. Ser apropiada para la edad del niño
7. Incluir descripciones vívidas y mágicas
8. Ser entre 800-1200 palabras

Escribe la historia de forma narrativa, sin numeración ni títulos.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un escritor de historias infantiles mágicas y emocionantes. Creas narrativas personalizadas que hacen sentir a los niños como héroes verdaderos.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1500
    });

    const story = response.choices[0].message.content;
    return {
      success: true,
      story: story,
      tokens: response.usage.total_tokens
    };
  } catch (error) {
    console.error('Error generando historia:', error);
    throw {
      status: 500,
      message: 'Error al generar la historia: ' + error.message
    };
  }
}

/**
 * Genera un resumen corto para el preview
 */
async function generatePreview(heroData) {
  const { heroName, heroAge, superpower, villain } = heroData;

  const prompt = `Escribe solo el PRIMER PÁRRAFO de una historia infantil para ${heroName} (${heroAge} años) con superpoder de ${superpower} que debe vencer a ${villain}.

El párrafo debe:
1. Ser emocionante y cautivador
2. Presentar a ${heroName} y su mundo
3. Terminar en un punto de tensión (que corte en la mejor parte)
4. Ser de 100-150 palabras
5. Hacer que el lector quiera saber más

Solo escribe el párrafo, sin explicaciones.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un escritor experto en crear ganchos narrativos emocionantes para historias infantiles.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generando preview:', error);
    throw {
      status: 500,
      message: 'Error al generar el preview: ' + error.message
    };
  }
}

module.exports = {
  generateStory,
  generatePreview
};
