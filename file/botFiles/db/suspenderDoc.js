import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function suspenderDoc(ids) {
    const id = ids
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    console.log("🚀 ~ suspenderDoc ~ dataAtual:", dataAtual)

    try {
        await prisma.nato_solicitacoes_certificado.updateMany({
          where: {
            id:{
              notIn: id
            },
            OR: [
              { uploadCnh: { not: '' } },
              { uploadRg: { not: '' } }
          ]
          },
          data:{
            docSuspenso: `DOCUMENTO SUSPENSO - ${dataAtual}`,
          }
        })
    }catch(err){
        console.log(err);
    }finally{
        await prisma.$disconnect();
    }
  
}