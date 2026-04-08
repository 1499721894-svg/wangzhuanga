'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Database, 
  Table, 
  Plus, 
  Search, 
  RefreshCw, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  Key,
  ExternalLink,
  Home,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  created_at: string;
  read_time: string;
}

// 模拟数据库表列表
const tables = [
  { name: 'blog_posts', rowCount: 3 },
  { name: 'health_check', rowCount: 1 },
];

export default function AdminPage() {
  const [selectedTable, setSelectedTable] = useState('blog_posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从 API 获取数据
  const fetchBlogPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/blog-posts');
      const result = await response.json();
      if (result.success) {
        setBlogPosts(result.data);
      } else {
        setError(result.error || '获取数据失败');
      }
    } catch (err) {
      setError('网络请求失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const filteredData = blogPosts.filter(row => 
    row.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-pink-500">
              <Home className="w-4 h-4" />
              <span className="text-sm">返回首页</span>
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">哄哄模拟器 - 后台管理</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/blog">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                查看博客
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Sub Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center px-4">
          <button className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
            总览
          </button>
          <button className="px-4 py-3 text-sm font-medium text-pink-600 dark:text-pink-400 border-b-2 border-pink-500">
            开发环境
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-110px)]">
        {/* Left Sidebar - Table List */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
              <Database className="w-4 h-4" />
              <span>schemas public</span>
            </div>
            <Button className="w-full bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white gap-2">
              <Plus className="w-4 h-4" />
              新建表
            </Button>
          </div>

          {/* Search */}
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索表..."
                className="pl-9 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Table List */}
          <div className="flex-1 overflow-auto">
            {tables.map((table) => (
              <button
                key={table.name}
                onClick={() => setSelectedTable(table.name)}
                className={`w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  selectedTable === table.name 
                    ? 'bg-pink-50 dark:bg-pink-900/20 border-l-2 border-pink-500' 
                    : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{table.name}</span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">{table.rowCount}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content - Table Data */}
        <main className="flex-1 flex flex-col">
          {/* Table Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Table className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{selectedTable}</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">{filteredData.length} 条记录</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  过滤
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  排序
                </Button>
                <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white gap-2">
                  <Plus className="w-4 h-4" />
                  插入
                </Button>
                <Button variant="ghost" size="icon" onClick={fetchBlogPosts} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="flex-1 overflow-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                <span className="ml-2 text-gray-500 dark:text-gray-400">加载中...</span>
              </div>
            ) : error ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="font-medium text-yellow-800 dark:text-yellow-200">从表获取行失败</h3>
                    <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">{error}</p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-2">
                      尝试刷新您的浏览器，但如果问题持续超过几分钟，请联系我们。
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Column Headers */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400">
                  <div className="col-span-1 flex items-center gap-1">
                    <Key className="w-3 h-3 text-yellow-500" />
                    id
                  </div>
                  <div className="col-span-3">title</div>
                  <div className="col-span-4">summary</div>
                  <div className="col-span-2">created_at</div>
                  <div className="col-span-2">read_time</div>
                </div>

                {/* Data Rows */}
                {filteredData.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    暂无数据
                  </div>
                ) : (
                  filteredData.map((row) => (
                    <div 
                      key={row.id}
                      className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm"
                    >
                      <div className="col-span-1 font-mono text-gray-700 dark:text-gray-300">{row.id}</div>
                      <div className="col-span-3 text-gray-900 dark:text-gray-100 font-medium truncate">{row.title}</div>
                      <div className="col-span-4 text-gray-600 dark:text-gray-400 truncate">{row.summary}</div>
                      <div className="col-span-2 text-gray-500 dark:text-gray-400">{row.created_at?.split('T')[0] || '-'}</div>
                      <div className="col-span-2 text-gray-500 dark:text-gray-400">{row.read_time}</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && (
              <div className="flex items-center justify-between mt-4 px-2">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>页码 1 共1</span>
                  <span>每页 100 行</span>
                  <span>{filteredData.length} 条记录</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Tabs */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
            <div className="flex items-center gap-4">
              <button className="px-3 py-1.5 text-sm font-medium text-pink-600 dark:text-pink-400 border-b-2 border-pink-500">
                Data
              </button>
              <button className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                Definition
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
