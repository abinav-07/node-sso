const { Users } = require('../../../database/database_name/models');

class UserQueries {
   table() {
    return Users;
  }

  // Get User using id or any fitler
  async getUser(filter = null) {
    const query = {
      raw: true,
    };

    if (filter) query.where = filter;

    return this.table().findOne(query);
  }

  // Create new user
  async createUser(userData) {
    return this.table().create(userData);
  }

  // update user using id and values
  async updateUser(id, values) {
    return this.table().update(
      { ...values },
      {
        where: {
          id,
        },
      }
    );
  }

  // delete user using id
  async deleteUser(id) {
    return this.table().destroy({
      where: {
        id,
      },
    });
  }
}

module.exports = new UserQueries();
