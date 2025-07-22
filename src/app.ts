const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: false, // Para ver el navegador y debuggear
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  },
});

client.on("qr", (qr: any) => {
  qrcode.generate(qr, { small: true });
  console.log("Escanea el código QR con WhatsApp para iniciar sesión");
});

client.on("ready", () => {
  console.log("Cliente listo, enviando mensajes...");

  // Formato correcto para números peruanos en WhatsApp Web.js
  const number = "51958614633"; // Número en formato E.164 sin '+'
  const chatId = number + "@c.us"; // Sintaxis requerida por la API

  client
    .sendMessage(chatId, "Hola, este es un mensaje automatizado 😜💥🎉")
    .then(() => {
      console.log("✅ Mensaje enviado correctamente a", number);
      client.destroy(); // Cierra la sesión después de enviar
    })
    .catch((err: any) => {
      console.error("❌ Error al enviar mensaje:", err);
      client.destroy();
    });
});

process.on("SIGINT", () => {
  console.log("Cerrando cliente a la base de datos...");
  client.destroy();
  process.exit();
});

client.initialize();
