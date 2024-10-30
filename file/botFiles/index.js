import fs from 'fs'; // Importa o módulo fs para usar createWriteStream
import fsPromises from 'fs/promises'; // Importa fs/promises para usar as funções promisificadas
import path from 'path';
import archiver from 'archiver';
import getArquivos from './db/arquivosDb.js';
import getSuporte from './db/suporteDb.js';
import suspenderDoc from './db/suspenderDoc.js';
import suspenderSuporte from './db/suspenderSuporte.js';
import getAllFiles from './db/getAllFiles.js';

const pastaSuporte = '../suporteDocs'
const pastaRgCnh = '../arquivos';
const pastaDestinoOutdate = '../outdate';

async function main() {
    const suportes = await getSuporte();
    const nomeSuportes = suportes.map(suporte => suporte.urlFileName);
    const idSuportes = suportes.map(suporte => suporte.id);


    const arquivos = await getArquivos();
    const nomeArquivos = arquivos.map(arquivo => arquivo.nomeArquivo);
    const idArquivos = arquivos.map(arquivo => arquivo.id);
    const allArquivos = await getAllFiles(idArquivos)
    
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString('pt-BR').split('/').join('-');

    try {
        const suportesNoDiretorio = await fsPromises.readdir(pastaSuporte);
        const suportesParaCompactar = suportesNoDiretorio.filter(suporte => !nomeSuportes.includes(suporte));

        const arquivosNoDiretorio = await fsPromises.readdir(pastaRgCnh);
        const arquivosParaCompactar = arquivosNoDiretorio.filter(arquivo => !nomeArquivos.includes(arquivo));

        if (arquivosParaCompactar.length === 0 && suportesParaCompactar.length === 0) {
            console.log('Nenhum arquivo para compactar.');
            return;
        }
        
        if(arquivosParaCompactar.length > 0){
            // Criar o arquivo zip
            const output = fs.createWriteStream(path.join(pastaDestinoOutdate, `arquivos-${dataFormatada}.zip`));
            const archive = archiver('zip');
            
            // Eventos de finalização da compactação dos arquivos zip e deletar os arquivos após a compactação
            
            output.on('close', async () => {
              console.log(`Arquivo zip arquivos-${dataFormatada} criado com sucesso. Total de bytes: ${archive.pointer()}`);
              suspenderDoc(idArquivos);
              // Deletar os arquivos após a compactação
              for (const arquivo of arquivosParaCompactar) {
                const caminhoCompleto = path.join(pastaRgCnh, arquivo);
                try {
                  await fsPromises.unlink(caminhoCompleto);
                } catch (err) {
                  console.error(`Erro ao deletar o arquivo ${arquivo}:`, err);
                }
              }
            });
            archive.on('error', (err) => {
              throw err;
            });
            
            archive.pipe(output);
            
            // Adicionar arquivos ao zip
            arquivosParaCompactar.forEach(arquivo => {
              const caminhoCompleto = path.join(pastaRgCnh, arquivo);
              const arq = allArquivos.find(arq => arq.nomeArquivo === arquivo);
              if(arq){
                const novoNome = `${arq.id}-${arq.tag}`;
                archive.file(caminhoCompleto, { name: novoNome });
              }
              else{
                archive.file(caminhoCompleto, { name: arquivo });
              }
          });
            
            // Finalizar o zip
            await archive.finalize();
          }else{
            console.log('Nenhum arquivo RG/CNH para compactar.');
          }
          
          if(suportesParaCompactar.length > 0){
            const outputSuporte = fs.createWriteStream(path.join(pastaDestinoOutdate, `suportes-${dataFormatada}.zip`));
            const archiveSuporte = archiver('zip');
            
            
            outputSuporte.on('close', async () => {
              console.log(`Arquivo zip suportes-${dataFormatada} criado com sucesso. Total de bytes: ${archiveSuporte.pointer()}`);
              suspenderSuporte(idSuportes);
              for (const suporte of suportesParaCompactar) {
                const caminhoCompleto = path.join(pastaSuporte, suporte);
                try {
                  await fsPromises.unlink(caminhoCompleto);
                } catch (err) {
                  console.error(`Erro ao deletar o arquivo ${suporte}:`, err);
                }
              }
            })

            archiveSuporte.on('error', (err) => {
                throw err;
            });

            archiveSuporte.pipe(outputSuporte);
            suportesParaCompactar.forEach(suporte => {
                const caminhoCompleto = path.join(pastaSuporte, suporte);
                archiveSuporte.file(caminhoCompleto, { name: suporte });
            });
            
            await archiveSuporte.finalize();
        }else{
            console.log('Nenhum arquivo Suporte para compactar.');
        }

    } catch (erro) {
        console.error('Erro:', erro);
    }
}

main();