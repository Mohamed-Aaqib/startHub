import { IAEmail } from "../rabbit/consumer";
import nodemailer, { Transporter } from "nodemailer"
import dotenv from "dotenv"
import ejs from "ejs"
import path from "path";
dotenv.config({
    path:"../../../.env"
})

export const sendMail = async (payload:IAEmail) => {
    const transporter:Transporter = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:parseInt(process.env.SMTP_PORT || '587'),
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASS,
        }
    })

    const {data,email,subject,template} = payload;
    const templatePath = path.join(__dirname,"../mails",template)
    const html:string = await ejs.renderFile(templatePath,data)

    await transporter.sendMail({
        from:process.env.SMTP_MAIL,
        to:email,
        subject,
        html
    })

}