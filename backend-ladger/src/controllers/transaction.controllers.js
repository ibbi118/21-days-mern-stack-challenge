const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ladger.model")
const accountModel = require("../models/account.model")
const { default: mongoose } = require("mongoose")
const ladgerModel = require("../models/ladger.model")


async function systemInitalFund(req,res){
  
    const {toAccount,amount,idempotencyKey} = req.body
    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message : "To account , amount and key is required"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id : toAccount
    })

    if(!toUserAccount){
        return res.status(400).json({
            message : "Invalid toUserAccount"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user : req.user._id
    })

    if(!fromUserAccount){
        return res.status(400).json({
            message : "System User Not Found"
        })
    }


    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount : fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey
    })

    const debitLedgerEntry = await ladgerModel.create([{
        account : fromUserAccount._id,
        amount,
        transaction : transaction._id,
        type : "DEBIT"
    }],{session})



    const creditLedgerEntry = await ladgerModel.create([{
        account : toAccount,
        amount,
        transaction : transaction._id,
        type : "CREDIT"

    }],{session})
  
     transaction.status = "COMPLETED"
     await transaction.save()
     
     await session.commitTransaction()
     session.endSession()

     res.status(202).json({
        message : "Initial fund successfully transfered ",
        transaction : transaction
     })
}


module.exports = {
    systemInitalFund
}