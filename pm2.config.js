module.exports = {
  apps: [
    {
      name: 'Enward',
      script: "../../Documents/NovelAPI/enwardRPG.mjs",
      exec_mode: 'cluster',
      ignore_watch: '[saves.mjs]',
      instances: 1,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      max_memory_restart: '200M',
      restart_delay: 1000, // Initial delay in milliseconds
      exp_backoff_restart_delay: 1000, // Delay multiplier for each restart
    },
  ],
}