
import Mailmodal from "./sendmail.js";

import  nodemailer  from 'nodemailer';
import Mailgen from 'mailgen';
import path from 'path';
import  dotenv from 'dotenv';



dotenv.config({
  path:"\.env"
})

  const gmail= process.env.GMAIL_USER
 // console.log(gmail)

export const Mailsended= async(req,res,next)=>{

 
  

    const {name,email,phone,message}= req.body;

           const mail= await Mailmodal.create({

             name,
             email,
             phone,
             message


           })
             

                await sendReferralEmail(mail, res);

                
            res.status(200).json({
                success:true,
                mail,
                message:'mail sent successfully'

            })
}

async function sendReferralEmail(referral, res) {
  const { GMAIL_USER, GMAIL_PASS } = process.env;

 // console.log(referral)
 // console.log(GMAIL_PASS) 
  
  let config = {
      service: 'gmail',
      auth: {
          user: GMAIL_USER,
          pass: GMAIL_PASS
      }
  };

  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
      theme: "default",
      product: {
          name: "Referral",
          link: 'https://mailgen.js/'
      }
  });

  let response = {
      body: {
          name: ` ${referral.name}`,
          intro: `${referral.message}`,
          table: {
              data: [
                  {
                      item: "Javascript Book",
                      description: "A Book to help learn Javascript programming",
                      price: " 40% off if you using this Referral id",
                      Referral_id:`${referral.name}40`,
                    

                    
                  }
              ]
          },
          outro: "Looking forward to do more business"
      }
  };

  let mail = MailGenerator.generate(response);

  let message = {
      from: GMAIL_USER,
      to: `${referral.email}`,
      subject: "Referral Course",
      html: mail
  };

  try {
      await transporter.sendMail(message);
      console.log("Email sent successfully.");
  } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: 'Failed to send email' });
  }
}



      

