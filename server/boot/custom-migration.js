'use strict';

module.exports = function updateCustomModels (app, next) {
  // Do not run when server was started via migrate.js
  if (require.main.filename.endsWith('migrate.js')) {
    return next();
  }

  const models = ['Account'];

  const postgres = app.dataSources.postgres;
  postgres.isActual(models, (err, actual) => {
    if (err) {
      throw err;
    }

    let syncStatus = actual ? 'in sync' : 'out of sync';

    console.log('');
    console.log(`Custom models are ${syncStatus}`);
    console.log('');

    if (actual) return next();

    console.log('Migrating Custom Models...');

    postgres.autoupdate(models, (err, result) => {
      if (err) throw err;

      console.log('Custom models migration successful!');
      console.log('');

      next();
    });
  });
}