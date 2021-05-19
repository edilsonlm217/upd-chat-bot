import WelcomeStage from './WelcomeStage/index';
import ProcedureCheckStage from './ProcedureCheckStage/index';
import IdentificationStage from './IdentificationStage/index';
import SelectAreaAsClient from './SelectAreaAsClient/index';
import CompletionStage from './CompletionStage/index';
import NonClientStage from './NonClientStage/index';
import FinancialStage from './FinancialStage/index';
import SupportStage from './SupportStage/index';

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
    description: 'Stage for ISP customers only. Identifies which menu the user is trying to access',
  },
  "financial": {
    execute: async (attndnce, message) => await FinancialStage(attndnce, message),
    description: 'Responsible for executing "trust unlock" logic',
  },
  "support": {
    execute: async (attndnce, message) => await SupportStage(attndnce, message),
    description: '',
  },
  "procedure_check": {
    execute: async (attndnce, message) => await ProcedureCheckStage(attndnce, message),
    description: '',
  },
  "non_client": {
    execute: async (attndnce, message) => await NonClientStage(attndnce, message),
    description: 'Responsible for identifying which operation a non-customer contact wants to perform',
  },
  "completion": {
    execute: async (attndnce, message) => await CompletionStage(attndnce, message),
    description: 'Responsible for validating if the user wants to do anything or finish the service',
  },
}