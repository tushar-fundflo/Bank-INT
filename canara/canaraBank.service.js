// const { logger } = require('../../../config/logger');
const axios = require("axios");
const crypto = require('crypto');
const jws = require('jws')
const jose = require('node-jose')
let fs = require('fs');
const { join } = require('path')
const { randomUUID } = require('crypto'); // Added in: node v14.17.0
const { toLower } = require('lodash');
const AxionManageController = require('../config/axios-call/axios-call');
const axiosCon = new AxionManageController();


let env = ( toLower(process.env.NODE_ENV) == 'local' || toLower(process.env.NODE_ENV) =='dev' ) ? "dev" : process.env.NODE_ENV ;
if (!process.env.NODE_ENV)env="dev"
const uatClientKey = "5351bac89395b9aa8c307ff1d9c5aed3";
const uatClientSecret = "787887c49ac3c75eff5e86f4d4079049";
const prodClientKey = "a23e89e691edef8230a45ad55d3e6dfa";
const prodClientSecret = "68413895419257327f722bf8e49ee0b9";
const uatUrl = `https://apigway-uat.canarabank.in/uat/u-dab`;
const prodUrl = 'https://api.canarabank.in/live/dab';
const uatSymmKey = '2457bf1dc01659e2cd0af14dced615376aaab76f40c0e89d641421f807112b84';
const prodSymmKey = '775442E06B1371CF13D740FDB22B13F6333B2514A78F555342D64AEDE77FE7E5';


const client_id = env=="dev" ?  uatClientKey : prodClientKey;
const client_secret = env=="dev" ?  uatClientSecret : prodClientSecret;
const redirect_url = "https://oauth-redirect-testurl/";
const client_certificate = "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"
const client_username = "ARS12345";
const client_password = "ARS12345";
const SYMMETRIC_KEY = `${env=="dev"?uatSymmKey:prodSymmKey}`;
const PRIVATE_KEY_PATH = join(__dirname, "./fundflo-private.key");
const PUBLIC_KEY_PATH = join(__dirname, "./fundflo-public.key");
const AuthUrl = `${env=="dev"?uatUrl:prodUrl}/oAuthProvider/oauth2/authorize?response_type=code&client_id=5351bac89395b9aa8c307ff1d9c5aed3&scope=defaultScope&redirect_url=oauth-redirect-testurl`;
const tokenUrl = `${env=="dev"?uatUrl:prodUrl}/oAuthProvider/oauth2/token`;
let VANStatementUrl = `${env=="dev"?uatUrl:prodUrl}/v1/van/transactionInquiry`;
let CASAStatementUrl = `${env=="dev"?uatUrl:prodUrl}/v1/van/casaTransactionInquiry`
const VANCreationUrl = `${env=="dev"?uatUrl:prodUrl}/v1/van/creation`;
const vanNo = `10456000000262555`;
const casaAccNo = '04502020000655';


class CanaraBankService {

    //this will generate an auth code whihc we have to send on the token API 
    #getAuthCode = async () => {
        let res = '';
        const auth = 'Basic ' + Buffer.from(client_username + ':' + client_password).toString('base64');

        let config = {
            method: 'get',
            url: AuthUrl,
            headers: {
                'Authorization': `${auth}`,
            },
            maxRedirects: 0
        };

