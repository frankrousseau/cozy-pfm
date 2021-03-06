// Generated by CoffeeScript 1.7.1
var Bank, BankAccess, BankAccount, americano, async;

americano = require('americano');

async = require('async');

BankAccess = require('./bankaccess');

BankAccount = require('./bankaccount');

module.exports = Bank = americano.getModel('bank', {
  name: String,
  uuid: String
});

Bank.all = function(callback) {
  return Bank.request("all", callback);
};

Bank.getBanksWithAccounts = function(callback) {
  var params;
  params = {
    group: true
  };
  return BankAccount.rawRequest('bankWithAccounts', params, function(err, banks) {
    var bank, uuids, _i, _len;
    if (err != null) {
      return callback(err, null);
    } else if (banks == null) {
      return callback(null, []);
    } else {
      uuids = [];
      for (_i = 0, _len = banks.length; _i < _len; _i++) {
        bank = banks[_i];
        uuids.push(bank.key);
      }
      return Bank.getManyByUuid(uuids, function(err, banks) {
        return callback(err, banks);
      });
    }
  });
};

Bank.getManyByUuid = function(uuids, callback) {
  var params;
  if (!(uuids instanceof Array)) {
    uuids = [uuids];
  }
  params = {
    keys: uuids
  };
  return Bank.request("byUuid", params, callback);
};

Bank.prototype.destroyBankAccess = function(callback) {
  console.log("Deleting all accesses for bank " + this.uuid);
  return BankAccess.allFromBank(this, function(err, accesses) {
    var treatment;
    if (err != null) {
      console.log("Could not get BankAccess from bank -- " + this.uuid);
      return callback(err);
    } else {
      treatment = function(access, callback) {
        return access.destroyAccounts(callback);
      };
      return async.eachSeries(accesses, treatment, function(err) {
        return callback(err);
      });
    }
  });
};
