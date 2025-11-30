import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

interface DbConnection {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export default {
  async createBackup(ctx) {
    try {
      // Get database configuration
      const dbConfig = strapi.config.get('database') as { connection: DbConnection };

      // Generate backup filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `backup-${timestamp}.sql`;
      const backupDir = path.join(strapi.dirs.static.public, 'backups');
      const backupPath = path.join(backupDir, backupFileName);

      // Ensure backup directory exists
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      // Prepare pg_dump command
      const pgDumpCommand = `PGPASSWORD="${dbConfig.connection.password}" pg_dump -h ${dbConfig.connection.host} -p ${dbConfig.connection.port} -U ${dbConfig.connection.user} -d ${dbConfig.connection.database} -F p -f "${backupPath}"`;

      strapi.log.info(`Starting database backup to ${backupPath}`);

      // Execute pg_dump
      await execAsync(pgDumpCommand);

      strapi.log.info('Database backup completed successfully');

      // Read the backup file
      const backupData = fs.readFileSync(backupPath);

      // Set response headers for file download
      ctx.set('Content-Type', 'application/sql');
      ctx.set('Content-Disposition', `attachment; filename="${backupFileName}"`);
      ctx.set('Content-Length', backupData.length.toString());

      // Send the file
      ctx.body = backupData;

      // Optional: Delete the backup file after sending (uncomment if you don't want to keep backups on server)
      // fs.unlinkSync(backupPath);

      return ctx;
    } catch (error) {
      strapi.log.error('Backup failed:', error);
      ctx.throw(500, `Backup failed: ${error.message}`);
    }
  },

  async listBackups(ctx) {
    try {
      const backupDir = path.join(strapi.dirs.static.public, 'backups');

      if (!fs.existsSync(backupDir)) {
        return ctx.send({ backups: [] });
      }

      const files = fs.readdirSync(backupDir);
      const backups = files
        .filter(file => file.endsWith('.sql'))
        .map(file => {
          const filePath = path.join(backupDir, file);
          const stats = fs.statSync(filePath);
          return {
            filename: file,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
          };
        })
        .sort((a, b) => b.created.getTime() - a.created.getTime());

      return ctx.send({ backups });
    } catch (error) {
      strapi.log.error('Failed to list backups:', error);
      ctx.throw(500, `Failed to list backups: ${error.message}`);
    }
  },

  async downloadBackup(ctx) {
    try {
      const { filename } = ctx.params;
      const backupDir = path.join(strapi.dirs.static.public, 'backups');
      const backupPath = path.join(backupDir, filename);

      // Security check: ensure the filename doesn't contain path traversal
      if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return ctx.throw(400, 'Invalid filename');
      }

      if (!fs.existsSync(backupPath)) {
        return ctx.throw(404, 'Backup file not found');
      }

      const backupData = fs.readFileSync(backupPath);

      ctx.set('Content-Type', 'application/sql');
      ctx.set('Content-Disposition', `attachment; filename="${filename}"`);
      ctx.set('Content-Length', backupData.length.toString());

      ctx.body = backupData;
      return ctx;
    } catch (error) {
      strapi.log.error('Failed to download backup:', error);
      ctx.throw(500, `Failed to download backup: ${error.message}`);
    }
  },

  async deleteBackup(ctx) {
    try {
      const { filename } = ctx.params;
      const backupDir = path.join(strapi.dirs.static.public, 'backups');
      const backupPath = path.join(backupDir, filename);

      // Security check: ensure the filename doesn't contain path traversal
      if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return ctx.throw(400, 'Invalid filename');
      }

      if (!fs.existsSync(backupPath)) {
        return ctx.throw(404, 'Backup file not found');
      }

      fs.unlinkSync(backupPath);
      strapi.log.info(`Deleted backup file: ${filename}`);

      return ctx.send({ message: 'Backup deleted successfully', filename });
    } catch (error) {
      strapi.log.error('Failed to delete backup:', error);
      ctx.throw(500, `Failed to delete backup: ${error.message}`);
    }
  },
};
