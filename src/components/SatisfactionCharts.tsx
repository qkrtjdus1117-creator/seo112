import React from 'react';
import { BarChart3, PieChart, Info } from 'lucide-react';
import { ItemScoreInfo, ScoreDistribution } from '../types';

interface SatisfactionChartsProps {
  itemScores: ItemScoreInfo[];
  distribution: ScoreDistribution[];
  totalCount: number;
}

/**
 * 5. 만족도 분석 차트 컴포넌트
 * - 1. 항목별 평균 만족도 막대그래프 (5개 항목)
 * - 2. 전반적만족도 1점~5점 응답 분포 그래프
 */
export const SatisfactionCharts: React.FC<SatisfactionChartsProps> = ({
  itemScores,
  distribution,
  totalCount
}) => {
  // Max score is 5.0
  const maxScore = 5.0;

  // Find max count for distribution bar scaling
  const maxDistCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-5 bg-blue-700 rounded-xs inline-block"></span>
          만족도 분석 차트
        </h3>
        <span className="text-xs text-slate-500 font-normal">
          항목별 평점 및 응답자 평점 분포 시각화
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 차트 1: 항목별 평균 만족도 막대그래프 */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    1. 항목별 평균 만족도 비교
                  </h4>
                  <p className="text-xs text-slate-500">5개 평가 영역별 평균 점수 (5점 만점)</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                척도: 1.0 ~ 5.0점
              </span>
            </div>

            {/* 막대 그래프 영역 */}
            <div className="mt-5 space-y-4">
              {itemScores.map((item) => {
                const scorePercent = (item.score / maxScore) * 100;
                const isOverall = item.key === 'overallSatisfaction';

                return (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold ${
                            isOverall ? 'text-blue-900 font-bold' : 'text-slate-700'
                          }`}
                        >
                          {item.label}
                        </span>
                        {isOverall && (
                          <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                            종합
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-sm font-extrabold text-slate-900">
                          {item.score.toFixed(2)}
                        </span>
                        <span className="text-slate-400 text-xs">/ 5.00점</span>
                      </div>
                    </div>

                    {/* 진행 바 */}
                    <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-0.5 relative">
                      {/* 3.0점 기준 가이드선 (60%) */}
                      <div
                        className="absolute top-0 bottom-0 w-px bg-slate-300 z-10"
                        style={{ left: '60%' }}
                        title="보통 기준선 (3.0점)"
                      />
                      {/* 4.0점 우수 가이드선 (80%) */}
                      <div
                        className="absolute top-0 bottom-0 w-px bg-slate-300 z-10"
                        style={{ left: '80%' }}
                        title="우수 기준선 (4.0점)"
                      />

                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOverall
                            ? 'bg-blue-600'
                            : item.score >= 4.5
                            ? 'bg-emerald-500'
                            : item.score >= 4.0
                            ? 'bg-blue-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, scorePercent))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span> 종합 지표
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> 최우수 영역 (4.5점 이상)
              </span>
            </div>
            <span>보통(3.0) / 우수(4.0) 기준선 표시</span>
          </div>
        </div>

        {/* 차트 2: 전반적만족도 1점~5점 응답 분포 그래프 */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <PieChart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    2. 전반적만족도 응답 분포
                  </h4>
                  <p className="text-xs text-slate-500">1점(매우 불만족) ~ 5점(매우 만족) 비율 및 빈도</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                총 {totalCount}명 응답
              </span>
            </div>

            {/* 분포 막대 리스트 */}
            <div className="mt-5 space-y-3.5">
              {distribution.map((dist) => {
                const barWidth = maxDistCount > 0 ? (dist.count / maxDistCount) * 100 : 0;
                
                // Color schemes based on score
                const colorMap: Record<number, { bar: string; badge: string; text: string }> = {
                  5: { bar: 'bg-blue-600', badge: 'bg-blue-50 text-blue-800 border-blue-200', text: 'text-blue-900' },
                  4: { bar: 'bg-teal-500', badge: 'bg-teal-50 text-teal-800 border-teal-200', text: 'text-teal-900' },
                  3: { bar: 'bg-amber-400', badge: 'bg-amber-50 text-amber-800 border-amber-200', text: 'text-amber-900' },
                  2: { bar: 'bg-orange-400', badge: 'bg-orange-50 text-orange-800 border-orange-200', text: 'text-orange-900' },
                  1: { bar: 'bg-rose-500', badge: 'bg-rose-50 text-rose-800 border-rose-200', text: 'text-rose-900' }
                };
                const style = colorMap[dist.score];

                return (
                  <div key={dist.score} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${style.badge}`}>
                          {dist.score}점
                        </span>
                        <span className="font-semibold text-slate-700">
                          {dist.label.split('(')[0].trim()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-mono">
                          {dist.count}명
                        </span>
                        <span className="text-slate-400 text-[11px] font-medium min-w-[42px] text-right">
                          ({dist.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>
                긍정 응답 비율(4~5점):{' '}
                <strong className="text-blue-700 font-bold">
                  {(
                    (distribution.find((d) => d.score === 5)?.percentage || 0) +
                    (distribution.find((d) => d.score === 4)?.percentage || 0)
                  ).toFixed(1)}
                  %
                </strong>
              </span>
            </div>
            <span>이상치 및 불만족 응답 즉시 확인 가능</span>
          </div>
        </div>
      </div>
    </section>
  );
};
