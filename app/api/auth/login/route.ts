import { loginDto } from '@/dto/login.dto';
import User, { TUser } from '@/models/user';
import connectMongo from '@/utils/connect-mongo';
import { compare } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const { loginIdentifier, password }: loginDto = await req.json();

    if (!loginIdentifier) {
      return NextResponse.json({ message: 'Either email or name is required' }, { status: 400 });
    }

    let user: TUser | null = await User.findOne({ $or: [{ email: loginIdentifier }, { name: loginIdentifier }] })
      .select('+password')
      .lean();

    if (!user || !(await compare(password, user?.password as string))) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ user, message: 'Authenticated' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
