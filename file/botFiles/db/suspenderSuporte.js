import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function suspenderSuporte(ids) {
    const id = ids
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    console.log("🚀 ~ suspenderDoc ~ dataAtual:", dataAtual)

    try {
        await prisma.nato_suporte.updateMany({
          where: {
            id:{
              notIn: id
            },
            AND:{
              urlSuporte: {
                not: null || ''
              },
            }
          },
          data:{
            imgSuspensa: `IMAGEM SUSPENSA - ${dataAtual}`,
          }
        })
    }catch(err){
        console.log(err);
    }finally{
        await prisma.$disconnect();
    }
}