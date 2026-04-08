import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Heart, BookOpen, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { articles } from '@/data/articles';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    id: article.id.toString(),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const article = articles.find((a) => a.id === parseInt(id));
  
  if (!article) {
    return {
      title: '文章未找到 - 哄哄模拟器',
    };
  }

  return {
    title: `${article.title} - 恋爱攻略`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const article = articles.find((a) => a.id === parseInt(id));

  if (!article) {
    notFound();
  }

  // 找到上一篇和下一篇
  const currentIndex = articles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

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
          <Link href="/blog">
            <button className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <BookOpen className="w-4 h-4" />
            <span>恋爱攻略</span>
            <span className="mx-1">·</span>
            <Clock className="w-4 h-4" />
            <span>{article.readTime}</span>
            <span className="mx-1">·</span>
            <span>{article.date}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {article.title}
          </h1>
        </div>

        {/* Article Content */}
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12 mb-8 border border-pink-100 dark:border-pink-900/50">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {article.content.split('\n').map((paragraph, index) => {
              // 处理标题
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <h3 key={index} className="text-xl font-bold mt-6 mb-4 text-gray-800 dark:text-gray-200">
                    {paragraph.replace(/\*\*/g, '')}
                  </h3>
                );
              }
              // 处理普通段落
              if (paragraph.trim()) {
                return (
                  <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </article>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          {prevArticle ? (
            <Link href={`/blog/${prevArticle.id}`} className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-pink-100 dark:border-pink-900/50 hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <ArrowLeft className="w-3 h-3" />
                  <span>上一篇</span>
                </div>
                <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors">
                  {prevArticle.title}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextArticle ? (
            <Link href={`/blog/${nextArticle.id}`} className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-pink-100 dark:border-pink-900/50 hover:shadow-md transition-shadow group text-right">
                <div className="flex items-center justify-end gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>下一篇</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
                <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors">
                  {nextArticle.title}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        {/* Back to List */}
        <div className="mt-8 text-center">
          <Link href="/blog">
            <button className="inline-flex items-center gap-2 text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 font-medium transition-colors">
              <BookOpen className="w-4 h-4" />
              查看全部文章
            </button>
          </Link>
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
