const { chromium, selectors } = require('playwright-core');
const { DOWNLOAD_EXCEL } = require('./helper');
const { SELECTORS, URL } = require('./locators.json');
const { CONFIGURACAO } = require('./conf.json');

( async () => {

  try {

    const PLANILHA = await DOWNLOAD_EXCEL(URL.DOWNLOAD_EXCEL);
    const browser = await chromium.launch(CONFIGURACAO.CHROME);
    const page = await browser.newPage();

    await page.setViewportSize(CONFIGURACAO.VIEW);

    await page.goto(URL.HOME);
    await page.waitForSelector(SELECTORS.BOTAO_START);

    await page.click(SELECTORS.BOTAO_START);

    for( const i in PLANILHA) {

      await page.evaluate( (jsonDados) => {
        const INPUTS = Object.keys(jsonDados);

        for( const n in INPUTS) {
          document.evaluate(
            `//label[text()="${INPUTS[n].trim()}"]`,
            document, null,
            XPathResult.FIRST_ORDERED_NODE_TYPE, 
          ).singleNodeValue.nextElementSibling.value = jsonDados[INPUTS[n]];
        }
      }, PLANILHA[i]);

      //disuse
      const isSubmit = await page.$(SELECTORS.BOTAO_SUBMIT);

      if(isSubmit) await page.click(SELECTORS.BOTAO_SUBMIT);
    }

    await page.waitForSelector(SELECTORS.MENSAGEM_SUCESSO);
    const $RESULTADO = await page.innerText(SELECTORS.MENSAGEM_SUCESSO);

    console.log('\n', $RESULTADO);

    await page.close();
    process.exit();

  } catch (e) {
    console.log(` ... BAD :(  ${e.message}`);
    process.exit(1);
  }




})();
