// Comprehensive logging system for debugging
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
  error?: Error;
  stack?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private createLogEntry(level: LogLevel, category: string, message: string, data?: any, error?: Error): LogEntry {
    return {
      timestamp: this.formatTimestamp(),
      level,
      category,
      message,
      data,
      error,
      stack: error?.stack
    };
  }

  private log(level: LogLevel, category: string, message: string, data?: any, error?: Error) {
    const entry = this.createLogEntry(level, category, message, data, error);
    
    // Add to internal log store
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output with colors and formatting
    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
    const colors = ['#888', '#2563eb', '#f59e0b', '#ef4444'];
    
    console.group(`%c[${levelNames[level]}] ${category}`, `color: ${colors[level]}; font-weight: bold`);
    console.log(`%c${message}`, 'color: inherit');
    
    if (data) {
      console.log('Data:', data);
    }
    
    if (error) {
      console.error('Error:', error);
      if (error.stack) {
        console.log('Stack:', error.stack);
      }
    }
    
    console.groupEnd();

    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      try {
        const storedLogs = JSON.parse(localStorage.getItem('senda_debug_logs') || '[]');
        storedLogs.push(entry);
        if (storedLogs.length > this.maxLogs) {
          storedLogs.shift();
        }
        localStorage.setItem('senda_debug_logs', JSON.stringify(storedLogs));
      } catch (e) {
        console.warn('Failed to store log in localStorage:', e);
      }
    }
  }

  debug(category: string, message: string, data?: any) {
    this.log(LogLevel.DEBUG, category, message, data);
  }

  info(category: string, message: string, data?: any) {
    this.log(LogLevel.INFO, category, message, data);
  }

  warn(category: string, message: string, data?: any, error?: Error) {
    this.log(LogLevel.WARN, category, message, data, error);
  }

  error(category: string, message: string, data?: any, error?: Error) {
    this.log(LogLevel.ERROR, category, message, data, error);
  }

  // Get all logs for debugging
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('senda_debug_logs');
    }
  }

  // Export logs as JSON
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    logger.error('GLOBAL_ERROR', 'Unhandled error occurred', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    }, event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    logger.error('UNHANDLED_PROMISE', 'Unhandled promise rejection', {
      reason: event.reason
    });
  });
}