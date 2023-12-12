const { fundFloAPIUrl, fundfloARUrl } = require('./../envSettings');
require('dotenv').config();


module.exports = {
    urlMap:
        Object.freeze(
            {
                INTERNAL_DATA_PROCESS : `${fundFloAPIUrl}/processor/data`,
                INTERNAL_CANARA_CRON : `${fundFloAPIUrl}/canara/van/statement/CASA`,
                AR_COLLECTION_INSERT:  `${fundfloARUrl}/v1/collection/add?origin=Fundflo&stage=dev&xapikey=fbc62e55b41148929a30d475d64239b4`,
            },
        )
};
