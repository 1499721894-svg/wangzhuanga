import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import bcrypt from 'bcrypt';
import * as schema from '@/storage/database/shared/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // 验证输入
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 50) {
      return NextResponse.json(
        { success: false, error: '用户名长度需要在 3-50 个字符之间' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: '密码长度至少 6 个字符' },
        { status: 400 }
      );
    }

    // 初始化数据库连接
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL 未配置');
    }

    const client = postgres(process.env.DATABASE_URL);
    const db = drizzle(client, { schema });

    // 检查用户名是否已存在
    const existingUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username))
      .limit(1);

    if (existingUser && existingUser.length > 0) {
      await client.end();
      return NextResponse.json(
        { success: false, error: '用户名已存在' },
        { status: 400 }
      );
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const newUser = await db
      .insert(schema.users)
      .values({
        username,
        password: hashedPassword,
      })
      .returning();

    await client.end();

    if (!newUser || newUser.length === 0) {
      throw new Error('创建用户失败');
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser[0].id,
        username: newUser[0].username,
      },
    });
  } catch (error: any) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { success: false, error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
}
