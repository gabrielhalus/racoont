import Session, { TSession } from '@/models/session';
import { TUser } from '@/models/user';
import { sign, verify } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.SECRET_KEY;
const SESSION_EXPIRATION_SECONDS = 30 * 24 * 60 * 60; // 30 days
const SESSION_EXPIRATION_MILLISECONDS = SESSION_EXPIRATION_SECONDS * 1000;

export async function authenticateUser(user: TUser): Promise<NextResponse> {
  const { id: userId, name, email } = user;

  if (!SECRET_KEY) {
    throw new Error('Please define the SECRET_KEY environment variable inside .env.local');
  }

  const token = sign({ userId }, SECRET_KEY, { expiresIn: SESSION_EXPIRATION_SECONDS });
  const expires_at = new Date(Date.now() + SESSION_EXPIRATION_SECONDS);

  const session: TSession = await Session.create({ userId, name, email, token, expires_at });

  const response = NextResponse.json({ user, message: 'Authenticated' });
  response.cookies.set('session', session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_EXPIRATION_MILLISECONDS,
    path: '/',
  });

  return response;
}

export async function verifySession(session: TSession): Promise<boolean> {
  const now = new Date();

  if (now > session.expires_at) {
    return false;
  }

  if (!SECRET_KEY) {
    throw new Error('Please define the SECRET_KEY environment variable inside .env.local');
  }

  const { userId } = verify(session.token, SECRET_KEY) as { userId: string };

  if (!userId || userId !== session.userId) {
    return false;
  }

  return true;
}
