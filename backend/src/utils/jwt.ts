import jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
  email: string;
  globalRole: string;
  tenantId?: string;
  tenantRoleId?: string;
}

export const generateToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as string | number;

  return jwt.sign(payload, secret, {
    expiresIn,
    issuer: 'euroasiangroup-erp',
    audience: 'euroasiangroup-erp-users',
  } as any);
};

export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

  try {
    const decoded = jwt.verify(token, secret, {
      issuer: 'euroasiangroup-erp',
      audience: 'euroasiangroup-erp-users',
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
};

