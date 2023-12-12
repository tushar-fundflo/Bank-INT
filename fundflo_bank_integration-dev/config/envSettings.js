require('dotenv').config()
let envApiInitial = '';
let ARenvApiInitial = ''
let companyName = 'fundflo.ai';
let method = 'https'

switch (process.env.NODE_ENV) {
    case 'local':
        envApiInitial = 'localhost:4000';
        ARenvApiInitial = 'localhost:8115';
        companyName = '';
        method = 'http';
        break;       
    default:
        envApiInitial = 'bankintegration.qa.';
        ARenvApiInitial = 'enterprise.'
        break;
}
module.exports = {
    fundFloAPIUrl: `${method}://${envApiInitial}${companyName}`,
    fundfloARUrl: `${method}://${ARenvApiInitial}${companyName}`,
};
