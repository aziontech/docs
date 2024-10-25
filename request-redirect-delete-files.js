import fs from 'fs';
import path from 'path';

async function deleteFiles(filePathList) {
  for (const item of filePathList) {
    const { filePath } = item;
    try {
      const absolutePath = path.resolve(filePath);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        console.log(`Arquivo deletado: ${absolutePath}`);
      } else {
        console.log(`Arquivo não encontrado: ${absolutePath}`);
      }
    } catch (error) {
      console.error(`Erro ao deletar o arquivo ${filePath}:`, error);
    }
  }
}


function main() {
  try {
    const jsonFilePath = './request-ptbr-redirects.json';
    const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    
    deleteFiles(data);
  } catch (error) {
    console.error('Erro ao processar o arquivo JSON:', error);
  }
}

main();
