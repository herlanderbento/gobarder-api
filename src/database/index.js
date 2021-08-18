import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File'

import databaseConfig from '../config/database';

const models = [User, File];

class Database {
  constructor(){
    this.init();
  }

  init(){
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associete && models.associete(this.connection.models))
  }
}

export default new Database();
