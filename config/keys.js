//key.js - figre out what set of credentials to return

if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prd');
}else{
    module.exports = require('./dev');
}