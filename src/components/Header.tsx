import React from 'react';
import { Award, Download, FileSpreadsheet, Printer, RotateCcw } from 'lucide-react';
import { generateSampleCsvString } from '../utils/sampleData';

interface HeaderProps {
  hasData: boolean;
  onLoadSample: () => void;
  onReset: () => void;
}

/**
 * 상단 헤더 컴포넌트: 웹앱 제목, 시스템 안내, 주요 퀵 액션 버튼
 */
export const Header: React.FC<HeaderProps> = ({ hasData, onLoadSample, onReset }) => {
  // 표준 CSV 서식 다운로드 기능
  const handleDownloadTemplate = () => {
    const csvContent = generateSampleCsvString();
    // Add UTF-8 BOM so Excel opens Korean characters correctly
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '교육만족도_설문_표준서식.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* 타이틀 및 공공기관 뱃지 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-xs shrink-0">
            <Award className="w-6 h-6 text-blue-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                교육 만족도 분석기
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                공공기관 교육운영
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              교육 만족도 설문 CSV 자동 집계 분석 및 결과보고서 자동 생성 시스템
            </p>
          </div>
        </div>

        {/* 우측 퀵 유틸리티 버튼 */}
        <div className="flex items-center flex-wrap gap-2 no-print">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-md border border-slate-300 transition-colors"
            title="엑셀에서 바로 사용 가능한 표준 양식 다운로드"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>표준 CSV 양식 받기</span>
          </button>

          {!hasData ? (
            <button
              type="button"
              onClick={onLoadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-md shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-100" />
              <span>샘플 데이터로 분석 체험</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-md border border-slate-300 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>보고서 인쇄</span>
              </button>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md border border-rose-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                <span>새로 분석하기</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
