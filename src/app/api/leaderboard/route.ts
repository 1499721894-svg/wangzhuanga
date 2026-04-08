import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

interface LeaderboardEntry {
  rank: number;
  user_id: number;
  username: string;
  highest_score: number;
  achieved_at: string;
}

// 获取排行榜数据
export async function GET(request: NextRequest) {
  try {
    const client = getSupabaseClient();

    // 查询每个用户的最高分
    // 使用子查询获取每个用户的最高分记录
    const { data: records, error } = await client
      .from('game_records')
      .select(`
        id,
        user_id,
        final_score,
        result,
        played_at
      `)
      .eq('result', '通关')
      .order('final_score', { ascending: false })
      .limit(100);

    if (error) {
      throw new Error(`查询失败: ${error.message}`);
    }

    // 获取所有用户信息
    const { data: users, error: usersError } = await client
      .from('users')
      .select('id, username');

    if (usersError) {
      throw new Error(`查询用户失败: ${usersError.message}`);
    }

    // 创建用户映射
    const userMap = new Map(users?.map(u => [u.id, u.username]) || []);

    // 按用户分组，获取每个用户的最高分
    const userBestScores = new Map<number, { score: number; played_at: string }>();
    
    records?.forEach(record => {
      const userId = record.user_id;
      const existing = userBestScores.get(userId);
      if (!existing || record.final_score > existing.score) {
        userBestScores.set(userId, {
          score: record.final_score,
          played_at: record.played_at,
        });
      }
    });

    // 转换为数组并排序
    const leaderboard: LeaderboardEntry[] = Array.from(userBestScores.entries())
      .map(([userId, data]) => ({
        user_id: userId,
        username: userMap.get(userId) || '未知用户',
        highest_score: data.score,
        achieved_at: data.played_at,
      }))
      .sort((a, b) => b.highest_score - a.highest_score)
      .slice(0, 20)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    return NextResponse.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error('获取排行榜错误:', error);
    return NextResponse.json(
      { success: false, error: '获取排行榜失败' },
      { status: 500 }
    );
  }
}
