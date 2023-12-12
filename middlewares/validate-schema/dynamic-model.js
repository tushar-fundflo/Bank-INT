// const { logger } = require('./../../config/logger');
const { mapJsonValues } = require('./../../handlers/json.map.handler');
const _ = require('lodash');
const { Draft04, Draft06, Draft07, Draft, JsonError } = require ( "json-schema-library");


function validateSchemeData(enterpriseUuid,module,type,operation,bodyJson){
    const jsonSchema = require(`./enterprise-schema/${module}/${type}/${enterpriseUuid}_${operation}.json`);           
    const entJsonSchema = new Draft07(jsonSchema);
    const errors = entJsonSchema.validate(bodyJson);
    if(errors && errors.length > 0){
        throw new Error(_.map(errors, 'message'));
    }else{
        const mapSchema = require(`./ff-map-schema/${module}/${enterpriseUuid}_${operation}_map.json`);           
        return mapJsonValues(bodyJson,mapSchema);
    }
}
function validateOnlyMapData(enterpriseUuid,module,type,operation,bodyJson){
        const mapSchema = require(`./ff-map-schema/${module}/${type}/${enterpriseUuid}_${operation}_map.json`);           
        return mapJsonValues(bodyJson,mapSchema);
    
}

module.exports = { validateSchemeData , validateOnlyMapData}