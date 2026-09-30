import React, { useState } from 'react';
import {
  MessageSquare,
  MessageSquarePlus,
  Quote,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BarChart2,
  Cloud,
  Layers,
  Filter,
  X
} from 'lucide-react';
import {
  CategorySummary,
  ImprovementCategoryType,
  KeywordFrequency,
  PositiveCategoryType
} from '../types';

interface FeedbackAnalysisProps {
  positiveCategories: CategorySummary<PositiveCategoryType>[];
  improvementCategories: CategorySummary<ImprovementCategoryType>[];
  positiveKeywords: KeywordFrequency[];
  improvementKeywords: KeywordFrequency[];
}

type VisualizationMode = 'chart' | 'cloud' | 'categories';

/**
 * 7. 서술형 의견 분석 컴포넌트
 * - 좋았던점 (5대 분류) & 개선점 (6대 분류)
 * - 핵심 키워드 빈도 막대그래프 (Keyword Frequency Bar Chart)
 * - 인터랙티브 워드 클라우드 (Word Cloud)
 * - 키워드 클릭 시 해당 의견 즉시 필터링 및 하이라이팅
 */
export const FeedbackAnalysis: React.FC<FeedbackAnalysisProps> = ({
  positiveCategories,
  improvementCategories,
  positiveKeywords,
  improvementKeywords
}) => {
  const [activeTab, setActiveTab] = useState<'positive' | 'improvement'>('positive');
  const [visMode, setVisMode] = useState<VisualizationMode>('chart');
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  // Total counts
  const totalPositiveCount = positiveCategories.reduce((sum, c) => sum + c.count, 0);
  const totalImprovementCount = improvementCategories.reduce((sum, c) => sum + c.count, 0);

  const currentKeywords = activeTab === 'positive' ? positiveKeywords : improvementKeywords;
  const currentCategories = activeTab === 'positive' ? positiveCategories : improvementCategories;
  const maxKeywordCount = Math.max(...currentKeywords.map((k) => k.count), 1);

  // Filtered comments if a keyword is selected
  const allComments = currentCategories.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, category: cat.category }))
  );

  const filteredComments = selectedKeyword
    ? allComments.filter((item) =>
        item.text.toLowerCase().includes(selectedKeyword.toLowerCase())
      )
    : [];

  const handleTabChange = (tab: 'positive' | 'improvement') => {
    setActiveTab(tab);
    setSelectedKeyword(null);
    setExpandedCat(null);
  };

  return (
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-5 bg-blue-700 rounded-xs inline-block"></span>
            서술형 의견 분석 & 키워드 시각화
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            좋았던 점과 개선점의 유형별 분류, 핵심 빈출 키워드 차트 및 워드 클라우드 분석
          </p>
        </div>

        {/* 시각화 모드 전환 버튼 (차트 / 워드클라우드 / 유형별) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setVisMode('chart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              visMode === 'chart'
                ? 'bg-white text-blue-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>키워드 빈도 차트</span>
          </button>
          <button
            type="button"
            onClick={() => setVisMode('cloud')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              visMode === 'cloud'
                ? 'bg-white text-blue-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>워드 클라우드</span>
          </button>
          <button
            type="button"
            onClick={() => setVisMode('categories')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              visMode === 'categories'
                ? 'bg-white text-blue-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>유형별 상세 분석</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* 탭 네비게이션: 좋았던점 vs 개선점 */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-2 gap-2">
          <button
            type="button"
            onClick={() => handleTabChange('positive')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'positive'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>좋았던 점 (긍정 피드백 분석)</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {totalPositiveCount}건
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('improvement')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'improvement'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <MessageSquarePlus className="w-4 h-4 text-amber-600" />
            <span>개선할 점 (개선 요청 분석)</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
              {totalImprovementCount}건
            </span>
          </button>
        </div>

        {/* 메인 뷰 컨텐츠 */}
        <div className="p-5">
          {/* 1. 키워드 빈도 막대그래프 모드 */}
          {visMode === 'chart' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-100 gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {activeTab === 'positive' ? '긍정 피드백' : '개선 요구사항'} 핵심 키워드 빈도 분포
                  </h4>
                  <p className="text-xs text-slate-500">
                    의견 서술문에서 도출된 핵심 키워드의 언급 빈도(건수) 및 수강생 언급 비율(%)
                  </p>
                </div>
                <span className="text-xs text-slate-400">
                  키워드를 클릭하면 해당 의견을 아래에서 바로 확인할 수 있습니다.
                </span>
              </div>

              {/* 막대그래프 리스트 */}
              <div className="space-y-3 pt-2">
                {currentKeywords.map((kw, index) => {
                  const barWidth = (kw.count / maxKeywordCount) * 100;
                  const isSelected = selectedKeyword === kw.keyword;

                  return (
                    <div
                      key={kw.keyword}
                      onClick={() =>
                        setSelectedKeyword(isSelected ? null : kw.keyword)
                      }
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? activeTab === 'positive'
                            ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200'
                            : 'bg-amber-50 border-amber-400 ring-2 ring-amber-200'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 text-[11px] font-bold text-slate-400 font-mono">
                            #{index + 1}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">
                            {kw.keyword}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                              activeTab === 'positive'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {kw.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-sm font-extrabold text-slate-900">
                            {kw.count}건 언급
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            ({kw.percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>

                      {/* Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            activeTab === 'positive'
                              ? index === 0
                                ? 'bg-emerald-600'
                                : 'bg-emerald-500'
                              : index === 0
                              ? 'bg-amber-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. 워드 클라우드 (Word Cloud) 모드 */}
          {visMode === 'cloud' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-100 gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {activeTab === 'positive' ? '긍정 피드백' : '개선 요구사항'} 워드 클라우드
                  </h4>
                  <p className="text-xs text-slate-500">
                    언급 빈도가 높을수록 글자 크기와 색상이 굵고 선명하게 강조됩니다.
                  </p>
                </div>
                <span className="text-xs text-slate-400">
                  태그를 클릭하면 연관된 상세 의견을 필터링합니다.
                </span>
              </div>

              {/* 워드 클라우드 캔버스 컨테이너 */}
              <div
                className={`min-h-[220px] rounded-xl p-8 flex flex-wrap items-center justify-center gap-4 text-center border ${
                  activeTab === 'positive'
                    ? 'bg-gradient-to-br from-emerald-50/40 to-teal-50/20 border-emerald-100'
                    : 'bg-gradient-to-br from-amber-50/40 to-orange-50/20 border-amber-100'
                }`}
              >
                {currentKeywords.map((kw, index) => {
                  const isSelected = selectedKeyword === kw.keyword;
                  // Dynamic sizing based on rank
                  const sizeClasses = [
                    'text-2xl sm:text-3xl font-black tracking-tight',
                    'text-xl sm:text-2xl font-extrabold',
                    'text-lg sm:text-xl font-bold',
                    'text-base sm:text-lg font-semibold',
                    'text-sm sm:text-base font-semibold',
                    'text-xs sm:text-sm font-medium'
                  ];
                  const sizeClass = sizeClasses[Math.min(index, sizeClasses.length - 1)];

                  return (
                    <button
                      key={kw.keyword}
                      type="button"
                      onClick={() =>
                        setSelectedKeyword(isSelected ? null : kw.keyword)
                      }
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 transform hover:scale-105 ${sizeClass} ${
                        isSelected
                          ? activeTab === 'positive'
                            ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                            : 'bg-amber-600 text-white shadow-md ring-2 ring-amber-300'
                          : activeTab === 'positive'
                          ? 'bg-white/90 text-emerald-900 border border-emerald-200/80 shadow-2xs hover:bg-emerald-100/60'
                          : 'bg-white/90 text-amber-900 border border-amber-200/80 shadow-2xs hover:bg-amber-100/60'
                      }`}
                    >
                      <span>{kw.keyword}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100/80 text-slate-700 font-mono font-normal">
                        {kw.count}건
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. 유형별 상세 분석 (5대 / 6대 기준 카드) 모드 */}
          {visMode === 'categories' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-slate-100 text-xs text-slate-500">
                {activeTab === 'positive'
                  ? '좋았던점 5대 기준: 실습, 강의 내용, 업무 활용, 강사 설명, 기타'
                  : '개선점 6대 기준: 실습 시간, 진행 속도, 초보자 설명, 자료 및 예제, 추가 기능 요청, 기타'}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {currentCategories.map((cat, index) => {
                  const isExpanded = expandedCat === cat.category;
                  const isTop = index === 0;

                  return (
                    <div
                      key={cat.category}
                      className={`rounded-xl border transition-all ${
                        isTop
                          ? activeTab === 'positive'
                            ? 'border-emerald-200/90 bg-emerald-50/20'
                            : 'border-amber-200/90 bg-amber-50/20'
                          : 'border-slate-200 bg-white'
                      } p-4.5`}
                    >
                      {/* 헤더 */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${
                              activeTab === 'positive'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            #{index + 1}
                          </span>
                          <h4 className="text-base font-bold text-slate-900">
                            {cat.category}
                          </h4>
                          {isTop && (
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                                activeTab === 'positive'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border-amber-300'
                              }`}
                            >
                              <Sparkles className="w-3 h-3" />
                              {activeTab === 'positive' ? '최다 호평 유형' : '최우선 개선 요구'}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-base font-extrabold text-slate-900 font-mono">
                              {cat.count}건
                            </span>
                            <span className="text-xs text-slate-500 ml-1.5 font-medium">
                              ({cat.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedCat(isExpanded ? null : cat.category)
                            }
                            className="text-xs font-semibold text-blue-700 hover:text-blue-900 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 flex items-center gap-1 transition-colors"
                          >
                            <span>{isExpanded ? '접기' : '의견 전체 보기'}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* 비율 바 */}
                      <div className="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            activeTab === 'positive' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>

                      {/* 대표 의견 요약 (간단한 요약문) */}
                      <div className="mt-3.5 p-3 rounded-lg bg-slate-50/80 border border-slate-200/60 text-xs sm:text-sm text-slate-700">
                        <strong className="text-slate-900 font-semibold block mb-0.5">
                          [대표 의견 요약]
                        </strong>
                        <p className="leading-relaxed">{cat.summary}</p>
                      </div>

                      {/* 대표 인용구 */}
                      {cat.representativeQuotes.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase">
                            주요 응답 예시
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {cat.representativeQuotes.map((quote, qIdx) => (
                              <div
                                key={qIdx}
                                className="flex items-start gap-2 p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700"
                              >
                                <Quote
                                  className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                    activeTab === 'positive'
                                      ? 'text-emerald-600'
                                      : 'text-amber-600'
                                  }`}
                                />
                                <span className="line-clamp-2 italic">"{quote}"</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 펼쳐보기 */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <h5 className="text-xs font-bold text-slate-800 mb-2">
                            '{cat.category}' 접수 의견 전체 ({cat.items.length}건)
                          </h5>
                          <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                            {cat.items.map((item, iIdx) => (
                              <div
                                key={iIdx}
                                className="p-2.5 rounded-md bg-white border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5"
                              >
                                <span className="text-slate-800 leading-relaxed">
                                  {item.text}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0 self-start sm:self-auto">
                                  {item.department}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 키워드 선택 시 실시간 필터링된 의견 목록 표시 영역 */}
          {selectedKeyword && (
            <div className="mt-6 pt-5 border-t border-slate-200 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-700" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    선택 키워드: <strong className="text-blue-700">'{selectedKeyword}'</strong> 포함 의견 ({filteredComments.length}건)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedKeyword(null)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white px-2 py-1 rounded border border-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>필터 해제</span>
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {filteredComments.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-white border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:border-blue-300 transition-colors"
                  >
                    <span className="text-slate-800 leading-relaxed font-medium">
                      {item.text}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-semibold">
                        {item.department}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[11px] font-semibold border border-blue-200">
                        {item.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
