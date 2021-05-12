const bot = require('venom-bot');
import { differenceInMinutes } from 'date-fns';
import fs from 'fs';

import Tenant from '../app/schema/Tenant';
import InService from '../app/schema/InService';

import stages from './stages/index';

export default new function Chatbot() {
  const middlewares = {};
  const sessions = {};
  const atendimentos = {};

  function constructor() { }

  function use(funcName, func) {
    middlewares[funcName] = func;
  }

  async function runMiddlewares(sessionName) {
    Object.entries(middlewares).map(middleware => {
      const run = middleware[1];
      run(sessionName);
    });
  }

  async function listenMessages(sessionName) {
    try {
      const client = await bot.create(sessionName, undefined, undefined, {
        logQR: true,
        disableWelcome: true,
        autoClose: 30000,
      });

      sessions[sessionName] = client;

      client.onMessage(async message => {
        if (message.from === '559236483445@c.us') {
          var atendimento = atendimentos[message.from];
          console.log(atendimento ? atendimento : 'Iniciando novo atendimento');

          // area: identification
          if (!atendimento) {
            client.sendText(message.from, 'Bem vindo!\nPra começar informe seu CPF ou CNPJ.\nSe ainda não é cliente digite [1]');

            atendimentos[message.from] = {
              area: 'identification',
              action: 'handleResponse',
              isClient: null,
              controle: null,
            };

            return;
          }

          // area: identification
          // action: handleResponse
          if (atendimento.area === 'identification' && atendimento.action === 'handleResponse') {
            // Verifica se resposta contém um CPF/CNPJ
            if (message.body.length === 11 || message.body.length === 14) {
              atendimento.area = 'client_area';
              atendimento.action = 'handleResponse';
              atendimento.isClient = true;
              atendimento.controle = 'client';

              client.sendText(message.from, 'Para qual desses assuntos deseja atendimento:\n\n1. Financeiro\n2. Suporte\n');

              atendimentos[message.from] = atendimento;
              return;
            }

            // Verifica se resposta solicita atendimento avulso
            if (message.body == '1') {
              atendimento.area = 'non_client_area';
              atendimento.action = 'handleResponse';
              atendimento.isClient = false;
              atendimento.controle = 'non_client';

              client.sendText(message.from, 'Para qual desses assuntos deseja atendimento:\n\n1. Conhecer planos\n2. Falar com atendente');

              atendimentos[message.from] = atendimento;
              return;
            }

            client.sendText(message.from, 'Opção inválida');
            return;
          }

          // area: client_area
          // action: handleResponse
          if (atendimento.area === 'client_area' && atendimento.action === 'handleResponse') {
            switch (message.body) {
              case '1':
                // Financeiro
                atendimento.area = 'financeiro';
                atendimento.action = 'handleResponse';
                atendimento.isClient = true;
                atendimento.controle = 'client.financeiro';

                await client.sendText(message.from, '*Financeiro*\n1. Segunda via de fatura\n2. Desbloqueio de confiança');
                await client.sendText(message.from, '0. Voltar');

                atendimentos[message.from] = atendimento;
                break;

              case '2':
                // Suporte
                atendimento.area = 'suporte';
                atendimento.action = 'handleResponse';
                atendimento.isClient = true;
                atendimento.controle = 'client.suporte';

                client.sendText(message.from, '*Suporte*\n1. Sem internet\n2. Internet lenta\n 3. Consultar chamado');

                atendimentos[message.from] = atendimento;
                console.log(atendimentos[message.from]);
                break;

              default:
                // Opção inválida
                client.sendText(message.from, 'Opção inválida');
                console.log(atendimentos[message.from]);
                break;
            }

            // Interromper onMessage();
            return;
          }

          // area: non_client_area
          // action: handleResponse
          if (atendimento.area === 'non_client_area' && atendimento.action === 'handleResponse') {
            if (message.body === '1') {
              // Conhecer planos
              await client.sendText(message.from, '*Temos o plano ideal para você:*\n\n*PLANOS COM CABO*\nBásico 5 Megas: R$ 50,00 / mês\nEconômico 10 Megas: R$ 70,00 / mês\n\n*PLANOS COM FIBRA*\nPadrão 20 Megas: R$ 100,00 / mês\nProfissional 30 Megas: R$ 120,00 / mês\nSmart 50 Megas: R$ 150,00 / mês\nTopFibra 100 Megas: R$ 200,00 / mês\n\n- Taxa de ativação R$ 100,00\n- Roteador* R$ 100,00\n\n(*) nos planos a partir de 50 megas WIFI grátis com roteador em comodato\n\nPara contratar acesse:\n*www.updata.com.br/planos*');
              await client.sendText(message.from, 'Se era somente isso, você pode:\n0. Voltar\n#. Finalizar atendimento');

              atendimento.area = 'non_client_area';
              atendimento.action = 'goback';

              atendimentos[message.from] = atendimento;
              return;
            }

            // Opção inválida
            client.sendText(message.from, 'Opção inválida');
            return;
          }

          // area: financeiro;
          // action: handleResponse
          if (atendimento.area === 'financeiro' && atendimento.action === 'handleResponse') {
            if (message.body == '1') {
              // Segunda via de fatura
              client.sendText(message.from, 'www.updata/fatura/fulano.pdf');
              return;
            }

            if (message.body == '2') {
              // Desbloquear internet
              client.sendText(message.from, 'Internet desbloqueada até dia 22/07/1992');
              return;
            }

            if (message.body == '0') {
              // Voltar
              atendimento.area = 'client_area';
              atendimento.action = 'handleResponse';
              atendimento.isClient = true;
              atendimento.controle = 'client';

              client.sendText(message.from, 'Para qual desses assuntos deseja atendimento:\n\n1. Financeiro\n2. Suporte\n');
              return;
            }

            // Opção inválida
            client.sendText(message.from, 'Opção inválida');
            return;
          }

          // area: suporte;
          // action: handleResponse
          if (atendimento.area === 'suporte' && atendimento.action === 'handleResponse') {
            if (message.body == '1') {
              // Sem internet
              client.sendText(message.from, 'Verificamos aqui e você possui internet');
              return;
            }

            if (message.body == '2') {
              // Internet lenta
              client.sendText(message.from, 'Verificamos aqui e sua internet não apresenta lentidão');
              return;
            }

            if (message.body == '3') {
              // Consultar chamado
              client.sendText(message.from, 'Verificamos que não há chamado aberto para você');
              return;
            }

            // Opção inválida
            client.sendText(message.from, 'Opção inválida');
            return;
          }

          // area: non_client_area
          // action: goback
          if (atendimento.area === 'non_client_area' && atendimento.action === 'goback') {
            if (message.body == '0') {
              // Voltar
              atendimento.area = 'non_client_area';
              atendimento.action = 'handleResponse';
              atendimento.isClient = false;
              atendimento.controle = 'non_client';

              client.sendText(message.from, 'Para qual desses assuntos deseja atendimento:\n\n1. Conhecer planos\n2. Falar com atendente');

              atendimentos[message.from] = atendimento;
              return;
            }

            if (message.body == '#') {
              // Finalizar atendimento
              client.sendText(message.from, 'Atendimento finalizado');
            }
          }


          // Não deu match com nenhuma opção
          console.log('Não entrei em nada');
        }
      });
    } catch (error) {
      console.log('[LOG]: Failed to listen to messages');
    }
  }

  async function getStage(message, sessionName) {
    try {
      const { sender } = message;
      const [senderId,] = sender.id.split('@c.us');

      const service = await InService.findOne({ senderId });

      if (service) {
        const { lastMessageReceivedAt } = service;

        if (differenceInMinutes(new Date(), lastMessageReceivedAt) > 15) {
          console.log('[LOG]: Atendimento expirado');
          service.remove();
        } else {
          console.log('[LOG]: Atendimento encontrado');
          return service.stage;
        }
      }

      console.log('[LOG]: Iniciando novo atendimento');

      // Inicia um novo atendimento
      const newService = await InService.create({
        senderId,
        sessionName,
        lastMessageReceivedAt: new Date(),
      });

      return newService.stage;
    } catch (error) {
      console.log('[LOG]: Failed to get conversation stage');
    }
  }

  async function reload() {
    try {
      fs.readdir('./tokens', (error, files) => {
        if (files) {
          files.map(async file => {
            const [sessionName] = file.split('.data.json');

            const tenant = await Tenant.findOne({
              sessionName,
              isActive: true,
            });

            if (!tenant) {
              return;
            }

            listenMessages(tenant.sessionName);

          });
        }
      });

      console.log('[LOG]: Whatsapp sessions are going to reload');
    } catch (error) {
      console.log('[LOG]: Failed to reload whatsapp sessions');
    }
  }

  const ChatbotPrototype = {
    sessions: sessions,
    middlewares: middlewares,
    init: () => { reload() },
    listenMessages: (sessionName) => { listenMessages(sessionName) },
    use: (funcName, func) => { use(funcName, func) }
  }

  constructor.prototype = ChatbotPrototype;

  let instance = new constructor();
  return instance;
}