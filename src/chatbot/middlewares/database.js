import Database from '../database/';

import Client from '../../app/models/Client';
import Invoice from '../../app/models/Invoice';
import OnlineUsers from '../../app/models/OnlineUsers';
import SupportRequest from '../../app/models/SupportRequest';

const models = [Client, Invoice, OnlineUsers, SupportRequest];

export default function databaseToggler(sessionName) {
  const sqlConnection = Database.connections[sessionName];

  models.map(model => model.init(sqlConnection));

  return true;
}