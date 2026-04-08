import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    const articles = [
      {
        title: '吵架之后的黄金30分钟',
        prompt: `请写一篇关于"吵架之后的黄金30分钟"的文章，要求：
1. 风格轻松幽默，像朋友聊天一样
2. 字数300-500字
3. 内容要实用，给出具体的建议
4. 可以适当加入一些生活化的场景和例子
5. 结尾要给人温暖和希望`,
      },
      {
        title: '为什么「你说得对」是最烂的回复',
        prompt: `请写一篇关于"为什么「你说得对」是最烂的回复"的文章，要求：
1. 风格轻松幽默，像朋友聊天一样
2. 字数300-500字
3. 分析为什么这句话会让人更生气
4. 给出更好的替代方案
5. 结尾要给人启发`,
      },
      {
        title: '道歉的正确打开方式',
        prompt: `请写一篇关于"道歉的正确打开方式"的文章，要求：
1. 风格轻松幽默，像朋友聊天一样
2. 字数300-500字
3. 给出具体的道歉步骤和技巧
4. 举例说明什么样的道歉是有效的
5. 结尾要给人温暖和希望`,
      },
    ];

    const generatedArticles = [];

    for (const article of articles) {
      const messages = [
        {
          role: 'system' as const,
          content: '你是一个恋爱关系专家，擅长用轻松幽默的方式分享恋爱技巧。你的文章风格像朋友聊天，既有干货又有温度。',
        },
        {
          role: 'user' as const,
          content: article.prompt,
        },
      ];

      const response = await client.invoke(messages, {
        model: 'doubao-seed-1-8-251228',
        temperature: 0.8,
      });

      generatedArticles.push({
        title: article.title,
        content: response.content,
        excerpt: response.content.substring(0, 100) + '...',
      });
    }

    return NextResponse.json({ articles: generatedArticles });
  } catch (error) {
    console.error('Error generating articles:', error);
    return NextResponse.json(
      { error: '生成文章失败' },
      { status: 500 }
    );
  }
}
