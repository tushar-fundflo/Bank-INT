// const { logger } = require('../../config/logger');
const { urlMap } = require('./url-map');
const fs = require('fs');

const jwt = require('jsonwebtoken');
const axios = require("axios");
const moment = require('moment');
const path = require('path');

const jwtPrivateKey = path.join(__dirname, '../../middlewares/keys/internal-jwt.key/private-2048.key');


class AxionManageController {

    callAxiosPost = async (request, urlType, requestBody) => {
        console.log('AxionManageController', 'callAxiosPost', (request ? `Request PATH : ${request.originalUrl}` : ''));
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': (request ? await this.generateJwt(request) : '')
        };
        const apiUrl = urlMap[urlType];
        return await axios.post(apiUrl, requestBody, {
            headers: headers
        }).then((response) => {
            return response;
        })
            .catch((error) => {
                console.log('AxionManageController', 'callAxiosPost', error.message);
                throw error;
            });
    }

    generateJwt = async (request) => {
        console.log('AxionManageController', 'generateJwt', `Request PATH : ${request.originalUrl}`);
        try {
            let token = (request.headers && request.headers.authorization ? request.headers.authorization.split(" ")[1] : null);
            if (!token) {
                let JWTHeader = {
                    time: moment().local(),
                    createdFrom: request.createdFrom,
                    xApiKey: request.xApiKey,
                    eid: request.enterpriseUuid,
                };
                // return jwt.sign(JWTHeader, enterpriseUuid);
                let jwtOptions = {
                    algorithm: 'RS256',
                    issuer: 'System',
                    audience: 'System',
                    expiresIn: "24h",
                    subject: request.enterpriseUuid
                };
                const jwtKeyText = fs.readFileSync(jwtPrivateKey, "utf8");
                token = jwt.sign(JWTHeader, jwtKeyText, jwtOptions);
            }
            return 'Bearer ' + token;
        } catch (error) {
            console.log('AuthenticationController', '_generateJwt', error.message);
            throw error;
        }
    }


}
module.exports = AxionManageController;
