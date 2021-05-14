import WelcomeStage from './WelcomeStage/index';
import IdentificationStage from './IdentificationStage/index';
import SelectAreaAsClient from './SelectAreaAsClient/index';
import CompletionStage from './CompletionStage/index';

exports.stages = {
  "welcome": {
    execute: async (attndnce, message) => await WelcomeStage(attndnce, message),
    description: 'Welcome message'
  },
  "identification": {
    execute: async (attndnce, message) => await IdentificationStage(attndnce, message),
    description: 'Identify whether the contact is a customer and present the menu equivalent to the response',
  },
  "selecting_area_as_client": {
    execute: async (attndnce, message) => await SelectAreaAsClient(attndnce, message),
    description: 'Internship for ISP customers only. Identifies which menu the user is trying to access',
  },
  "completion": {
    execute: async (attndnce, message) => await CompletionStage(attndnce, message),
    description: 'Responsible for validating if the user wants to do anything or finish the service',
  },
}