const raw = require('../models/raw.model')   /* CADA CONTROLER CHAMA SEU MODELO */
const errorHandler = require('../middleware/erros')
const axios = require('axios')


module.exports = app => {

    /* TO BYPASS CORS POLICY!*/
    app.use(function (req, res, next) {
        res.setHeader(
            "Access-Control-Allow-Headers",
            "X-Requested-With,content-type"
        );
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS, PUT, PATCH, DELETE"
        );
        res.setHeader("Access-Control-Allow-Credentials", true);
        next();
    });


    app.get('/api/raw/test', (req, res) => {
        res.status(200).json({
            success: true,
            msg: "Chamou RAW",

        })
    })


    app.route('/api/raw/notdecoded').get(async (req, res) => {

        try {
            const gets = await raw.find({ rawMessageIsDecoded: false });
            return res.status(200).json({
                success: true,
                count: gets.length,
                data: gets
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error
            })
        }
    })

    app.route('/api/raw/decoded').get(async (req, res) => {

        try {
            const gets = await raw.find({ rawMessageIsDecoded: true });
            return res.status(200).json({
                success: true,
                count: gets.length,
                data: gets
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error
            })
        }
    })


    app.route('/api/raw/all').get(async (req, res) => {

        try {
            const gets = await raw.find({});
            return res.status(200).json({
                success: true,
                count: gets.length,
                data: gets
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error
            })
        }
    })


    app.route('/api/raw/:id').get(async (req, res) => {

        const myid = req.params.id

        try {
            const gets = await raw.findById({ _id: myid });
            return res.status(200).json({
                success: true,
                count: gets.length,
                data: gets
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error
            })
        }
    })


    app.route('/api/raw/decodeder').patch(async (req, res) => {

        try {
            const raws = await raw.findByIdAndUpdate(req.body.id, req.body, {
                new: true,
                runValidators: true,
                useFindAndModify: false
            })

            if (!raws) {
                return res.status(400).json({
                    success: false,
                })
            }

            res.status(200).json({
                success: true,
                data: raws
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                msg: "erro. " + error
            })
        }

    })





}