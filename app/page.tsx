'use client';

import { useState } from 'react';

export default function Home() {
  const [businessName, setBusinessName] = useState('');
  const [currentFlow, setCurrentFlow] = useState('');
  const [issues, setIssues] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!businessName || !currentFlow || !issues) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, currentFlow, issues }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (e) {
      setResult('エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  const formatResult = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-lg font-semibold mt-6 mb-2 text-gray-800">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('- ') || line.startsWith('・')) {
        return <li key={i} className="ml-4 text-gray-700">{line.replace(/^[-・] /, '')}</li>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-gray-700">{line}</p>;
    });
  };

  return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">AI業務再設計ツール</h1>
          <p className="text-gray-500 mb-8 text-sm">現状の業務フローを入力すると、AIが自動化できる部分と人が判断すべき部分を整理し、TO-BE業務フローを提案します。</p>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-5">
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
                <h2 className="text-base font-semibold text-gray-900 mb-4">再設計提案</h2>
                <div className="space-y-1">
                  {formatResult(result)}
                </div>
              </div>
          )}
        </div>
      </main>
  );
}