import mongoose from "mongoose"




  const MailSchmea= mongoose.Schema({

        
    name:{
        type:String,
        required:[true,' Please Enter Your Name ']
    },
    email:{
        type:String,
        required:[true,'Please Enter  Email Id']

    },
    phone:Number,
    message:String


  })


  export default mongoose.model('mail',MailSchmea);
