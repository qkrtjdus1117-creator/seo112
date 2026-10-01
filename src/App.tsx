/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { CoreResultCards } from './components/CoreResultCards';
import { SatisfactionCharts } from './components/SatisfactionCharts';
import { DepartmentAnalysis } from './components/DepartmentAnalysis';
import { FeedbackAnalysis } from './components/FeedbackAnalysis';
import { ReportSummary } from './components/ReportSummary';
import { RawDataTable } from './components/RawDataTable';
import { AnalysisResult, ValidationErrorDetail } from './types';
import { parseSurveyCsv } from './utils/csvParser';
import { analyzeSurveyData } from './utils/analyzer';
import { SAMPLE_SURVEY_DATA } from './utils/sampleData';
import { ThemeProvider, useTheme } from './theme/ThemeContext';

/**
 * 교육 만족도 분석 웹앱 메인 컨텐츠 컴포넌트
 */
function AppContent() {
  const { theme } = useTheme();

  // 업로드된 파일명 및 원본 CSV 텍스트
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);

  // 분석 결과 데이터 객체 (null인 경우 분석 결과 영역 숨김)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // 파싱 또는 분석 에러 메시지
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 세부 유효성 검증 오류 목록
  const [validationErrors, setValidationErrors] = useState<ValidationErrorDetail[] | null>(null);

  /**
   * CSV 파일 내용 로드 및 엄격한 유효성 검증 실행
   */
  const handleProcessCsv = (csvText: string, fileName: string) => {
    setErrorMessage(null);
    setValidationErrors(null);

    // 1. CSV 파싱 및 9개 필수 열 / 점수 범위(1~5점) 정밀 검증
    const { rows, errors, isValid } = parseSurveyCsv(csvText);

    if (!isValid || errors.length > 0) {
      setValidationErrors(errors);
      setErrorMessage(
        '업로드된 CSV 파일 검증에 실패했습니다. 아래 오류 상세 내역을 확인하여 수정해주세요.'
      );
      setAnalysisResult(null);
      return;
    }

    if (rows.length === 0) {
      setErrorMessage('CSV 파일에 유효한 응답 데이터 행이 존재하지 않습니다.');
      setAnalysisResult(null);
      return;
    }

    try {
      // 2. 만족도 통계, 키워드 빈도, 서술형 의견 분류, 결과보고서 자동 분석
      const result = analyzeSurveyData(rows);
      setAnalysisResult(result);
      setCurrentFileName(fileName);
      setErrorMessage(null);
      setValidationErrors(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '데이터 분석 중 오류가 발생했습니다.';
      setErrorMessage(msg);
      setAnalysisResult(null);
    }
  };

  /**
   * 사전 제공 샘플 데이터 바로 불러오기 기능
   */
  const handleLoadSample = () => {
    setErrorMessage(null);
    setValidationErrors(null);
    try {
      const result = analyzeSurveyData(SAMPLE_SURVEY_DATA);
      setAnalysisResult(result);
      setCurrentFileName('공공_빅데이터_실무_만족도_샘플(40명).csv');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '샘플 데이터 로딩 실패';
      setErrorMessage(msg);
    }
  };

  /**
   * 데이터 초기화 (새로 분석하기)
   */
  const handleReset = () => {
    setAnalysisResult(null);
    setCurrentFileName(null);
    setErrorMessage(null);
    setValidationErrors(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 transition-colors">
      {/* 1. 상단 헤더: 제목 "교육 만족도 분석기" 및 공공기관 서식 유틸리티 & 테마 선택기 */}
      <Header
        hasData={analysisResult !== null}
        onLoadSample={handleLoadSample}
        onReset={handleReset}
      />

      {/* 메인 컨테이너 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 2. 안내 문구 및 3. CSV 파일 업로드 영역 (엄격한 9개 열 및 1~5점 검증) */}
        <FileUpload
          onFileLoaded={handleProcessCsv}
          onLoadSample={handleLoadSample}
          currentFileName={currentFileName}
          totalCount={analysisResult ? analysisResult.totalCount : null}
          errorMessage={errorMessage}
          validationErrors={validationErrors}
          onClearError={() => {
            setErrorMessage(null);
            setValidationErrors(null);
          }}
        />

        {/* 파일 업로드 전에는 분석 결과 영역을 숨김 */}
        {analysisResult && (
          <div className="space-y-2 animate-in fade-in duration-300">
            {/* 4. 핵심 결과 카드 */}
            <CoreResultCards
              totalCount={analysisResult.totalCount}
              overallAverage={analysisResult.averages.overallSatisfaction}
              highestItem={analysisResult.highestItem}
              lowestItem={analysisResult.lowestItem}
            />

            {/* 5. 만족도 분석 차트 (항목별 평균 막대그래프, 전반적만족도 1~5점 분포) */}
            <SatisfactionCharts
              itemScores={analysisResult.itemScores}
              distribution={analysisResult.distribution}
              totalCount={analysisResult.totalCount}
            />

            {/* 6. 소속별 분석 (소속별 전반적만족도 평균 비교 그래프 및 세부표) */}
            <DepartmentAnalysis departmentStats={analysisResult.departmentStats} />

            {/* 7. 서술형 의견 분석 (키워드 빈도 차트, 워드 클라우드, 유형별 요약) */}
            <FeedbackAnalysis
              positiveCategories={analysisResult.positiveCategories}
              improvementCategories={analysisResult.improvementCategories}
              positiveKeywords={analysisResult.positiveKeywords}
              improvementKeywords={analysisResult.improvementKeywords}
            />

            {/* 8. 교육 결과 요약 (결과보고서용 4대 핵심 요약문: 2~3문장 간결 작성) */}
            <ReportSummary report={analysisResult.reportSummary} />

            {/* 부가 기능: 설문 응답 원본 데이터 조회 (검색/필터링/페이지네이션) */}
            <RawDataTable rows={analysisResult.rawRows} />
          </div>
        )}

        {/* 파일 업로드 전 초기 안내 플레이스홀더 */}
        {!analysisResult && !errorMessage && !validationErrors && (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-300 bg-white/60">
            <div className="max-w-md mx-auto space-y-3">
              <h3 className="text-base font-bold text-slate-800">
                교육 만족도 CSV 파일을 업로드해주세요
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                설문조사 CSV 파일을 업로드하면 9개 필수 열과 만족도 점수(1~5점)를 자동 검증한 후, 5개 세부 항목별 평균, 점수대별 응답 분포, 소속 부서별 비교 그래프, 키워드 빈도 차트 및 워드 클라우드, 결과보고서 요약문이 화면에 자동으로 나타납니다.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white ${theme.primaryBg} ${theme.primaryHoverBg} ${theme.primaryActiveBg} rounded-lg shadow-xs transition-colors`}
                >
                  준비된 샘플 설문 데이터로 바로 확인해보기
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 하단 공공 포털 푸터 */}
      <footer className="bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>교육 만족도 분석기 | 공공기관 교육 운영 지원 솔루션</span>
          <span>개인정보보호 및 통계 처리 원칙을 준수하여 로컬 브라우저에서 안전하게 분석됩니다.</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
