import { ErrorHandler } from '@starthub/err-middleware';
import amqp from 'amqplib'
import dotenv from "dotenv"

dotenv.config({
    path:"../../../.env"
})

let channel:amqp.Channel;

export const connectRabbit = async () => {
    if(channel) return;
    const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
    channel = await connection.createChannel();
    await channel.assertQueue('email-activation',{
        durable:true
    })
}

export const publishQueue = async (data:any) => {
    if(!channel) throw new ErrorHandler("Channel not initialized",404);
    channel.sendToQueue('email-activation',Buffer.from(JSON.stringify(data)),{
        persistent:true
    })
}