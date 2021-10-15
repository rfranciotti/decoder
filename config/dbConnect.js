
// /lib/dbConnect.js
const mongoose = require('mongoose');

/** 
Source : 
https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/utils/dbConnect.js 
**/

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
    throw new Error(
        'Defina a variavel MONGODB_URI em .env.local'
    )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */



let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

module.exports = async () => {


    if (cached.conn) {
        console.log("connected cached", cached.conn);
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false,
        }

        cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
            console.log("connected not cached", cached.promise);
            return mongoose
        })
    }
    cached.conn = await cached.promise

    console.log("connected");
    return cached.conn
}

