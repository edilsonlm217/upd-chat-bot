import { Op } from 'sequelize';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale'
import Invoice from '../../../app/models/Invoice';

export default async function FinancialStage(attndnce, message) {
  var response = null;

  try {
    switch (message.body) {
      case "1":
        const { login } = attndnce.client;

        const pendingInvoices = await Invoice.findAll({
          where: {
            login: login,
            status: 'vencido',
            deltitulo: {
              [Op.eq]: false,
            },
          },
        });

        if (pendingInvoices.length === 0) {
          const currentInvoice = await Invoice.findOne({
            where: {
              login: login,
              status: 'aberto',
              deltitulo: {
                [Op.eq]: 0,
              },
              datavenc: {
                [Op.gte]: new Date(),
              },
            },
          });

          attndnce.stage = 'completion';
          await attndnce.save();

          response = [
            'Você não possui faturas vencidas',
            `Aqui está o link para seu próximo vencimento:\n${currentInvoice.linhadig}\nhttp://177.53.237.90/boleto/20boleto.php?titulo=${currentInvoice.id}`,
            'Precisa de mais alguma coisa?\n0. Voltar\n#.Finalizar atendimento'
          ];

        } else {
          var msg = [];

          pendingInvoices.map((invoic, index) => {
            const month = format(invoic.datavenc, 'MMMM', { locale: pt });
            if (index === 0) {
              const text = `Fatura de ${month.toUpperCase()}:\n${invoic.linhadig}\nhttp://177.53.237.90/boleto/20boleto.php?titulo=${invoic.id}`;
              msg.push(text);
            } else {
              const text = `\n\nFatura de ${month.toUpperCase()}:\n${invoic.linhadig}\nhttp://177.53.237.90/boleto/20boleto.php?titulo=${invoic.id}`;
              msg.push(text);
            }
          });

          attndnce.stage = 'completion';
          await attndnce.save();

          response = [
            `Verifiquei que você tem ${pendingInvoices.length} ${pendingInvoices.length > 1 ? 'faturas' : 'fatura'} em aberto`,
            `${msg}`,
            'Precisa de mais alguma coisa?\n0. Voltar\n#.Finalizar atendimento',
          ];
        }

        break;

      case "2":
        //
        break;

      case "0":
        attndnce.stage = 'selecting_area_as_client';
        await attndnce.save();

        response = ['Para qual desses assuntos deseja atendimento:\n\n1. Financeiro\n2. Suporte\n3. Falar com atendente'];
        break;

      default:
        response = ['Opção inválida'];
        break;
    }

    return response;
  } catch (error) {
    console.log('[LOG]: Failed @ FinancialStage');
    console.log(error);
  }
}