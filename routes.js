module.exports = function (app) {
    app.get('/', (request,response)=>{
        response.status(200).json({status: false, message: 'Welcome to Fundflo Bank Integration '});
        return;
    }),
    app.use('/canara', require('./canara/canaraBank.routes'));
    app.use('/processor', require('./data-processor/data-processor.routes'));
};