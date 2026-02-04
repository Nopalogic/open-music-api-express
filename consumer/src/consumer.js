/* eslint-disable no-console */
import "dotenv/config";
import amqp from "amqplib";
import Listener from "./listener.js";
import MailSender from "./mailSender.js";
import SongsService from "./songsService.js";

const init = async () => {
  try {
    const songsService = new SongsService();
    const mailSender = new MailSender();
    const listener = new Listener(songsService, mailSender);

    console.log("Connecting to RabbitMQ...");

    const connection = await amqp.connect(process.env.RABBITMQ_URL);

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err.message);
    });

    connection.on("close", () => {
      console.log("RabbitMQ connection closed. Reconnecting...");
      setTimeout(init, 5000);
    });

    const channel = await connection.createChannel();

    await channel.assertQueue("export:songs", {
      durable: true,
    });

    console.log("Consumer is listening for messages...");

    channel.consume("export:songs", listener.listen, { noAck: true });
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    console.error("Failed to connect to RabbitMQ. Retrying in 5 seconds...");
    setTimeout(init, 5000);
  }
};

init();
