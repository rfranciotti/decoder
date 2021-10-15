let user = require('../models/user.model')   /* CADA CONTROLER CHAMA SEU MODELO */
const errorHandler = require('../middleware/erros')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { find } = require('../models/user.model')


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

    app.get('/api/user/test', (req, res) => {
        res.send("OK - Rota do arquivo Controller/User.Js")
    })

    app.route('/api/oauth/').post(async (req, res, next) => {

        const username = req.body.username
        const password = req.body.password

        if (!username || !password) {
            console.log(1);
            return res.status(400).json({ sucess: false, error: "User Inválido ou nao informado!" })
        }

        const thisUser = await user.findOne({ username }).select(+password);
        if (!thisUser) {
            return res.status(401).json({ sucess: true, error: "User Inválido..." })
        }

        const isMatched = bcrypt.compareSync(req.body.password, thisUser.password)
        if (isMatched) {
            var token = jwt.sign(
                {
                    user: thisUser
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
                });

            res.status(200).json({ sucess: true, token })
        } else {
            return res.status(400).json({ sucess: false, error: "Pass NOT Matched" })
        }

    });


    /**
     * !ADD
     */

    app.route('/api/token/').post(async (req, res) => {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const rpassword = "N";
        const epassword = "10/10/2030";

        const newUser = new user({ username, email, password });

        try {
            await newUser.save()

            var token = jwt.sign(
                {
                    id: newUser._id,
                    password: password
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
                });

            return res.status(200).json({
                success: true,
                token: token
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error
            })

        }
    })



    /**
     * !GET
     */



    app.route('/api/user/').get(async (req, res) => {

        let query
        let queryStr = JSON.stringify(req.query);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
        query = user.find(JSON.parse(queryStr));

        console.log(queryStr);


        try {
            // const gets = await user.find({}, { _id: true, username: true, email: true, password: true });
            const gets = await query
            // const gets = await user.find({}, '_id username');
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


    app.route('/api/user/id/:id').get(async (req, res, next) => {
        try {
            const users = await user.findById(req.params.id, { _id: true, username: true, email: true, password: true })

            if (!users) {
                res.status(400).json({
                    success: false,
                    message: "Nenhum usuario encontrado"
                })
            } else {
                res.status(200).json({
                    success: true,
                    data: users
                })
            }


        } catch (error) {

            res.status(500).json({
                success: false,
                msg: error.message
            });

        }




    })




    app.route('/api/user/username/:username').get((req, res) => {
        user.findOne({ username: req.params.username })
            .then(users => {
                res.status(200).json({
                    success: true,
                    data: users.id
                })
            })
            .catch(err => res.status(400).json({
                success: false,
                data: "Error getting ID: " + err
            }));
    })


    /**
     * !ADD
     */

    app.route('/api/user/').post(async (req, res) => {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const rpassword = "N";
        const epassword = "10/10/2030";

        const newUser = new user({ username, email, password });
        await newUser.save()
            .then(() => {
                res.status(200).json({
                    success: true,
                    msg: "Created new User"
                })
            })
            .catch(err => res.status(400).json('Errors: ' + err + " LENGHT OR DUPLICATE KEY"));
    })



    /**
     * !DELETE
     */


    app.route('/api/user/:id').delete(async (req, res) => {

        try {
            const gets = await user.findByIdAndDelete(req.params.id);

            if (!gets) {
                return res.status(200).json({
                    success: false,
                    count: gets.length,
                    data: gets
                })
            } else {
                return res.status(200).json({
                    success: true,
                    count: gets.length,
                    data: gets
                })
            }


        } catch (error) {
            res.status(400).json({
                success: false,
                message: "No register found!"
            })
        }
    })




    /**
     * !UPDATE
     */

    app.route('/user/update/:id').post(async (req, res) => {
        await user.findById(req.params.id)
            .then(users => {
                users.username = req.body.username;
                users.email = req.body.email;
                users.password = req.body.password;
                users.save()
                    .then(() => {
                        res.json("User Updated !")
                        console.log("Updated record: " + req.params.id)
                    })
                    .catch(err => res.status(401).json('Error: ' + err));

            })
            .catch(err => res.status(400).json("Error: " + err));

    })

    app.route('/api/user/:id').patch(async (req, res) => {

        try {
            const users = await user.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
                useFindAndModify: false
            })

            if (!users) {
                return res.status(400).json({
                    success: false,
                })
            }

            res.status(200).json({
                success: true,
                data: users
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                msg: "erro. " + error
            })
        }





    })



}