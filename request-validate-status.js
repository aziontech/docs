const https = require('https');
const fs = require('fs');

function fetchJson(url) {
  console.log("Baixando JSON");
	
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`Found ${json.length} urls`)
          resolve(json);
        } catch (error) {
          reject(`Erro ao parsear JSON: ${error}`);
        }
      });
    }).on('error', (error) => {
      reject(`Erro na requisição para ${url}: ${error.message}`);
    });
  });
}


function checkUrlStatus(item) {
  return new Promise((resolve) => {
    console.log(`Checando URL: ${item.url}`);
    https.get(item.url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400) {
        resolve({ status: 'redirect', filePath: item.filePath, url: item.url });
      } else {
        resolve({ status: 'ok', filePath: item.filePath, url: item.url });
      }
    }).on('error', () => resolve({ status: 'error', filePath: item.filePath, url: item.url }));
  });
}

// Função recursiva para processar URLs uma a uma
async function processUrlsRecursively(urls, index = 0, redirectList = []) {
  if (index >= urls.length) {
    // Salva a lista de redirecionamentos quando terminar
    fs.writeFileSync('./redirects.json', JSON.stringify(redirectList, null, 2));
    console.log('Arquivo redirects.json salvo com sucesso!');
    return;
  }

  try {
    const result = await checkUrlStatus(urls[index]);
    
    if (result.status === 'redirect') {
      redirectList.push({ filePath: result.filePath, url: result.url });
      console.log(`Redirecionamento encontrado: ${result.url}`);
    } else {
      console.log(`URL processada: ${result.url}`);
    }
  } catch (error) {
    console.error(`Erro ao processar URL ${urls[index].url}: ${error}`);
  }

  processUrlsRecursively(urls, index + 1, redirectList);
}

(async () => {
  const jsonUrl = 'https://www.azion.com/pt-br/docs-path-by-url.json';
  
  try {
    const jsonArray = await fetchJson(jsonUrl);
    await processUrlsRecursively(jsonArray); // Inicia a verificação recursiva das URLs
  } catch (error) {
    console.error(`Erro ao processar URLs: ${error}`);
  }
})();
