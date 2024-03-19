const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here such as belongsto, has, hasMany and so on
    }
  }
  Users.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      full_name: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(256),
        allowNull: false,
        validate: {
          isEmail: true,
        },
        unique: true,
      },
      password: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      token: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
      token_expiry_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      createdAt:"created_at",
    updatedAt: "updated_at",
      sequelize,
      modelName: 'Users',
      tableName: 'users',
    }
  );
  return Users;
};
