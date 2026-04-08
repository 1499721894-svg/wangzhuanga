import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '哄哄模拟器 | 恋爱攻略',
    template: '%s | 哄哄模拟器',
  },
  description: '哄哄模拟器 - 让你的恋爱更顺利，学习恋爱技巧，化解矛盾，增进感情',
  keywords: [
    '哄哄模拟器',
    '恋爱攻略',
    '恋爱技巧',
    '道歉',
    '情侣',
    '恋爱',
  ],
  authors: [{ name: '哄哄模拟器 Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="zh-CN">
      <body className={`antialiased`}>
        <AuthProvider>
          {isDev && <Inspector />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
