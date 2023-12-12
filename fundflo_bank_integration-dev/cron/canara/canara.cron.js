const CanaraBankController = require('../../canara/canaraBank.controller');
const cron = require('node-cron');
const _ = require("lodash");
const AxionManageController = require('../../config/axios-call/axios-call');
const { default: axios } = require('axios');
const { urlMap } = require('../../config/axios-call/url-map');
const { fundfloARUrl } = require('../../config/envSettings');

const canController = new CanaraBankController();
const axiosCon = new AxionManageController();
const urlType = 'INTERNAL_CANARA_CRON'
const ARUrlType = 'AR_COLLECTION_INSERT'

const canaraCollectionInsertCron = cron.schedule('56 14  * * *', async () => {
        const enterpriseUuid = '62d61aca-0795-ecd9-f8e0-f779050f6f77';
        const legalEntityUuid = '4c1bac2e-5228-4978-2305-a86456674bc6';
        const accNo= '04502020000655' ;
        const fromDate = '20230617';
        const toDate = '20230618';

        try {
            console.log(`cron started for pulling canara statements for enterprise uuid ${enterpriseUuid}`)
            //lets fetch the the array of transaction 
            const baseUrl = urlMap[urlType] ;
            let url = `${baseUrl}?accNo=${accNo}&fromDate=${fromDate}&toDate=${toDate}`;
            console.log(`url to be called from cron : ${url}`);
            let transData = await axios.get(url);
            if( transData ) {
                let dataToInsert = transData?.data?.data?.DBStructArr;
                // call AR API to insert
                const req = await axios;
                req.enterpriseUuid = '1ab2c50c-fed8-4682-3c3c-5f1484f1948d';
                req.originalUrl = '/newUrlCalled';
                req.origin='Fundflo', req.stage='dev', req.xapikey='fbc62e55b41148929a30d475d64239b4'
                let insertTransactions = await axiosCon.callAxiosPost( req, ARUrlType, { transactions: dataToInsert } )
            }
            console.log(`successfully inserted transactions for  enterprise uuid ${enterpriseUuid}`)
        } catch (error) {
            console.log(`cron failed for pulling canara statements fro enterprise uuid ${enterpriseUuid}, error: ${error?.message}`)
        }
    })

module.exports = [
    canaraCollectionInsertCron
]