        await axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                res = error.response?.headers?.location;
                if(res){
                    let data = res.split("=")
                    res = data[1];
                }
            });

        return res;
    }

    //by this we will get recieve refresh and bearer token
    _OauthToken = async () => {
        let authCode = await this.#getAuthCode();
        let data = {
            'grant_type': 'authorization_code',
            'client_id': `${client_id}`,
            'client_secret': `${client_secret}`,
            'code': `${authCode}`,
            'redirect_url': `${redirect_url}`,
        }
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${tokenUrl}`,
            headers: {
                'grant_type': 'authorization_code',
                'client_id': `${client_id}`,
                'client_secret': `${client_secret}`,
                'code': `${authCode}`,
                'redirect_url': `${redirect_url}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };
        let result = await axios.request(config)
        return result.data
    }

    //function to generate random integer, used in ExternalReferenceNo
    #getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    //function to generate key from symmetric key provided by canara bank 
    #generateKeyFromSymmKey = async () => {
        let key = await jose.JWK.asKey({
            kty: 'oct',
            k: Buffer.from(SYMMETRIC_KEY, "hex")
        }, 'json');
        return key;
    }

    encryptPayload = async (payload) => {
        const key = await jose.JWK.asKey({
            kty: 'oct',
            k: Buffer.from(SYMMETRIC_KEY, "hex")
        }, 'json');

        const encrypted = await jose.JWE.createEncrypt(
            { format: 'compact', alg: 'A256KW', enc: 'A128CBC-HS256' },
            key
        )
            .update(JSON.stringify(payload))
            .final();
        return encrypted;
    }

    decryptPayload = async (payload) => {
        const key = await jose.JWK.asKey({
            kty: 'oct',
            k: Buffer.from(SYMMETRIC_KEY, "hex")
        }, 'json');

        let res = '';
        await jose.JWE.createDecrypt(
            key,
        ).decrypt(payload).then((callBackValue) => console.log(res = callBackValue.plaintext.toString()));
        return res;
    }

    generateSignature = (payload) => {
        const fundfloKeyText = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");
        const signerObject = crypto.createSign("RSA-SHA256");
        signerObject.update(JSON.stringify(payload));
        let signature = signerObject.sign({ key: fundfloKeyText }, "base64");
        return signature;
    }

    //here we are making all the common headers and body objects
    #getCommonOptionsForstatements = async (URL, encData, service) => {

        let randomInt = `${this.#getRandomInt(999999999999)}`

        const encryptedPayload = await this.encryptPayload(encData);
        let body = {
            "Request": {
                "body": {
                    "Service": `${service}`,
                    "SessionContext": {
                        "ExternalReferenceNo": randomInt
                    },
                    "encryptData": encryptedPayload
                }
            }
        }
        let plainData = {
            "Request": {
                "body": {
                    "Service": `${service}`,
                    "SessionContext": {
                        "ExternalReferenceNo": `${randomInt}`
                    },
                    "encryptData": encData
                }
            }
        }

        let config = {
            method: 'post',
            url: URL,
            headers: {
                'x-client-id': client_id,
                'x-client-secret':  client_secret,
                'x-api-interaction-id': randomUUID(),
                'x-timestamp': new Date(),
                'x-client-certificate': client_certificate,
                'x-signature': `${this.generateSignature(plainData)}`,
                'Content-Type': 'application/json',
                'Cookie': 'jj',
                'X-Forwarded-For': 'kkk'
            },
            data: body
        };
        return config;

    }

    //this function is used to fetch bank statements
    _VANStatement = async (vanNo, fromDate, toDate) => {
        try {
            // 10456000000262555&fromDate=20230510&toDate=20230630
            let encData = {
                "vanNo": vanNo,
                "uniqRefNo": "",
                "fromDate": parseInt(fromDate),
                "toDate": parseInt(toDate)
            }
            let config = await this.#getCommonOptionsForstatements(VANStatementUrl, encData, "VANTxnInq");
            let res = await axios.request(config);
            let dataToDecrypt = res?.data?.Response?.body?.encryptData;
            let decryptedData = await this.decryptPayload (dataToDecrypt);
            let jsondata = JSON.parse(decryptedData);
            return jsondata;
        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    //function to decrypt data using aes-128-cbc
    _decryptBankData = async (encryptedData) => {
        const key = await this.#generateKeyFromSymmKey();
        const dercypted = await jose.JWE.createDecrypt(key).decrypt(encryptedData)
        let bufferData = dercypted.plaintext
        let ans = JSON.parse(bufferData.toString());
        return ans;
    }

    //this is used to casa statements from canara Bank, currently not fully completed
    _CASAStatement = async (accNo, fromDate, toDate, isAuth, request) => {
        let encData = {
            "acctNo": accNo,
            "uniqRefNo": "",
            "fromDate": parseInt(fromDate),
            "toDate": parseInt(toDate)
        }
        let config = await this.#getCommonOptionsForstatements(CASAStatementUrl, encData, "TxnInqVan");
        if(isAuth){
            let token = await this._OauthToken();
            config["headers"]["Authorization"] = `Bearer ${token.access_token}`;
        }
        // console.log(JSON.stringify(config))
        let res = await axios.request(config);
        let dataToDecrypt = res?.data?.Response?.body?.encryptData;
        let decryptedData = await this.decryptPayload (dataToDecrypt);
        let jsondata = JSON.parse(decryptedData);
        let transactions = jsondata.TxnVanDetails;
        let DBStructArr = [];
        let notProcessedTrans = [];
        for(let trans of transactions ) {
            request.enterpriseUuid = '62d61aca-0795-ecd9-f8e0-f779050f6f77';
            try {
                let processedData = await axiosCon.callAxiosPost( request, 'INTERNAL_DATA_PROCESS', trans);
                if (processedData) {
                    let data = processedData?.data?.data;
                    data = this.#trimAllValues(data);
                    data.accNo = accNo;
                    data.enterpriseUuid = '62d61aca-0795-ecd9-f8e0-f779050f6f77';
                    data.transactionType = "CR";
                    data.moduleName = "AR";
                    if (data.transactionDate) data.transactionDate = new Date(data.transactionDate);
                    if (data.transactionEntryDate) data.transactionEntryDate = new Date(data.transactionEntryDate);
                    let { VanNo } = trans;
                    if (VanNo) {
                        VanNo = VanNo.trim();
                        let userCode = VanNo.substring(VanNo.length - 5, VanNo.length);
                        data.userCode = userCode;
                        data.collectionBankAccountNumber = VanNo.substring(0, 5)
                    }
                    DBStructArr.push(data);
                }
            } catch (error) {
                notProcessedTrans.push(trans);
                console.log("CanaraBankService", "_CASAStatement", `ubale to process transaction with UniqRefNo ${trans.UniqRefNo}` );
            }
        }
        return {
            DBStructArr,
            notProcessedTrans
        };
    }

    //this is still not completed, will take it after van statement , on hold currently
    _VANCreation = async ( accNo, fromDate, toDate, vanNo, isAuth ) => {

        let encData =  {
            "accountNo": accNo,
            "startDate": parseInt(fromDate),
            "endDate": parseInt(toDate),
            "countVAN": 1
        }
        if( vanNo ) {
            encData["virtualAccountDetails"]= [  
                {  
                    "vanNumber": `${vanNo}`  
                },  
            ]    
        }
        let config = await this.#getCommonOptionsForstatements(VANCreationUrl, encData, "VANumResponse");
        if(isAuth){
            let token = await this._OauthToken();
            config["headers"]["Authorization"] = `Bearer ${token.access_token}`;
        }
        let res = await axios.request(config);
        let dataToDecrypt = res?.data?.Response?.body?.encryptData;
        let decryptedData = await this.decryptPayload (dataToDecrypt);
        let jsondata = JSON.parse(decryptedData);
        return jsondata;
    }

    //API to verify signature
    _verifySignature = async (signature) => {
        const encodedPublicKey = fs.readFileSync(PUBLIC_KEY_PATH, "utf8")
        let cc = jws.decode(signature);
        // let ans = jwt.verify(`${signature}`, encodedPublicKey, { algorithms: 'RS256'})

        return JSON.parse(cc.payload)

    }

    transactions = [
        {
            "TxnDate": "2023-06-13",
            "ValueDate": "2023-06-13",
            "TxnDescr": "104560000002625552455     -MOB-IMPS-CR/ZISHAN SAZ/The State //MOBLTA3K3B/9801896453/06/13/2023 06:36:40",
            "DrAmt": "0",
            "CrAmt": "5000",
            "VanNo": "10456000000262555   ",
            "UniqRefNo": "202306130636409612104                    "
        }
    ]

    #trimAllValues = ( obj ) => {
        let returnObj = {};
        for(let entry of Object.entries(obj) ){
            returnObj[entry[0]] = entry[1] ? entry[1].trim() : entry[1] 
        }
        return returnObj;
    }

}

module.exports = CanaraBankService;