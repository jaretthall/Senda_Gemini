'use client';

import React from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface AlertProps {
  type: 'success' | 'warning' | 'info' | 'error';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, title, message, dismissible = false, onDismiss }) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-success-50 border-success-200 dark:bg-success-900/20 dark:border-success-800',
          icon: 'text-success-400',
          title: 'text-success-800 dark:text-success-200',
          message: 'text-success-700 dark:text-success-300',
          IconComponent: CheckCircleIcon
        };
      case 'warning':
        return {
          container: 'bg-warning-50 border-warning-200 dark:bg-warning-900/20 dark:border-warning-800',
          icon: 'text-warning-400',
          title: 'text-warning-800 dark:text-warning-200',
          message: 'text-warning-700 dark:text-warning-300',
          IconComponent: ExclamationTriangleIcon
        };
      case 'info':
        return {
          container: 'bg-info-50 border-info-200 dark:bg-info-900/20 dark:border-info-800',
          icon: 'text-info-400',
          title: 'text-info-800 dark:text-info-200',
          message: 'text-info-700 dark:text-info-300',
          IconComponent: InformationCircleIcon
        };
      case 'error':
        return {
          container: 'bg-danger-50 border-danger-200 dark:bg-danger-900/20 dark:border-danger-800',
          icon: 'text-danger-400',
          title: 'text-danger-800 dark:text-danger-200',
          message: 'text-danger-700 dark:text-danger-300',
          IconComponent: XCircleIcon
        };
      default:
        return {
          container: 'bg-secondary-50 border-secondary-200 dark:bg-secondary-900/20 dark:border-secondary-800',
          icon: 'text-secondary-400',
          title: 'text-secondary-800 dark:text-secondary-200',
          message: 'text-secondary-700 dark:text-secondary-300',
          IconComponent: InformationCircleIcon
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div className={`rounded-lg border p-4 ${styles.container}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <styles.IconComponent className={`h-5 w-5 ${styles.icon}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${styles.title}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${title ? 'mt-2' : ''} ${styles.message}`}>
            {message}
          </div>
        </div>
        {dismissible && onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onDismiss}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.icon} hover:opacity-75`}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;