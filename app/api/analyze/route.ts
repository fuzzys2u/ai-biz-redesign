import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(req: NextRequest) {
    const { businessName, currentFlow, issues, industry } = await req.json();

    const prompt = `
以下の業務について、AIを前提とした業務再設計の提案をしてください。
${industry ? `\n【業界】\n${industry}\n` : ''}
【業務名】
${businessName}

【現状の業務フロー】
${currentFlow}

【現状の課題】
${issues}

以下の形式で回答してください：

## 自動化できる部分
（AIや自動化ツールで対応可能な工程とその理由）

## 人が判断すべき部分
（人間の判断が必要な工程とその理由）

## TO-BE業務フロー
（AI導入後の業務フローを箇条書きで）

## 期待される効果
（工数削減・品質向上等の具体的な効果）
`;

    const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    const text = content.type === 'text' ? content.text : '';

    return NextResponse.json({ result: text });
}