import { Injectable } from '@nestjs/common';

@Injectable()
export class ChecktelService {
  constructor() {}

  async getTell(tell: string) {
    try {
      const verifique = await fetch(
        `${process.env.WHATSAPP_URL}/wa-number-check/55${tell}`,
        {
          headers: {
            'access-token': process.env.WHATSAPP_KEY,
            'Content-Type': 'application/json',
          },
          method: 'POST',
        },
      );
      const data = await verifique.json();
      if (data.status !== 'INVALID_WA_NUMBER') {
        return { exists: true };
      }
      return { exists: false };
    } catch (error) {
      console.log(error);
      return { exists: true, log: 'Não foi possível verificar o número' };
    }
  }
}
