import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getArquivos() {
    const dataAtual = new Date();
    const dataUmMesAtras = new Date();
    dataUmMesAtras.setMonth(dataAtual.getMonth() - 1)
    try{
        const arquivos = await prisma.nato_solicitacoes_certificado.findMany({
            where: {
                createdAt: {
                    gte: dataUmMesAtras,
                    lte: dataAtual
                },
                Andamento: {
                    notIn: ['EMITIDO', 'APROVADO', 'REVOGADO']
                },
                OR: [
                    { uploadCnh: { not: '' } },
                    { uploadRg: { not: '' } }
                ]
            },
            select:{
                id: true,
                createdAt: true,
                uploadCnh: true,
                uploadRg: true
            }
        });
        const arquivosFiltrados = arquivos.map((item) => {
                if(item.uploadCnh !== ''){
                    const nomeArquivo = item.uploadCnh.split('uploads/')[1];
                    return {
                        id: item.id,
                        data: item.createdAt,
                        arquivo: nomeArquivo,
                        tag: 'CNH'
                    }
                }
                else{
                    const nomeArquivo = item.uploadRg.split('uploads/')[1];
                        return {
                            id: item.id,
                            data: item.createdAt,
                            arquivo: nomeArquivo,
                            tag: 'RG'
                        }
                    }
        });
        const nomeArquivos = arquivosFiltrados.map((arquivo) => {
          return{
            id: arquivo.id,
            nomeArquivo: arquivo.arquivo,
            tag: arquivo.tag
          }
        });
        return nomeArquivos;
        
    }catch(err){
        console.log(err);
    }finally{
        await prisma.$disconnect();
    }
}