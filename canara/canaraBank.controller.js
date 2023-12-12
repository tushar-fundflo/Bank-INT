// const { logger } = require('../../../config/logger');
const { response } = require('express');
const CanaraBankService = require('./canaraBank.service');


// process 
// 1.       we need to get auth code by caaling api in postman, name -> 1.gen auth code
// 2.      then we need to get the oth token by adding the code in it in postman, name -> 2.Canara Bank OAuth
//          this token will be need to create van (virtual account number) and to get casa statements
//          and this access token will expire in 60 mins and refresh token expires in one month
// 3.      Then we will be calling either our api "3.FF VAN STATEMENT" for getting van statements or 
//          we can call 3 apis to do so
// 3.1     first we have to encrypt the payload using this api in postman "FF encrypt data" and the sign the payload using this api in  
//          postman "FF sign payload" and then call the final api "van statement", this will return us the statements


class CanaraBankController extends CanaraBankService {

    OauthToken = async (request, response) => {
        try {
            console.log('CanaraBankController','OauthToken', `Request PATH : ${request?.url}`);
            let data = await this._OauthToken();
            return response.status(200).json({ message: "successfull", data: data });

        } catch (error) {
            console.log('CanaraBankController','OauthToken', `OauthToken error: ${error.message}`);
            return response.status(500).json({
                statusCode: 500,
                message: {
                    error: `canara bank OauthToken integrtation ERROR: ${error.message}`,
                },
            });
        }
    }

    //this function is used to fetch bank statements
    VANStatement = async (request, response) => {
        try {
            console.log('CanaraBankController','VANStatement', `Request PATH : ${request?.url}`);
            let { vanNo, fromDate, toDate } = request.query;
            let result = await this._VANStatement( vanNo, fromDate, toDate );
            return response.status(200).json({ data: result })

        } catch (error) {
            console.log('CanaraBankController','VANStatement', `VANStatement Error : ${error?.message}`);
            try {
                let dataToDecrypt = error?.response?.data?.Response?.body?.encryptData;
                let decryptedData = await this.decryptPayload (dataToDecrypt);
                return response.status(500).json({
                    statusCode: 500,
                    message: {
                        error: `canara bank CASA VAN Statement integrtation ERROR: ${error.message}`,
                        data: decryptedData
                    },
                });
            } catch (e) {
                return response.status(500).json({
                    statusCode: 500,
                    message: { error: `canara bank CASA VAN Statement integrtation ERROR: ${error.message}`},
                });
            }
        }
    }

    //this is used to encrypt data and send to API
    encryptDataForApi = async (request, response) => {
        try {
            console.log('CanaraBankController','encryptDataForApi', `Request PATH : ${request?.url}`);
            let { dataToEncrypt } = request.body;
            return response.status(200).json({ data: await this.encryptPayload(dataToEncrypt) })

        } catch (error) {
            console.log('CanaraBankController','encryptDataForApi', `encryptDataForApi Error : ${error?.message}`);
            response.status(500).json({ error: error.message })
        }
    }

    //this is used to decrypt data and send to API
    decryptDataForAPI = async (request, response) => {
        try {
            let { encryptedData } = request.body;
            return response.status(200).json({ decryptedData: await this.decryptPayload(encryptedData) })

        } catch (error) {
            console.log('CANARA_BANK','decryptDataForAPI', `Error : ${error.message}`);
            return response.status(500).json({ message: error.message })
        }
    }

    //this is used to sign the payload data and send it to API
    signPayloadForApi = async (request, response) => {
        try {
            let { dataToSign } = request.body;
            return response.status(200).json({ signature: await this.generateSignature(dataToSign) });

        } catch (error) {
            console.log('CANARA_BANK','signPayloadForApi', `Error : ${error}`);
            response.status(500).json({ error: error.message })
        }
    }

    //this is used to casa statements from canara Bank, currently not fully completed
    CASAStatement = async (request, response) => {
        try {
            console.log('CanaraBankController','CASAStatement', `Request PATH : ${request?.url}`);
            let { accNo, fromDate, toDate, isAuth } = request.query;
            if( !accNo || !fromDate || !toDate ){
                return response.status(500).json({message: "accNo, fromDate, toDate is mandatory"})
            }
            return response.status(200).json({ data: await this._CASAStatement(accNo, fromDate, toDate, isAuth, request) })

        } catch (error) {
            console.log('CANARA_BANK','CASAStatement', ` CASAStatement Error : ${error.message}`);
            try {
                let dataToDecrypt = error?.response?.data?.Response?.body?.encryptData;
                let decryptedData = await this.decryptPayload (dataToDecrypt);
                return response.status(500).json({
                    statusCode: 500,
                    message: {
                        error: `canara bank CASA VAN Statement integrtation ERROR: ${error.message}`,
                        data: decryptedData
                    },
                });
            } catch (e) {
                return response.status(500).json({
                    statusCode: 500,
                    message: { error: `canara bank CASA VAN Statement integrtation, error in decrypting,  ERROR: ${error.message}`},
                });
            }
        
        }
    }

    //API to verify signature
    verifySignature = async (request, response) => {
        try {
            let { signature } = request.body;
            return response.status(200).json({ verifiedData: ans, data: await this._verifySignature(signature) })

        } catch (error) {
            console.log('CANARA_BANK','verifySignature', `Error : ${error}`);
            return response.status(500).json({ message: error.message })
        }
    }

    //this is still not completed, will take it after van statement
    VANCreation = async (request, response) => {
        try {
            console.log('CanaraBankController','VANCreation', `Request PATH : ${request?.url}`);
            let { accNo, fromDate, toDate, vanNo, isAuth } = request.query;
            if( !accNo || !fromDate || !toDate ){
                return response.status(500).json({message: "accNo, fromDate, toDate is mandatory"})
            }
            return response.status(200).json({ data: await this._VANCreation(accNo, fromDate, toDate, vanNo, isAuth) })

        } catch (error) {
            console.log('CANARA_BANK','VANCreation', `VANCreation Error : ${error}`);
            try {
                let dataToDecrypt = error?.response?.data?.Response?.body?.encryptData;
                let decryptedData = await this.decryptPayload (dataToDecrypt);
                return response.status(500).json({
                    statusCode: 500,
                    message: {
                        error: `canara bank CASA VAN Statement integrtation ERROR: ${error.message}`,
                        data: decryptedData
                    },
                });
            } catch (e) {
                return response.status(500).json({
                    statusCode: 500,
                    message: { error: `canara bank CASA VAN Statement integrtation ERROR: ${error.message}`},
                });
            }
            
        }
    }

}

module.exports = CanaraBankController