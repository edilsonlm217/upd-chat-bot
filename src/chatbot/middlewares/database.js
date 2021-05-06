import Database from '../database/';

import Client from '../../app/models/Client';

const models = [Client];

export default function databaseToggler(sessionName) {
  const sqlConnection = Database.connections[sessionName];
  models.map(model => model.init(sqlConnection));
  return true;
}