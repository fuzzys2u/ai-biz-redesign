'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const INDUSTRIES = ['製造', '金融・保険', '小売・EC', 'エネルギー', '物流・運輸', 'ヘルスケア', 'その他'];

const SAMPLE = {
  businessName: '新規顧客の本人確認業務',
  currentFlow: '1. 顧客から申込書を受領\n2. 担当者が目視で書類確認\n3. システムに手入力\n4. 上長が承認\n5. 顧客に結果通知',
  issues: '確認作業に時間がかかる、手入力ミスが発生しやすい、担当者によってばらつきがある',
};

export default function Home() {
  const [businessName, setBusinessName] = useState('');
  const [currentFlow, setCurrentFlow] = useState('');
  const [issues, setIssues] = useState('');
  const [industry, setIndustry] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!businessName || !currentFlow || !issues) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, currentFlow, issues, industry }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (e) {
      setResult('エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleSample = () => {
    setBusinessName(SAMPLE.businessName);
    setCurrentFlow(SAMPLE.currentFlow);
    setIssues(SAMPLE.issues);
    setIndustry('金融・保険');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">AI業務再設計ツール</h1>
          <p className="text-gray-500 mb-2 text-sm">現状の業務フローを入力すると、AIが自動化できる部分と人が判断すべき部分を整理し、TO-BE業務フローを提案します。</p>
          <button
              onClick={handleSample}
              className="text-blue-600 text-sm underline mb-6 inline-block"
          >
            サンプルデータを入力
          </button>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">業界</label>
              <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください（任意）</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">業務名</label>
              <input
                  type="text"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder="例：新規顧客の本人確認業務"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">現状の業務フロー</label>
              <textarea
                  value={currentFlow}
                  onChange={e => setCurrentFlow(e.target.value)}
                  rows={5}
                  placeholder="例：1. 顧客から申込書を受領 2. 担当者が目視で書類確認 3. ..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">現状の課題</label>
              <textarea
                  value={issues}
                  onChange={e => setIssues(e.target.value)}
                  rows={3}
                  placeholder="例：確認作業に時間がかかる、ミスが発生しやすい、担当者によってばらつきがある"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
                onClick={handleSubmit}
                disabled={loading || !businessName || !currentFlow || !issues}
                className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? '分析中...' : 'AI再設計を実行'}
            </button>
          </div>

          {result && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-900">再設計提案</h2>
                  <button
                      onClick={handleCopy}
                      className="text-sm text-gray-500 border border-gray-300 rounded-lg px-3 py-1 hover:bg-gray-50 transition"
                  >
                    {copied ? 'コピーしました！' : 'コピー'}
                  </button>
                </div>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              </div>
          )}
        </div>
      </main>
  );
}