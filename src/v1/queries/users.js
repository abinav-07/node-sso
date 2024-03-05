/* global WEBAPP_DB */
class UserQueries {
  async table() {
    return WEBAPP_DB;
  }
}

module.exports = new UserQueries();
