import express from "express";
import accountsRouter from "./routes/accountsRouter.js";
import mongoose from 'mongoose'
const app = express();

(async () =>{
    try {        
       await mongoose.connect(
        'mongodb+srv://dbProjetos:Projetos123@cluster0-k0mfb.mongodb.net/bank?retryWrites=true&w=majority',
        {
            useNewUrlParser:true,
            useUnifiedTopology: true,
        } 
       );
    } catch (error) {
        console.log('Erro ao conectar no MongoDB')   
    }
})();

app.use(express.json());
app.use("/accounts", accountsRouter)

app.listen(3000, function () {
    console.log("Api")
})