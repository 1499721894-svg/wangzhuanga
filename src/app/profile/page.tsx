'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Heart, 
  ArrowLeft, 
  User, 
  Trophy, 
  Gamepad2,
  Calendar,
  Star,
  LogOut,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface GameRecord {
  id: number;
  user_id: number;
  scenario: string;
  final_score: number;
  result: string;
  played_at: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchRecords();
  }, [user, router]);

  const fetchRecords = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/game-records?userId=${user.id}`);
      const data = await response.json();
      if (data.success) {
        setRecords(data.records);
      }
    } catch (error) {
      console.error('获取记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // 计算统计数据
  const stats = {
    totalGames: records.length,
    wins: records.filter(r => r.result === '通关').length,
    avgScore: records.length > 0 
      ? Math.round(records.reduce((sum, r) => sum + r.final_score, 0) / records.length) 
      : 0,
    bestScore: records.length > 0 
      ? Math.max(...records.map(r => r.final_score)) 
      : 0,
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              哄哄模拟器
            </h1>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" className="gap-2 text-gray-600 dark:text-gray-300">
                <ArrowLeft className="w-4 h-4" />
                返回首页
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* User Info Card */}
        <Card className="shadow-xl border-2 border-pink-100 dark:border-pink-900/50 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {user.username}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    哄人修炼者
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="text-gray-500 hover:text-pink-500 gap-2"
              >
                <LogOut className="w-4 h-4" />
                退出登录
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-pink-100 dark:border-pink-900/50">
            <CardContent className="pt-6 text-center">
              <Gamepad2 className="w-8 h-8 text-pink-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.totalGames}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">游戏场次</p>
            </CardContent>
          </Card>
          <Card className="border-green-100 dark:border-green-900/50">
            <CardContent className="pt-6 text-center">
              <Trophy className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.wins}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">通关次数</p>
            </CardContent>
          </Card>
          <Card className="border-yellow-100 dark:border-yellow-900/50">
            <CardContent className="pt-6 text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.avgScore}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">平均分数</p>
            </CardContent>
          </Card>
          <Card className="border-purple-100 dark:border-purple-900/50">
            <CardContent className="pt-6 text-center">
              <Heart className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.bestScore}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">最高分数</p>
            </CardContent>
          </Card>
        </div>

        {/* Game Records */}
        <Card className="shadow-xl border-2 border-pink-100 dark:border-pink-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
              <Gamepad2 className="w-5 h-5" />
              游戏记录
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-12">
                <Gamepad2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">还没有游戏记录</p>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                    开始游戏
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {records.map((record) => (
                  <div 
                    key={record.id}
                    className={`p-4 rounded-lg border ${
                      record.result === '通关' 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-sm font-medium px-2 py-0.5 rounded ${
                            record.result === '通关' 
                              ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300' 
                              : 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300'
                          }`}>
                            {record.result}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(record.played_at).toLocaleString('zh-CN')}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm truncate">
                          {record.scenario}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${
                          record.result === '通关' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {record.final_score}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">分数</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
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
