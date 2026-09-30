import React, { useState } from 'react';
import { Table, Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { SurveyRow } from '../types';

interface RawDataTableProps {
  rows: SurveyRow[];
}

/**
 * 응답 원본 데이터 조회 컴포넌트
 * - 검색 및 부서 필터
 * - 페이지네이션
 * - 접기/펼치기 지원
 */
export const RawDataTable: React.FC<RawDataTableProps> = ({ rows }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Department unique list
  const departments = Array.from(new Set(rows.map((r) => r.department))).sort();

  // Filtered rows
  const filteredRows = rows.filter((row) => {
    const matchesDept = deptFilter === 'ALL' || row.department === deptFilter;
    const matchesSearch =
      !search ||
      row.department.toLowerCase().includes(search.toLowerCase()) ||
      row.positiveFeedback.toLowerCase().includes(search.toLowerCase()) ||
      row.improvementFeedback.toLowerCase().includes(search.toLowerCase()) ||
      String(row.id).includes(search);
    return matchesDept && matchesSearch;
  });

  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const pageRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <section className="mb-12 no-print">
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* 헤더 토글 바 */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
              <Table className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                응답 데이터 원본 목록 조회 ({rows.length}건)
              </h4>
              <p className="text-xs text-slate-500">개별 설문 응답 상세 데이터 및 서술형 원문 검색</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>{isOpen ? '데이터 목록 접기' : '데이터 목록 펼쳐보기'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isOpen && (
          <div className="p-5 border-t border-slate-200 space-y-4">
            {/* 검색 및 필터 바 */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="의견, 부서명, 번호 검색..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={deptFilter}
                  onChange={(e) => {
                    setDeptFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="py-1.5 px-2.5 text-xs rounded-md border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">전체 부서 ({departments.length})</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-xs text-slate-500 self-end sm:self-auto font-medium">
                검색 결과: <strong className="text-slate-900">{filteredRows.length}</strong>건
              </span>
            </div>

            {/* 테이블 */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">번호</th>
                    <th className="py-2.5 px-3 w-28">소속</th>
                    <th className="py-2.5 px-2 text-center w-16 bg-blue-50/60 text-blue-900">전반적</th>
                    <th className="py-2.5 px-2 text-center w-16">강의내용</th>
                    <th className="py-2.5 px-2 text-center w-16">강사전달</th>
                    <th className="py-2.5 px-2 text-center w-16">실습도움</th>
                    <th className="py-2.5 px-2 text-center w-16">추천의향</th>
                    <th className="py-2.5 px-3 min-w-[180px]">좋았던점</th>
                    <th className="py-2.5 px-3 min-w-[180px]">개선점</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pageRows.length > 0 ? (
                    pageRows.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/70">
                        <td className="py-2 px-3 text-center font-mono text-slate-500">{row.id}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{row.department}</td>
                        <td className="py-2 px-2 text-center font-bold text-blue-900 bg-blue-50/20 font-mono">
                          {row.overallSatisfaction}
                        </td>
                        <td className="py-2 px-2 text-center font-mono">{row.contentSatisfaction}</td>
                        <td className="py-2 px-2 text-center font-mono">{row.instructorClarity}</td>
                        <td className="py-2 px-2 text-center font-mono">{row.practiceHelpfulness}</td>
                        <td className="py-2 px-2 text-center font-mono">{row.recommendationScore}</td>
                        <td className="py-2 px-3 text-slate-700">{row.positiveFeedback || '-'}</td>
                        <td className="py-2 px-3 text-slate-700">{row.improvementFeedback || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        검색 조건에 맞는 응답 데이터가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  {filteredRows.length}건 중 {(safePage - 1) * pageSize + 1}~
                  {Math.min(safePage * pageSize, filteredRows.length)}건 표시
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={safePage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded border border-slate-300 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-semibold px-2 text-slate-700">
                    {safePage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={safePage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded border border-slate-300 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
