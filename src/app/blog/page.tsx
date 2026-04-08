import Link from 'next/link';
import { Heart, BookOpen, Clock, ArrowLeft } from 'lucide-react';
import { articles } from '@/data/articles';

export const metadata = {
  title: '恋爱攻略 - 哄哄模拟器',
  description: '学习恋爱技巧，让感情更顺利',
};

export default function BlogPage() {
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
          <Link href="/">
            <button className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-900/30 px-4 py-2 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-pink-500" />
            <span className="text-sm text-pink-600 dark:text-pink-300">恋爱攻略</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            让感情更顺利
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            实用的恋爱技巧，帮你化解矛盾，增进感情
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/blog/${article.id}`}>
              <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-pink-100 dark:border-pink-900/50 h-full flex flex-col group">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white">
                  <div className="flex items-center gap-2 text-sm mb-3 opacity-90">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                    <span className="mx-1">·</span>
                    <span>{article.date}</span>
                  </div>
                  <h3 className="text-xl font-bold line-clamp-2 group-hover:scale-105 transition-transform">
                    {article.title}
                  </h3>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-pink-500 dark:text-pink-400 font-medium group-hover:gap-3 transition-all gap-2">
                    <span>阅读全文</span>
                    <span>→</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {articles.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">暂无文章</p>
          </div>
        )}
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
