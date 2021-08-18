import Sequelize, { Model } from "sequelize";
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );


    this.addHook('beforeSave', async user => {
      if(user.password){
        const salt = await bcrypt.genSalt(8);
        user.password_hash = await bcrypt.hash(user.password, salt)
      }
    })

    return this;
  }

  static associate(models){
    this.belongsTo(models.File, {foreignKey: 'avatar_id'});
  }

  checkPassword(password){
    return bcrypt.compare(password, this.password_hash);
  }

}

export default User;
