const { validateSchemeData } = require("../middlewares/validate-schema/dynamic-model");
const DataProcessorService = require('./data-processor.service');


class DataProcessorController extends DataProcessorService{ 

    dynamicDataProcessor = async (request, response) => {
        console.log('BanksController','dynamicDataProcessor', `Request PATH : ${request.originalUrl} : ${JSON.stringify(request.body)}`);
        try {
            const { enterpriseUuid} = request;
            const { body } = request;
            const statementObject = validateSchemeData("62d61aca-0795-ecd9-f8e0-f779050f6f77","","external",'statement', body);
            response.status(200).json({ status: true, data: statementObject });
        } catch (error) {
            console.log('BanksService', 'dynamicDataProcessor', error.message);
            response.status(500).json({ status: false, message: error.message });
        } finally {
            return;
        }
    }

}

module.exports = DataProcessorController ;