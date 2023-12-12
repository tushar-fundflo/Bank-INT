function getDates(){
    const todaysDate = new Date();
    const yyyy = todaysDate.getFullYear();
    const mm = (`0${todaysDate.getMonth() + 1}`).slice(-2);
    const dd = (`0${todaysDate.getDate()}`).slice(-2);
    const yesterdaysDate = new Date(Date.now() - 86400000);
    const yyyyy = yesterdaysDate.getFullYear();
    const ymm = (`0${yesterdaysDate.getMonth() + 1}`).slice(-2);
    const ydd = (`0${yesterdaysDate.getDate()}`).slice(-2);
    return {
        today: `${yyyy}${mm}${dd}`,
        yesterday: `${yyyyy}${ymm}${ydd}`
    }
}

function getTime(start, step){
    return {
        start: `${start}`,
        end: `${Number(start) - Number(step)}`
    }
}

module.exports = {
    getDates,
    getTime
}