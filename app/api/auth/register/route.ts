import { registerDto } from '@/dto/register.dto';
import User from '@/models/user';
import connectMongo from '@/utils/connect-mongo';
import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const { name, email, password }: registerDto = await req.json();

    const missingFields: string[] = [];

    if (!name) {
      missingFields.push('Name');
    }

    if (!email) {
      missingFields.push('Email');
    }

    if (!password) {
      missingFields.push('Password');
    }

    if (missingFields.length > 0) {
      return NextResponse.json({ message: `${missingFields.join(', ')} are required` }, { status: 400 });
    }

    const user = await User.create({ name, email, password: await hash(password, 10) });
    return NextResponse.json({ user, message: 'Authenticated' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
