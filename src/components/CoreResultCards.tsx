import React from 'react';
import { Users, Star, TrendingUp, AlertTriangle } from 'lucide-react';
import { ItemScoreInfo } from '../types';

interface CoreResultCardsProps {
  totalCount: number;
  overallAverage: number;
  highestItem: ItemScoreInfo;
  lowestItem: ItemScoreInfo;
}

/**
 * 4. 핵심 결과 카드 컴포넌트
 * - 전체 응답자 수
 * - 전반적 만족도 평균 (소수점 둘째 자리)
 * - 가장 높은 평가 항목 및 점수
 * - 가장 낮은 평가 항목 및 점수
 */
export const CoreResultCards: React.FC<CoreResultCardsProps> = ({
  totalCount,
  overallAverage,
  highestItem,
  lowestItem
}) => {
  // 100점 만점 환산 점수
  const convertedScore100 = ((overallAverage / 5) * 100).toFixed(1);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-5 bg-blue-700 rounded-xs inline-block"></span>
          핵심 결과 요약
        </h3>
        <span className="text-xs text-slate-500 font-normal">
          5점 척도 기준 (소수점 둘째 자리 산출)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 카드 1: 전체 응답자 수 */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 relative overflow-hidden transition-all hover:border-slate-300">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              전체 응답자 수
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalCount.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-slate-600">명</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">설문 유효 응답률</span>
            <span className="font-semibold text-blue-700">100% 정상 수렴</span>
          </div>
        </div>

        {/* 카드 2: 전반적 만족도 평균 */}
        <div className="bg-white rounded-xl border border-blue-200/80 shadow-2xs p-5 relative overflow-hidden transition-all hover:border-blue-300">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-wider text-blue-700 uppercase">
              전반적 만족도 평균
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {overallAverage.toFixed(2)}
            </span>
            <span className="text-sm font-medium text-slate-400">/ 5.00점</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">100점 환산 점수</span>
            <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              {convertedScore100}점
            </span>
          </div>
        </div>

        {/* 카드 3: 가장 높은 평가 항목 */}
        <div className="bg-white rounded-xl border border-emerald-200/80 shadow-2xs p-5 relative overflow-hidden transition-all hover:border-emerald-300">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">
              가장 높은 평가 항목
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-900 truncate" title={highestItem.label}>
              {highestItem.label}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                {highestItem.score.toFixed(2)}
              </span>
              <span className="text-xs font-medium text-slate-400">점</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">최고 만족 영역</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              최우수 평점
            </span>
          </div>
        </div>

        {/* 카드 4: 가장 낮은 평가 항목 */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 relative overflow-hidden transition-all hover:border-slate-300">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
              가장 낮은 평가 항목
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-900 truncate" title={lowestItem.label}>
              {lowestItem.label}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-700 tracking-tight">
                {lowestItem.score.toFixed(2)}
              </span>
              <span className="text-xs font-medium text-slate-400">점</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">개선 집중 영역</span>
            <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
              차기 보완 과제
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
