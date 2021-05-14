import WelcomeStage from './WelcomeStage/index';
import IdentificationStage from './IdentificationStage/index';

exports.stages = {
  "welcome": {
    execute: async (attndnce, message) => await WelcomeStage(attndnce, message),
    description: 'Welcome message'
  },
  "identification": {
    execute: async (attndnce, message) => await IdentificationStage(attndnce, message),
    description: 'Identify whether the contact is a customer and present the menu equivalent to the response',
  },
  "non_client": {
    execute: () => { return 'non_client' }
  },
  "selecting_area_as_client": {
    execute: () => { return 'selecting_area_as_client' }
  },
  "non_client_1": {
    execute: () => { return 'non_client_1' }
  },
}