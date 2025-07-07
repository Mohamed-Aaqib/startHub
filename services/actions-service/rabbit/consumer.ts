import amqp from "amqplib";
import dotenv from "dotenv";
import { sendMail } from "../controllers/actionController";

dotenv.config({
    path:"../../../.env"
})


export interface IAEmail{
    email:string,
    subject:string,
    template:string,
    data:{
        [key:string]:any
    }
}

export const startEmailConsumer = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
    const channel = await connection.createChannel();
    await channel.assertQueue('email-activation',{durable:true});

    channel.consume('email-activation',async (msg) => {
        if(msg != null){
            const payload:IAEmail = JSON.parse(msg.content.toString());
            try {
                sendMail(payload)
                channel.ack(msg)
            } catch (error) {
                console.error("Failed to send mail:", error);
                channel.nack(msg)
            }
        }
    })
}