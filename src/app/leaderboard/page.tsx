'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Heart, 
  Trophy, 
  ArrowLeft, 
  Crown, 
  Medal, 
  Award,
  Calendar,
  Loader2,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LeaderboardEntry {
  rank: number;
  user_id: number;
  username: string;
  highest_score: number;
  achieved_at: string;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      if (data.success) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('获取排行榜失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-500">{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-900/10 border-yellow-300 dark:border-yellow-700';
      case 2:
        return 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700/30 dark:to-gray-700/10 border-gray-300 dark:border-gray-600';
      case 3:
        return 'bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-900/10 border-orange-300 dark:border-orange-700';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  // 检查当前用户是否在榜上
  const isCurrentUserInLeaderboard = user && leaderboard.some(entry => entry.user_id === user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              哄哄模拟器
            </h1>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400">
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 rounded-full mb-6">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-yellow-600 dark:text-yellow-300">荣誉殿堂</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            哄人高手排行榜
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            看看谁是哄人界的大神，学习他们的技巧
          </p>
          {user && (
            <p className="text-sm text-pink-500 dark:text-pink-400 mt-2">
              💡 登录状态下，你的成绩会自动上榜
            </p>
          )}
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
          </div>
        ) : leaderboard.length === 0 ? (
          <Card className="shadow-xl border-2 border-yellow-100 dark:border-yellow-900/50">
            <CardContent className="py-16 text-center">
              <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                暂无排名数据
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                还没有人通关游戏，成为第一个上榜的人吧！
              </p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                  开始游戏
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <div className="mb-8">
                <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-xl p-8 shadow-lg">
                  <div className="flex items-end justify-center gap-4 md:gap-8">
                    {/* 2nd Place */}
                    <div className="flex flex-col items-center">
                      <Medal className="w-8 h-8 text-gray-200 mb-2" />
                      <div className="text-3xl mb-2">🥈</div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center text-white w-24 md:w-28">
                        <p className="font-bold truncate text-sm md:text-base">{leaderboard[1]?.username}</p>
                        <p className="text-lg md:text-xl font-bold">{leaderboard[1]?.highest_score}</p>
                        <p className="text-xs opacity-80">分</p>
                      </div>
                      <div className="bg-gray-300 w-24 md:w-28 h-16 md:h-20 rounded-t-lg mt-2"></div>
                    </div>
                    
                    {/* 1st Place */}
                    <div className="flex flex-col items-center -mb-4">
                      <Crown className="w-10 h-10 text-yellow-200 mb-2" />
                      <div className="text-4xl mb-2">👑</div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center text-white w-28 md:w-32">
                        <p className="font-bold truncate">{leaderboard[0]?.username}</p>
                        <p className="text-2xl font-bold">{leaderboard[0]?.highest_score}</p>
                        <p className="text-xs opacity-80">分</p>
                      </div>
                      <div className="bg-yellow-300 w-28 md:w-32 h-24 md:h-28 rounded-t-lg mt-2"></div>
                    </div>
                    
                    {/* 3rd Place */}
                    <div className="flex flex-col items-center">
                      <Award className="w-8 h-8 text-orange-200 mb-2" />
                      <div className="text-3xl mb-2">🥉</div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center text-white w-24 md:w-28">
                        <p className="font-bold truncate text-sm md:text-base">{leaderboard[2]?.username}</p>
                        <p className="text-lg md:text-xl font-bold">{leaderboard[2]?.highest_score}</p>
                        <p className="text-xs opacity-80">分</p>
                      </div>
                      <div className="bg-orange-300 w-24 md:w-28 h-12 md:h-16 rounded-t-lg mt-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Full Leaderboard List */}
            <Card className="shadow-xl border-2 border-yellow-100 dark:border-yellow-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <Trophy className="w-5 h-5" />
                  完整排行榜
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((entry) => {
                    const isCurrentUser = user && entry.user_id === user.id;
                    
                    return (
                      <div 
                        key={entry.rank}
                        className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                          isCurrentUser 
                            ? 'ring-2 ring-pink-400 bg-pink-50 dark:bg-pink-900/20 border-pink-300 dark:border-pink-700' 
                            : getRankBg(entry.rank)
                        }`}
                      >
                        {/* Rank */}
                        <div className="w-10 h-10 flex items-center justify-center">
                          {getRankIcon(entry.rank)}
                        </div>
                        
                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {isCurrentUser && (
                              <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded">
                                我
                              </span>
                            )}
                            <p className={`font-medium truncate ${
                              isCurrentUser 
                                ? 'text-pink-700 dark:text-pink-300' 
                                : 'text-gray-800 dark:text-gray-200'
                            }`}>
                              {entry.username}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(entry.achieved_at)}</span>
                          </div>
                        </div>
                        
                        {/* Score */}
                        <div className="text-right">
                          <p className={`text-xl font-bold ${
                            isCurrentUser 
                              ? 'text-pink-600 dark:text-pink-400' 
                              : entry.rank <= 3 
                                ? 'text-yellow-600 dark:text-yellow-400' 
                                : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {entry.highest_score}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">最高分</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Current User Not In Leaderboard Notice */}
                {user && !isCurrentUserInLeaderboard && (
                  <div className="mt-6 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800 text-center">
                    <User className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                    <p className="text-pink-600 dark:text-pink-400">
                      你还未上榜，快去玩游戏争取高分吧！
                    </p>
                    <Link href="/">
                      <Button size="sm" className="mt-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                        开始游戏
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* How to Get on Leaderboard */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
            如何上榜？
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-yellow-100 dark:border-yellow-900/50">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl mb-2">🎮</div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">玩游戏</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">登录后玩游戏获得分数</p>
              </CardContent>
            </Card>
            <Card className="border-yellow-100 dark:border-yellow-900/50">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl mb-2">💯</div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">得高分</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">选择最佳回复，争取200分以上通关</p>
              </CardContent>
            </Card>
            <Card className="border-yellow-100 dark:border-yellow-900/50">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl mb-2">🏆</div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">上榜</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">最高分自动进入排行榜前20</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-12 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p className="flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> by 哄哄模拟器
          </p>
        </div>
      </footer>
    </div>
  );
}
