const color = require('chalk');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

app.get('/',(req, res)=>{
    res.send({ hi: 'there' });
});

app.listen(PORT);

console.log(color.green('Server') + ' : Start ');
console.log(color.green('Server') + ' : Port [ ' + color.blue(PORT) + ' ]');