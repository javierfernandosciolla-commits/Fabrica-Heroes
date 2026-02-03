const nodemailer = require('nodemailer');
const { PDFDocument, rgb, degrees } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

// Configurar transporte de email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Genera un PDF con la historia completa
 */
async function generateStoryPDF(heroData, story, imageBase64 = null) {
  try {
    console.log('📄 Generando PDF...');

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();

    // Colores
    const darkBlue = rgb(30/255, 64/255, 175/255);
    const orange = rgb(251/255, 146/255, 60/255);
    const white = rgb(1, 1, 1);

    // Margen
    const margin = 40;
    let yPosition = height - margin;

    // Título
    page.drawText('Fábrica de Héroes', {
      x: margin,
      y: yPosition,
      size: 28,
      color: darkBlue,
      font: await pdfDoc.embedFont('Helvetica-Bold')
    });
    yPosition -= 40;

    // Nombre del héroe
    page.drawText(`La Aventura de ${heroData.heroName}`, {
      x: margin,
      y: yPosition,
      size: 20,
      color: orange,
      font: await pdfDoc.embedFont('Helvetica-Bold')
    });
    yPosition -= 30;

    // Detalles del héroe
    const details = `Edad: ${heroData.heroAge} años | Superpoder: ${heroData.superpower} | Villano: ${heroData.villain}`;
    page.drawText(details, {
      x: margin,
      y: yPosition,
      size: 10,
      color: rgb(0.5, 0.5, 0.5),
      font: await pdfDoc.embedFont('Helvetica')
    });
    yPosition -= 25;

    // Línea separadora
    page.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: width - margin, y: yPosition },
      color: orange,
      thickness: 2
    });
    yPosition -= 20;

    // Agregar imagen si existe
    if (imageBase64) {
      try {
        // Extraer datos base64 si viene en formato data:image
        let imageData = imageBase64;
        if (imageBase64.startsWith('data:')) {
          imageData = imageBase64.split(',')[1];
        }

        const imageBytes = Buffer.from(imageData, 'base64');
        const image = await pdfDoc.embedJpg(imageBytes);
        
        const imageWidth = 150;
        const imageHeight = 150;
        const imageX = (width - imageWidth) / 2;

        page.drawImage(image, {
          x: imageX,
          y: yPosition - imageHeight,
          width: imageWidth,
          height: imageHeight
        });

        yPosition -= imageHeight + 20;
      } catch (imgError) {
        console.warn('No se pudo agregar imagen al PDF:', imgError.message);
      }
    }

    // Historia
    const storyLines = story.split('\n').filter(line => line.trim());
    const font = await pdfDoc.embedFont('Helvetica');
    const fontSize = 11;
    const lineHeight = fontSize + 4;

    for (const line of storyLines) {
      if (yPosition < margin + 50) {
        page = pdfDoc.addPage([595, 842]);
        yPosition = height - margin;
      }

      // Envolver texto largo
      const words = line.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const textWidth = testLine.length * 2.5; // Aproximación

        if (textWidth > width - 2 * margin) {
          if (currentLine) {
            page.drawText(currentLine, {
              x: margin,
              y: yPosition,
              size: fontSize,
              color: rgb(0, 0, 0),
              font: font
            });
            yPosition -= lineHeight;
          }
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        page.drawText(currentLine, {
          x: margin,
          y: yPosition,
          size: fontSize,
          color: rgb(0, 0, 0),
          font: font
        });
        yPosition -= lineHeight;
      }

      yPosition -= 5; // Espacio entre párrafos
    }

    // Pie de página
    yPosition = margin - 20;
    page.drawText('© 2024 Fábrica de Héroes - Historias Mágicas Personalizadas', {
      x: margin,
      y: yPosition,
      size: 8,
      color: rgb(0.7, 0.7, 0.7),
      font: font
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw {
      status: 500,
      message: 'Error al generar PDF: ' + error.message
    };
  }
}

/**
 * Envía el PDF y la historia por email
 */
async function sendStoryEmail(email, heroData, story, pdfBuffer) {
  try {
    console.log(`📧 Enviando email a ${email}...`);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `🦸 ¡Tu Aventura Está Lista! - La Historia de ${heroData.heroName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🦸 Fábrica de Héroes</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">La Aventura de ${heroData.heroName}</p>
          </div>

          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1e40af; margin-top: 0;">¡Hola! 👋</h2>
            
            <p style="color: #374151; line-height: 1.6;">
              ¡Gracias por comprar la aventura de <strong>${heroData.heroName}</strong>! 
              Aquí está la historia completa que hemos creado especialmente para ti.
            </p>

            <div style="background: white; border-left: 4px solid #fb923c; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h3 style="color: #1e40af; margin-top: 0;">📖 Detalles de la Aventura:</h3>
              <ul style="color: #374151; line-height: 1.8;">
                <li><strong>Protagonista:</strong> ${heroData.heroName} (${heroData.heroAge} años)</li>
                <li><strong>Superpoder:</strong> ${heroData.superpower}</li>
                <li><strong>Villano:</strong> ${heroData.villain}</li>
              </ul>
            </div>

            <p style="color: #374151; line-height: 1.6;">
              El PDF adjunto contiene la historia completa, lista para leer, imprimir o compartir con tu familia.
            </p>

            <div style="background: #dbeafe; border: 2px solid #3b82f6; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
              <p style="color: #1e40af; margin: 0; font-size: 14px;">
                <strong>💡 Consejo:</strong> Imprime la historia para crear un libro personalizado especial.
              </p>
            </div>

            <p style="color: #374151; line-height: 1.6;">
              Si tienes alguna pregunta o necesitas ayuda, no dudes en responder este email.
            </p>

            <p style="color: #374151; margin-top: 30px;">
              ¡Que disfrutes la aventura!<br>
              <strong>El equipo de Fábrica de Héroes</strong> ✨
            </p>
          </div>

          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0;">© 2024 Fábrica de Héroes - Historias Mágicas Personalizadas</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `Historia_${heroData.heroName}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado exitosamente:', result.response);
    
    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('Error enviando email:', error);
    throw {
      status: 500,
      message: 'Error al enviar email: ' + error.message
    };
  }
}

/**
 * Verifica la configuración del email
 */
async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('✅ Configuración de email verificada correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error en configuración de email:', error);
    return false;
  }
}

module.exports = {
  generateStoryPDF,
  sendStoryEmail,
  verifyEmailConfig
};
