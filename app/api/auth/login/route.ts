import { loginDto } from '@/dto/login.dto';
import User, { TUser } from '@/models/user';
import authenticateUser from '@/utils/authenticate-user';
import connectMongo from '@/utils/connect-mongo';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const { loginIdentifier, password }: loginDto = await req.json();

    if (!loginIdentifier) {
      return NextResponse.json({ message: 'Either email or name is required' }, { status: 400 });
    }

    let user: TUser | null = await User.findOne({ $or: [{ email: loginIdentifier }, { name: loginIdentifier }] }).populate('password');

    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    return await authenticateUser(user);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
