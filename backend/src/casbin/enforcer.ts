import { newEnforcer, Enforcer } from 'casbin';
import path from 'path';
import logger from '../config/logger';

let enforcer: Enforcer;

export const initCasbin = async (): Promise<Enforcer> => {
  try {
    const modelPath = path.join(__dirname, 'model.conf');
    const policyPath = path.join(__dirname, 'policy.csv');

    enforcer = await newEnforcer(modelPath, policyPath);
    logger.info('Casbin enforcer initialized successfully');
    
    return enforcer;
  } catch (error) {
    logger.error('Failed to initialize Casbin enforcer:', error);
    throw error;
  }
};

export const getEnforcer = (): Enforcer => {
  if (!enforcer) {
    throw new Error('Casbin enforcer not initialized. Call initCasbin() first.');
  }
  return enforcer;
};

export const checkPermission = async (
  role: string,
  resource: string,
  action: string
): Promise<boolean> => {
  try {
    const allowed = await enforcer.enforce(role, resource, action);
    return allowed;
  } catch (error) {
    logger.error('Casbin permission check failed:', error);
    return false;
  }
};

export default { initCasbin, getEnforcer, checkPermission };

