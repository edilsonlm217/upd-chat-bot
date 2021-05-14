import Database from '../database/';

import Client from '../../app/models/Client';
import Invoice from '../../app/models/Invoice';

const models = [Client, Invoice];

export default function databaseToggler(sessionName) {
  const sqlConnection = Database.connections[sessionName];
  models.map(model => model.init(sqlConnection));
  return true;
}