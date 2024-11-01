import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getSuporte() {
    const dataAtual = new Date();
    const dataUmMesAtras = new Date();
    dataUmMesAtras.setMonth(dataAtual.getMonth() - 1);

    try {
        const req = await prisma.nato_suporte.findMany({
            where: {
                createAt: {
                    gte: dataUmMesAtras, 
                    lte: dataAtual 
                },
                NOT: {
                    urlSuporte: null
                }
            },
            select: {
                id: true,
                urlSuporte: true
            }
        });

        const suporte = req.flatMap((item) => {
            const files = JSON.parse(item.urlSuporte);
            return files.map((file) => ({
                id: item.id,
                urlFileName: file.urlFileName
            }));
        });
        return suporte;
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect();
    }
}
