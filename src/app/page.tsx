'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  User, 
  LogOut, 
  Trophy,
  X,
  CheckCircle,
  XCircle,
  Gamepad2
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface GameOption {
  text: string;
  score: number;
  feedback: string;
}

interface GameState {
  phase: 'input' | 'playing' | 'result';
  scenario: string;
  currentRound: number;
  totalScore: number;
  options: GameOption[];
  selectedOption: GameOption | null;
  showSaveModal: boolean;
  saveSuccess: boolean;
}

export default function Home() {
  const { user, logout } = useAuth();
  
  const [gameState, setGameState] = useState<GameState>({
    phase: 'input',
    scenario: '',
    currentRound: 0,
    totalScore: 0,
    options: [],
    selectedOption: null,
    showSaveModal: false,
    saveSuccess: false,
  });

  // 生成游戏选项
  const generateOptions = (): GameOption[] => {
    const allOptions: GameOption[] = [
      { 
        text: "亲爱的，我知道你现在很生气，对不起，我不该这样。", 
        score: 90, 
        feedback: "太棒了！真诚的道歉最能打动人心！" 
      },
      { 
        text: "好的，我错了还不行吗？", 
        score: 20, 
        feedback: "这样的道歉听起来很敷衍..." 
      },
      { 
        text: "我能理解你现在的心情，是我不好，让我补偿你吧。", 
        score: 85, 
        feedback: "很好！表达理解并提出补偿方案。" 
      },
      { 
        text: "你说得对，你说得对。", 
        score: 10, 
        feedback: "这简直是火上浇油！" 
      },
      { 
        text: "宝贝别生气了，我给你买了你最爱吃的蛋糕。", 
        score: 75, 
        feedback: "不错！用实际行动表达歉意。" 
      },
      { 
        text: "能不能别闹了，我很累。", 
        score: 5, 
        feedback: "这是在找死啊..." 
      },
      { 
        text: "我知道错了，以后一定改，你能原谅我吗？", 
        score: 80, 
        feedback: "很好的态度，承认错误并承诺改进。" 
      },
      { 
        text: "好啦好啦，我错了，抱抱。", 
        score: 60, 
        feedback: "还行，但有点太随意了。" 
      },
    ];
    
    // 随机选择4个选项
    const shuffled = allOptions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  };

  // 开始游戏
  const startGame = () => {
    if (!gameState.scenario.trim()) return;
    
    setGameState({
      ...gameState,
      phase: 'playing',
      currentRound: 1,
      totalScore: 0,
      options: generateOptions(),
      selectedOption: null,
    });
  };

  // 选择选项
  const selectOption = (option: GameOption) => {
    const newTotalScore = gameState.totalScore + option.score;
    
    setGameState({
      ...gameState,
      selectedOption: option,
      totalScore: newTotalScore,
    });
  };

  // 下一轮
  const nextRound = () => {
    if (gameState.currentRound >= 3) {
      // 游戏结束
      finishGame();
    } else {
      setGameState({
        ...gameState,
        phase: 'playing',
        currentRound: gameState.currentRound + 1,
        options: generateOptions(),
        selectedOption: null,
      });
    }
  };

  // 结束游戏
  const finishGame = async () => {
    const finalScore = gameState.totalScore;
    const result = finalScore >= 200 ? '通关' : '失败';
    
    setGameState({
      ...gameState,
      phase: 'result',
    });

    // 如果已登录，保存记录
    if (user) {
      try {
        const response = await fetch('/api/game-records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            scenario: gameState.scenario,
            finalScore,
            result,
          }),
        });
        
        const data = await response.json();
        setGameState(prev => ({
          ...prev,
          showSaveModal: true,
          saveSuccess: data.success,
        }));
      } catch {
        setGameState(prev => ({
          ...prev,
          showSaveModal: true,
          saveSuccess: false,
        }));
      }
    }
  };

  // 重新开始
  const restartGame = () => {
    setGameState({
      phase: 'input',
      scenario: '',
      currentRound: 0,
      totalScore: 0,
      options: [],
      selectedOption: null,
      showSaveModal: false,
      saveSuccess: false,
    });
  };

  const handleLogout = () => {
    logout();
  };

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
            <Link href="/leaderboard">
              <Button variant="outline" className="gap-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:border-yellow-300 dark:hover:border-yellow-700">
                <Trophy className="w-4 h-4 text-yellow-500" />
                排行榜
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="outline" className="gap-2 hover:bg-pink-50 dark:hover:bg-gray-700">
                <BookOpen className="w-4 h-4" />
                恋爱攻略
              </Button>
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 dark:bg-pink-900/20 rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors cursor-pointer">
                    <User className="w-4 h-4 text-pink-500" />
                    <span className="text-sm font-medium text-pink-600 dark:text-pink-400">{user.username}</span>
                  </div>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-pink-500 gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">退出</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" className="text-pink-500 hover:text-pink-600 hover:bg-pink-50">
                    登录
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                    注册
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-900/30 px-4 py-2 rounded-full mb-6">
            <Gamepad2 className="w-4 h-4 text-pink-500" />
            <span className="text-sm text-pink-600 dark:text-pink-300">恋爱修炼场</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            哄人技巧大挑战
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            输入场景，选择最佳回复，看看你能得多少分！
          </p>
        </div>

        {/* Game Card */}
        <Card className="shadow-xl border-2 border-pink-100 dark:border-pink-900/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
                <Heart className="w-5 h-5" />
                哄哄模拟器
              </div>
              {gameState.phase !== 'input' && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    第 {gameState.currentRound}/3 轮
                  </span>
                  <span className="font-bold text-pink-500">
                    得分: {gameState.totalScore}
                  </span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* 输入场景阶段 */}
            {gameState.phase === 'input' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    描述一个需要哄人的场景
                  </label>
                  <Textarea
                    placeholder="例如：我不小心把女朋友最喜欢的口红弄断了，她很生气..."
                    value={gameState.scenario}
                    onChange={(e) => setGameState({ ...gameState, scenario: e.target.value })}
                    className="min-h-[100px] resize-none border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                  />
                </div>
                <Button 
                  onClick={startGame}
                  disabled={!gameState.scenario.trim()}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  开始游戏
                </Button>
              </div>
            )}

            {/* 游戏进行阶段 */}
            {gameState.phase === 'playing' && !gameState.selectedOption && (
              <div className="space-y-4">
                <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                  <p className="text-sm text-pink-600 dark:text-pink-400 mb-1">当前场景：</p>
                  <p className="text-gray-700 dark:text-gray-300">{gameState.scenario}</p>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-center">请选择你的回复：</p>
                <div className="grid gap-3">
                  {gameState.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => selectOption(option)}
                      className="h-auto py-4 text-left justify-start border-pink-200 hover:bg-pink-50 hover:border-pink-400 dark:border-pink-800 dark:hover:bg-pink-900/20"
                    >
                      <span className="text-gray-700 dark:text-gray-300">{option.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* 显示选择结果 */}
            {gameState.phase === 'playing' && gameState.selectedOption && (
              <div className="space-y-4">
                <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                  <p className="text-sm text-pink-600 dark:text-pink-400 mb-1">你选择了：</p>
                  <p className="text-gray-700 dark:text-gray-300">{gameState.selectedOption.text}</p>
                </div>
                
                <div className={`p-4 rounded-lg ${gameState.selectedOption.score >= 70 ? 'bg-green-50 dark:bg-green-900/20' : gameState.selectedOption.score >= 40 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {gameState.selectedOption.score >= 70 ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`font-bold ${gameState.selectedOption.score >= 70 ? 'text-green-600 dark:text-green-400' : gameState.selectedOption.score >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                      +{gameState.selectedOption.score} 分
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{gameState.selectedOption.feedback}</p>
                </div>

                <Button 
                  onClick={nextRound}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                >
                  {gameState.currentRound >= 3 ? '查看结果' : '下一轮'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* 游戏结果阶段 */}
            {gameState.phase === 'result' && (
              <div className="space-y-6 text-center">
                <div className={`text-6xl mb-4`}>
                  {gameState.totalScore >= 200 ? '🎉' : gameState.totalScore >= 150 ? '😊' : '😢'}
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {gameState.totalScore >= 200 ? '恭喜通关！' : '再接再厉！'}
                  </h3>
                  <p className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    {gameState.totalScore} 分
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">游戏场景</p>
                  <p className="text-gray-700 dark:text-gray-300">{gameState.scenario}</p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={restartGame}
                    variant="outline"
                    className="flex-1"
                  >
                    再玩一次
                  </Button>
                  {user && (
                    <Link href="/profile" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                        查看我的记录
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-pink-100 dark:border-pink-900/50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">😤</div>
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">承认错误</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">不要急着解释，先承认自己的错误</p>
            </CardContent>
          </Card>
          <Card className="border-pink-100 dark:border-pink-900/50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">🤗</div>
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">表示理解</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">让对方知道你理解TA的感受</p>
            </CardContent>
          </Card>
          <Card className="border-pink-100 dark:border-pink-900/50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">💝</div>
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">给出方案</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">提出具体的改进方案，展现诚意</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Save Modal */}
      {gameState.showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              {user ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    游戏记录已保存
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    您的游戏记录已经保存，可以在个人页面查看
                  </p>
                </>
              ) : (
                <>
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    登录后可保存记录
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    登录后可以保存你的游戏记录，查看历史战绩
                  </p>
                </>
              )}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setGameState({ ...gameState, showSaveModal: false })}
                  className="flex-1"
                >
                  关闭
                </Button>
                {!user && (
                  <Link href="/login" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                      去登录
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
