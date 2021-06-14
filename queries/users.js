/* global WEBAPP_DB */
class UserQueries {
  async table() {
    return WEBAPP_DB;
  }

  async getUser(filter = null) {
    const query = {};

    if (filter) query.where = filter;

    return this.table().findOne(query);
  }
}

module.exports = new UserQueries();
