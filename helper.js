const DOWNLOAD_EXCEL = async (strURL) => {

  const https = require('https');
  const axios = require('axios');
  const XLSX = require('xlsx');

  const agent = new https.Agent({
    rejectUnauthorized : false
  });

  const dadosExcel = await axios({
    method : 'get',
    url : strURL,
    httpsAgent : agent,
    responseType : 'arraybuffer'
  });

  const SHEET = XLSX.utils.sheet_to_csv(
    XLSX.read(dadosExcel.data).Sheets[Object.keys( XLSX.read(dadosExcel.data).Sheets)[0]],
    { FS:";", blankrows : false, RS:"\n" }
  ).split("\n");

  if(!SHEET[SHEET.length -1].length) SHEET.pop();

  const SHEET_IN_JSON = [];

  for(const i in SHEET) {
    const obj = {};
    if(i == 0) continue;

    const coluna = SHEET[i].split(';');

    for(const e in coluna) {
      if( SHEET[0].split(';')[e] ) obj[SHEET[0].split(';')[e]] = coluna[e];
    }

    SHEET_IN_JSON.push(obj);
  }

  return SHEET_IN_JSON;
}

module.exports = {
  DOWNLOAD_EXCEL
};