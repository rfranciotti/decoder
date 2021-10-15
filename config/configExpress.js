const express = require('express') /* framework for nodejs */
const consign = require('consign') /*auxiliar na organização das pasta do projeto.*/

const bodyParser = require('body-parser')
const cors = require('cors')
const conexao = require('./dbConnect');



module.exports = () => {
    require('dotenv').config()
    const api = express()
    const connection = conexao()

    console.log('connecting');
    connection.then(exec => {
        if (exec) {
            console.log("ok");
        } else {
            console.log("error!", exec);
        }
    })


    api.use(cors())
    api.use(express.json())
    api.use(express.urlencoded({ extended: true }))
    consign()
        .include('controllers')
        .into(api)


    return api
}
