import React, { useState } from 'react';
import { Building2, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { DepartmentStat } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface DepartmentAnalysisProps {
  departmentStats: DepartmentStat[];
}

/**
 * 6. 소속별 분석 컴포넌트
 * - 차트 3: 소속별 전반적만족도 평균 비교 그래프
 * - 소속별 세부 평점 비교 매트릭스 표
 */
export const DepartmentAnalysis: React.FC<DepartmentAnalysisProps> = ({ departmentStats }) => {
  const { theme } = useTheme();
  const [showFullTable, setShowFullTable] = useState(false);
  const [sortField, setSortField] = useState<'avgOverall' | 'count'>('avgOverall');
  const [sortAsc, setSortAsc] = useState(false);

  // Sorting
  const sortedStats = [...departmentStats].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    return sortAsc ? valA - valB : valB - valA;
  });

  const toggleSort = (field: 'avgOverall' | 'count') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <span className={`w-2 h-5 ${theme.primaryBg} rounded-xs inline-block transition-colors`}></span>
          소속별 분석
        </h3>
        <span className="text-xs text-slate-500 font-normal">
          총 {departmentStats.length}개 소속 부서/기관 비교 분석
        </span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-md ${theme.accentBgLight} ${theme.primaryText} flex items-center justify-center transition-colors`}>
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                3. 소속별 전반적만족도 평균 비교 그래프
              </h4>
              <p className="text-xs text-slate-500">부서별 수강 인원 및 전반적 만족도 평균 비교</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
            <span className="text-slate-500 mr-1">정렬 기준:</span>
            <button
              type="button"
              onClick={() => toggleSort('avgOverall')}
              className={`px-2 py-1 rounded border text-xs font-medium flex items-center gap-1 transition-colors ${
                sortField === 'avgOverall'
                  ? `${theme.accentBgLight} ${theme.primaryText} border-slate-300 font-semibold`
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>만족도순</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => toggleSort('count')}
              className={`px-2 py-1 rounded border text-xs font-medium flex items-center gap-1 transition-colors ${
                sortField === 'count'
                  ? `${theme.accentBgLight} ${theme.primaryText} border-slate-300 font-semibold`
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>인원순</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 소속별 수평 막대그래프 시각화 */}
        <div className="mt-5 space-y-3.5">
          {sortedStats.map((dept, index) => {
            // Percent out of 5.0
            const percentage = (dept.avgOverall / 5.0) * 100;
            const isTop = index === 0 && sortField === 'avgOverall';

            return (
              <div
                key={dept.department}
                className="group p-2.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-[11px] font-bold text-slate-400 font-mono">
                      #{index + 1}
                    </span>
                    <span className="font-bold text-slate-800 text-sm">
                      {dept.department}
                    </span>
                    <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                      응답 {dept.count}명
                    </span>
                    {isTop && (
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                        최고 만족 부서
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-extrabold ${theme.primaryText} font-mono`}>
                      {dept.avgOverall.toFixed(2)}
                    </span>
                    <span className="text-slate-400 text-xs">/ 5.00점</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 relative">
                  {/* 4.0 guideline */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-slate-300 z-10"
                    style={{ left: '80%' }}
                    title="우수 기준 (4.0점)"
                  />
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      dept.avgOverall >= 4.5
                        ? theme.barColor
                        : dept.avgOverall >= 4.0
                        ? 'bg-sky-600'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 소속별 5대 세부 항목 상세표 토글 */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowFullTable(!showFullTable)}
            className={`w-full py-2 px-3 text-xs font-semibold text-slate-700 hover:${theme.primaryText} hover:bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center gap-1.5 transition-colors`}
          >
            <span>{showFullTable ? '소속별 5개 세부 항목 비교표 접기' : '소속별 5개 세부 항목 비교표 펼쳐보기'}</span>
            {showFullTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showFullTable && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700 border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">소속 부서</th>
                    <th className="py-2.5 px-3 text-center">응답수</th>
                    <th className={`py-2.5 px-3 text-right ${theme.accentBgLight} ${theme.primaryText}`}>전반적만족도</th>
                    <th className="py-2.5 px-3 text-right">강의내용</th>
                    <th className="py-2.5 px-3 text-right">강사전달력</th>
                    <th className="py-2.5 px-3 text-right">실습도움도</th>
                    <th className="py-2.5 px-3 text-right">추천의향</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedStats.map((dept) => (
                    <tr key={dept.department} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{dept.department}</td>
                      <td className="py-2.5 px-3 text-center font-mono">{dept.count}명</td>
                      <td className={`py-2.5 px-3 text-right font-bold ${theme.primaryText} ${theme.accentBgLight}/50 font-mono`}>
                        {dept.avgOverall.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">{dept.avgContent.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{dept.avgInstructor.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{dept.avgPractice.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{dept.avgRecommend.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
