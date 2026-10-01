import React, { useState } from 'react';
import { Award, Download, FileSpreadsheet, Printer, RotateCcw, Palette, Check } from 'lucide-react';
import { generateSampleCsvString } from '../utils/sampleData';
import { useTheme } from '../theme/ThemeContext';
import { THEMES, ThemeKey } from '../theme/theme';

interface HeaderProps {
  hasData: boolean;
  onLoadSample: () => void;
  onReset: () => void;
}

/**
 * 상단 헤더 컴포넌트: 웹앱 제목, 시스템 안내, 테마 색상 선택 및 주요 퀵 액션
 */
export const Header: React.FC<HeaderProps> = ({ hasData, onLoadSample, onReset }) => {
  const { themeKey, theme, setThemeKey } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

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
          <div
            className={`w-10 h-10 rounded-lg ${theme.primaryBg} flex items-center justify-center text-white shadow-xs shrink-0 transition-colors duration-300`}
          >
            <Award className="w-6 h-6 text-white/90" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                교육 만족도 분석기
              </h1>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold ${theme.accentBgLight} ${theme.primaryText} border border-slate-200 transition-colors`}
              >
                {theme.badge}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              교육 만족도 설문 CSV 자동 집계 분석 및 결과보고서 자동 생성 시스템
            </p>
          </div>
        </div>

        {/* 우측 유틸리티 버튼 & 테마 색상 선택기 */}
        <div className="flex items-center flex-wrap gap-2 no-print">
          {/* 테마 색상 선택 드롭다운 버튼 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-300 transition-colors"
              title="디자인 테마 색상 변경"
            >
              <span
                className="w-3 h-3 rounded-full inline-block border border-black/10 shadow-2xs"
                style={{ backgroundColor: theme.dotColor }}
              />
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              <span>{theme.name}</span>
            </button>

            {/* 테마 선택 팝업 */}
            {showThemeMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowThemeMenu(false)}
                />
                <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                    디자인 테마 색상 변경
                  </div>
                  <div className="space-y-1 mt-1">
                    {(Object.keys(THEMES) as ThemeKey[]).map((key) => {
                      const t = THEMES[key];
                      const isSelected = themeKey === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setThemeKey(key);
                            setShowThemeMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                            isSelected
                              ? 'bg-slate-100 text-slate-900 font-bold'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full inline-block shadow-2xs border border-black/15"
                              style={{ backgroundColor: t.dotColor }}
                            />
                            <span>{t.name}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-slate-900" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 px-2 leading-relaxed">
                    * 정부 표준 네이비, 차분한 슬레이트, 딥 틸 등 선호하는 색상 톤으로 즉시 전환됩니다.
                  </div>
                </div>
              </>
            )}
          </div>

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
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white ${theme.primaryBg} ${theme.primaryHoverBg} ${theme.primaryActiveBg} rounded-md shadow-xs transition-colors`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-white/90" />
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
