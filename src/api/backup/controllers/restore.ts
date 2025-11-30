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

interface UploadedFile {
  name: string;
  path: string;
  type: string;
  size: number;
}

export default {
  async restoreBackup(ctx) {
    try {
      const files = ctx.request.files as any;

      if (!files || !files.backup) {
        return ctx.throw(400, 'No backup file provided. Please upload a .sql file.');
      }

      const backupFile = (Array.isArray(files.backup) ? files.backup[0] : files.backup) as UploadedFile;

      // Validate file extension
      if (!backupFile.name.endsWith('.sql')) {
        return ctx.throw(400, 'Invalid file type. Only .sql files are accepted.');
      }

      // Get database configuration
      const dbConfig = strapi.config.get('database') as { connection: DbConnection };

      strapi.log.info(`Starting database restore from ${backupFile.name}`);

      // Prepare psql command to restore the backup
      const restoreCommand = `PGPASSWORD="${dbConfig.connection.password}" psql -h ${dbConfig.connection.host} -p ${dbConfig.connection.port} -U ${dbConfig.connection.user} -d ${dbConfig.connection.database} -f "${backupFile.path}"`;

      // Execute restore
      const { stdout, stderr } = await execAsync(restoreCommand);

      if (stderr && !stderr.includes('NOTICE')) {
        strapi.log.warn('Restore warnings:', stderr);
      }

      strapi.log.info('Database restore completed successfully');

      // Optional: Delete the uploaded file after restore
      if (fs.existsSync(backupFile.path)) {
        fs.unlinkSync(backupFile.path);
      }

      return ctx.send({
        success: true,
        message: 'Database restored successfully',
        filename: backupFile.name,
        output: stdout || 'Restore completed',
      });
    } catch (error) {
      strapi.log.error('Database restore failed:', error);
      ctx.throw(500, `Database restore failed: ${error.message}`);
    }
  },

  async restoreFromFile(ctx) {
    try {
      const { filename } = ctx.request.body;

      if (!filename) {
        return ctx.throw(400, 'No filename provided');
      }

      // Security check: ensure the filename doesn't contain path traversal
      if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return ctx.throw(400, 'Invalid filename');
      }

      const backupDir = path.join(strapi.dirs.static.public, 'backups');
      const backupPath = path.join(backupDir, filename);

      if (!fs.existsSync(backupPath)) {
        return ctx.throw(404, 'Backup file not found');
      }

      // Get database configuration
      const dbConfig = strapi.config.get('database') as { connection: DbConnection };

      strapi.log.info(`Starting database restore from stored backup: ${filename}`);

      // Prepare psql command to restore the backup
      const restoreCommand = `PGPASSWORD="${dbConfig.connection.password}" psql -h ${dbConfig.connection.host} -p ${dbConfig.connection.port} -U ${dbConfig.connection.user} -d ${dbConfig.connection.database} -f "${backupPath}"`;

      // Execute restore
      const { stdout, stderr } = await execAsync(restoreCommand);

      if (stderr && !stderr.includes('NOTICE')) {
        strapi.log.warn('Restore warnings:', stderr);
      }

      strapi.log.info('Database restore completed successfully');

      return ctx.send({
        success: true,
        message: 'Database restored successfully from stored backup',
        filename: filename,
        output: stdout || 'Restore completed',
      });
    } catch (error) {
      strapi.log.error('Database restore failed:', error);
      ctx.throw(500, `Database restore failed: ${error.message}`);
    }
  },
};
