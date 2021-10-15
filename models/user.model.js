const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const Schema = mongoose.Schema;
mongoose.plugin(slug);


const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Nome requerido!"],
        unique: true,
        trim: true,
        minlength: 7
    },
    email: {
        type: String,
        //match: [/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i, "Enter a valid email"],
        require: true,
        unique: true,
        trim: true,
        minlength: 10
    },
    password: {
        type: String,
        require: true,
        unique: false,
        trim: true,
        minlength: 6
    },
    slug: {
        type: String,
        slug: "title",
        default: "nada"
    },
    resetPasswordToken: { type: String, },
    resetPasswordExpired: { type: Date, }
});

userSchema.set('timestamps', true);

//Reverse populate com Virtuals
userSchema.virtual('users', {
    ref: 'User',
    localField: '_id',
    foreignField: 'user',
    justOne: "false"
});

//ENCRYPT PASSWORD
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})



// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expireIn: process.env.JWT_EXPIRE
    })
}

const User = mongoose.model("User", userSchema)
module.exports = User;