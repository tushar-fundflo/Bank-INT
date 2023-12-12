const express = require('express');
const router = express.Router();
const CanaraBankController = require('./canaraBank.controller');

let canController = new CanaraBankController();

router.route('/authToken').get(canController.OauthToken );

router.route('/van/statement').get(canController.VANStatement );

router.route('/van/statement/CASA').get(canController.CASAStatement );
router.route('/van/creation').get(canController.VANCreation );

router.route('/encrypt').get(canController.encryptDataForApi);
router.route('/decrypt').get(canController.decryptDataForAPI);
router.route('/sign').get(canController.signPayloadForApi);
router.route('/sign/verify').get(canController.verifySignature);

module.exports = router;
