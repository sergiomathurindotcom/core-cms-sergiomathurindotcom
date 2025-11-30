export default {
  routes: [
    {
      method: 'POST',
      path: '/backup',
      handler: 'api::backup.backup.createBackup',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/backups',
      handler: 'api::backup.backup.listBackups',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/backups/:filename',
      handler: 'api::backup.backup.downloadBackup',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/backups/:filename',
      handler: 'api::backup.backup.deleteBackup',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/backup/seed',
      handler: 'api::backup.seed.seedDatabase',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/backup/seed',
      handler: 'api::backup.seed.clearSeedData',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/backup/restore',
      handler: 'api::backup.restore.restoreBackup',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/backup/restore/:filename',
      handler: 'api::backup.restore.restoreFromFile',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
