import { AnalyzeRequest, FormatRequest, RefactorRequest } from './types';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export const validateAnalyzeRequest = (payload: unknown): ValidationResult<AnalyzeRequest> => {
  if (!payload || typeof payload !== 'object') {
    return { success: false, errors: ['Request body must be an object'] };
  }
  const data = payload as AnalyzeRequest;
  if (typeof data.code !== 'string' || data.code.length === 0) {
    return { success: false, errors: ['code must be a non-empty string'] };
  }
  return { success: true, data };
};

export const validateFormatRequest = (payload: unknown): ValidationResult<FormatRequest> => {
  if (!payload || typeof payload !== 'object') {
    return { success: false, errors: ['Request body must be an object'] };
  }
  const data = payload as FormatRequest;
  if (typeof data.code !== 'string' || data.code.length === 0) {
    return { success: false, errors: ['code must be a non-empty string'] };
  }
  return { success: true, data };
};

export const validateRefactorRequest = (payload: unknown): ValidationResult<RefactorRequest> => {
  if (!payload || typeof payload !== 'object') {
    return { success: false, errors: ['Request body must be an object'] };
  }
  const data = payload as RefactorRequest;
  if (typeof data.code !== 'string' || data.code.length === 0) {
    return { success: false, errors: ['code must be a non-empty string'] };
  }
  if (typeof data.quickFixId !== 'string' || data.quickFixId.length === 0) {
    return { success: false, errors: ['quickFixId must be a non-empty string'] };
  }
  return { success: true, data };
};
