export default async function WelcomeStage(attndnce, message) {
  try {
    attndnce.stage = 'identification';
    await attndnce.save();

    return ['Bem vindo!\nPra começar informe seu CPF ou CNPJ.\nSe ainda não é cliente digite [1]'];
  } catch (error) {
    console.log('[LOG]: Failed @ WelcomeStage');
    console.log(error);
  }
}