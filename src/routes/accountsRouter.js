import express from "express";
import { accountModel } from '../models/accounts.js'

const router = express.Router();

//Crie um endpoint para registrar um depósito em uma conta. Este endpoint deverá receber como parâmetros a “agencia”, o número da “conta” e o valor do depósito. Ele deverá atualizar o “balance” da conta, incrementando-o com o valor recebido como parâmetro. O endpoint deverá validar se a conta informada existe, caso não exista deverá retornar um erro, caso exista retornar o saldo atual da conta. 
router.post("/deposito", async (req, res) => {
    try {   
        if (req.body.valor <= 0) {
            throw new Error("Valor deverá ser maior que 0!"); 
        };

        const dados  =  await accountModel.findOneAndUpdate({ agencia: req.body.agencia, conta: req.body.conta}, {$inc: {balance: req.body.valor}}, 
            {new: true, useFindAndModify: false} );
        if (dados) {
            res.send(`Saldo da Conta: ${ dados.balance }` );
        } else {
            throw new Error("Dados não encontrados!");
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

//Crie um endpoint para registrar um saque em uma conta. Este endpoint deverá receber como parâmetros a “agência”, o número da “conta” e o valor do saque. Ele deverá atualizar o “balance” da conta, decrementando-o com o valor recebido com parâmetro e cobrando uma tarifa de saque de (1). O endpoint deverá validar se a conta informada existe, caso não exista deverá retornar um erro, caso exista retornar o saldo atual da conta. Também deverá validar se a conta possui saldo suficiente para aquele saque, se não tiver deverá retornar um erro, não permitindo assim que o saque fique negativo
router.post("/saque", async (req, res) => {
    try {   
        if (req.body.valor <= 0) {
            throw new Error("Valor deverá ser maior que 0!"); 
        };

        const dados  =  await accountModel.findOne({ agencia: req.body.agencia, conta: req.body.conta});
        if (dados) {
            const valorSaque = (req.body.valor + 1);
           if((dados.balance - valorSaque) < 0) {
               throw new Error("Não há dinheiro suficiente para efetuar o saque!");
           }
            const saque  =  await accountModel.findOneAndUpdate({ agencia: req.body.agencia, conta: req.body.conta}, {$inc: {balance: valorSaque * -1}}, 
                 {new: true, useFindAndModify: false} );
            res.send(`Saldo da Conta: ${ saque.balance }` );
        } else {
            throw new Error("Dados não encontrados!");
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

//Crie um endpoint para consultar o saldo da conta. Este endpoint deverá receber como parâmetro a “agência” e o número da “conta”, e deverá retornar seu “balance”. Caso a conta informada não exista, retornar um erro.
router.get("/", async (req, res) => {
    try {   
        const dados  =  await accountModel.findOne({ agencia: req.body.agencia, conta: req.body.conta});
        if (dados) {
            res.send(`Saldo da Conta: ${ dados.balance }` );
        } else {
            throw new Error("Dados não encontrados!");
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

//Crie um endpoint para excluir uma conta. Este endpoint deverá receber como parâmetro a “agência” e o número da “conta” da conta e retornar o número de contas ativas para esta agência.
router.delete("/", async (req, res) => {
    try {   
        const dados  =  await accountModel.findOneAndDelete({ agencia: req.body.agencia, conta: req.body.conta});
        if(!dados){
            throw new Error("Dados não encontrados!"); 
        }

        const dadosQdte  =  await accountModel.countDocuments({ agencia: req.body.agencia});
        if (dadosQdte) {
            res.send(`Conta excluída com sucesso!  Agência: ${ req.body.agencia }, contas ativas :  ${ dadosQdte }` );
        } else {
            throw new Error("Dados não encontrados!");
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});


//Crie um endpoint para realizar transferências entre contas. Este endpoint deverá
//receber como parâmetro o número da “conta” origem, o número da “conta” destino e
//o valor de transferência. Este endpoint deve validar se as contas são da mesma
//agência para realizar a transferência, caso seja de agências distintas o valor de tarifa
//de transferencia (8) deve ser debitado na “conta” origem. O endpoint deverá retornar o saldo da conta origem.
router.post("/transferencia", async (req, res) => {
    try {   
        if (req.body.valor <= 0) {
            throw new Error("Valor deverá ser maior que 0!"); 
        };

        const dadosOrigem  =  await accountModel.findOne({ conta: req.body.contaOrigem});
        if(!dadosOrigem){
            throw new Error("Dados da conta de Origem não encontrados!"); 
        }

        const dadosDestino  =  await accountModel.findOne({ conta: req.body.contaDestino});
        if(!dadosDestino){
            throw new Error("Dados da conta de Destino não encontrados!"); 
        }

        const valor = dadosDestino.agencia !== dadosOrigem.agencia ? req.body.valor + 8 : req.body.valor;
        if((dadosOrigem.balance - valor) < 0) {
            throw new Error("Não há dinheiro suficiente para efetuar a transferência!");
        }

         await accountModel.findOneAndUpdate({ agencia: dadosDestino.agencia, conta: dadosDestino.conta}, {$inc: {balance: valor}}, 
              {new: false, useFindAndModify: false} );
 
         const transferenciaOrigem  =  await accountModel.findOneAndUpdate({ agencia: dadosOrigem.agencia, conta: dadosOrigem.conta}, {$inc: {balance: valor * -1}}, 
                {new: true, useFindAndModify: false} );
    
        if (transferenciaOrigem) {
            res.send(`Saldo da Conta de Origem: ${ transferenciaOrigem.balance }` );
        } else {
            throw new Error("Dados não encontrados!");
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

//Crie um endpoint para consultar a média do saldo dos clientes de determinada agência. O endpoint deverá receber como parametro a “agência” e deverá retornar o balance médio da conta..
router.get("/media/:agencia", async (req, res) => {
    try {   
        if (req.params.agencia <= 0) {
            throw new Error("Agência deverá ser maior que 0!"); 
        };

        const dados  =  await accountModel.aggregate(
            [ { $match: {agencia: parseInt(req.params.agencia)}},
              {$group: { _id: null, media: { $avg: "$balance"}}}
            ]);

        if(!dados[0]){
           throw new Error("Agência não encontrada!"); 
        }

        const media = dados[0].media.toFixed(2);
        if (media > 0) {
            res.send(`Balance médio é : ${ media }`);
        } else {
            throw new Error("Dados não encontrados!");
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

//Crie um endpoint para consultar os clientes com o menor saldo em conta. O endpoint devera receber como parâmetro um valor numérico para determinar a quantidade de
//clientes a serem listados, e o endpoint deverá retornar em ordem crescente pelo saldo a lista dos clientes (agência, conta, saldo)
router.get("/menor/:qtde", async (req, res) => {
    try {   
        if (req.params.qtde <= 0) {
            throw new Error("Quantidade deverá ser maior que 0!"); 
        };

        const dados  =  await accountModel.aggregate(
            [
              { $project: {agencia:1, conta:1, balance:1 }}, 
              { $sort: { balance: 1 }},  
              { $limit: parseInt(req.params.qtde) } 
            ]);

        if (dados) {
            res.send(dados);
        } else {
            throw new Error("Dados não encontrados!");
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

//Crie um endpoint para consultar os clientes mais ricos do banco. O endpoint deverá receber como parâmetro um valor numérico para determinar a quantidade de clientes
//a serem listados, e o endpoint deverá retornar em ordem decrescente pelo saldo, crescente pelo nome, a lista dos clientes (agência, conta, nome e saldo).
router.get("/maior/:qtde", async (req, res) => {
    try {   
        if (req.params.qtde <= 0) {
            throw new Error("Quantidade deverá ser maior que 0!"); 
        };

        const dados  =  await accountModel.aggregate(
            [
              { $project: {agencia:1, conta:1, name:1, balance:1 }}, 
              { $sort: { balance: -1, name:1 }},  
              { $limit: parseInt(req.params.qtde) } 
            ]);

        if (dados) {
            res.send(dados);
        } else {
            throw new Error("Dados não encontrados!");
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});


//Crie um endpoint que irá transferir o cliente com maior saldo em conta de cada
//agência para a agência private agencia=99. O endpoint deverá retornar a lista dos clientes da agencia private.
router.get("/private", async (req, res) => {
    try {   
      
        //Buscar todas as agências diferentes de 99
        const agencia  =  await accountModel.distinct("agencia", { agencia: { $ne: 99 } });

        //Buscar conta com valor mais alto por agencia e mudar para agencia 99
       for (const item of agencia) {
            await accountModel.findOneAndUpdate({ agencia: item}, {$set: {agencia: 99}}, 
            { useFindAndModify: false} ).sort({ "balance":-1})
       }

       // Listar todos os clientes da agencia 99
        const dados  =  await accountModel.find({"agencia": 99}).sort({ "balance":-1});

        if (dados) {
            res.send(dados);
        } else {
            throw new Error("Dados não encontrados!");
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

export default router; 