const _ = require("lodash");

function mapJsonValues(sourceJson, mapJson) {
    let resultJson = {};
    if (typeof (mapJson) == 'object' && typeof (sourceJson) == 'object') {
        for (const i of Object.keys(mapJson)) {
            if (typeof (mapJson[i]) != 'object') {
                resultJson[i] = _.get(sourceJson, mapJson[i]) == undefined ? null : _.get(sourceJson, mapJson[i]);
            } else {
                if (Array.isArray(mapJson[i]) && mapJson[i][0] && mapJson[i][0].arrmaptojson) {
                    const arrMap = _.get(sourceJson, mapJson[i][0].arrmaptojson);
                    if (arrMap) {
                        resultJson[i] = [];
                        for (const j of arrMap) {
                            resultJson[i].push(mapJsonValues(j, mapJson[i][0]));
                        }
                    }

                } else {
                    resultJson[i] = mapJsonValues(sourceJson, mapJson[i]);
                }
            }
        }
    } else {
        throw new Error('Type of sourceJson and mapJson should be object');
    }
    return resultJson;
}

module.exports = { mapJsonValues };