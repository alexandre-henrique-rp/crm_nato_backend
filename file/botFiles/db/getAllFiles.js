import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getAllFiles(id) {
  try {
    const arquivos = await prisma.nato_solicitacoes_certificado.findMany({
      where: {
        id: {
          notIn: id
        },
        OR: [
          { uploadCnh: { not: '' } },
          { uploadRg: { not: '' } }
        ],
      },
      select: {
        id: true,
        createdAt: true,
        uploadCnh: true,
        uploadRg: true
      }
    });
    const arquivosFiltrados = arquivos.map((item) => {
      if (item.uploadCnh !== '') {
        const nomeArquivo = item.uploadCnh.split('uploads/')[1];
        return {
          id: item.id,
          data: item.createdAt,
          arquivo: nomeArquivo,
          tag: 'CNH'
        }
      }
      else {
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
      return {
        id: arquivo.id,
        nomeArquivo: arquivo.arquivo,
        tag: arquivo.tag
      }
    });
    return nomeArquivos;
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect();
  }
}