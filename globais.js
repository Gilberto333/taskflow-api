const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('=== AMBIENTE ===');
console.log('Node.js:', process.version);
console.log('Sistema:', os.platform());
console.log('Pasta atual:', __dirname);

console.log('');
console.log('===ARQUIVOS NA PASTA===');
const arquivos = fs.readdirSync('.');
arquivos.forEach((arquivo) => console.log(' --', arquivo));

console.log('');
console.log('===CAMINHO DO FUTURO SERVIDOR===');
const caminhoServer = path.join(__dirname, 'src', 'server.js');
console.log('O servidor ficara em:', caminhoServer);

const arquivoJS = arquivos.filter((a) => a.endsWith('.js'));
console.log('');
console.log(`Arquivos .js encontrados: ${arquivoJS.length}`);

const arquivosBackEnd = fs.readdirSync('../BackEnd/');
arquivosBackEnd.forEach(arquivo => {
    console.log(' -', arquivo);
});

const arquivoJS1 = arquivosBackEnd.filter(a => a.endsWith('.js'));
console.log('');
console.log(`Arquivos .js encontrados: ${arquivoJS1.length}`);