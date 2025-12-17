// src/lib/logger.ts

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  environment: string;
}

class Logger {
  private static instance: Logger;
  private isDev: boolean;

  private constructor() {
    this.isDev = process.env.NODE_ENV !== 'production';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLog(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    const entry = this.formatLog(level, message, data);

    // In a real production app, you would send 'entry' to a monitoring service
    // like Sentry, LogRocket, or Datadog here.
    
    if (this.isDev) {
      // Fancy console logging for development
      const styles = {
        info: 'color: #3b82f6',
        warn: 'color: #eab308',
        error: 'color: #ef4444',
        debug: 'color: #a855f7',
      };
      
      // Check if running in browser or node
      if (typeof window !== 'undefined') {
        console.groupCollapsed(`%c[${level.toUpperCase()}] ${message}`, styles[level]);
        console.log('Timestamp:', entry.timestamp);
        if (data !== undefined) console.log('Data:', data);
        console.groupEnd();
      } else {
        console.log(`[${level.toUpperCase()}] ${message}`, data !== undefined ? data : '');
      }
    } else {
      // Minimal JSON logging for production (easier to parse by log aggregators)
      console.log(JSON.stringify(entry));
    }
  }

  public info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  public warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  public error(message: string, data?: unknown) {
    this.log('error', message, data);
  }

  public debug(message: string, data?: unknown) {
    this.log('debug', message, data);
  }
}

export const logger = Logger.getInstance();
