const configExpress = require('./config/configExpress');
var colors = require('colors')


const app = configExpress()
const port = process.env.PORT || 3000


/* console.log('hello'.green);
console.log('i like cake and pies'.underline.red) // outputs red underlined text

console.log('inverse the color'.inverse); // inverses the color
console.log('OMG Rainbows!'.rainbow); // rainbow
console.log('Run the trap'.brightMagenta); // Drops the bass */

app.listen(3000, () => console.log('servidor rodando na porta 3000'))

app.get("/", (req, res) => res.send('Acessando rota RAIZ'))

