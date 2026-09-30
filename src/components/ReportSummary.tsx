import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Award,
  ThumbsUp,
  AlertCircle,
  Lightbulb,
  Printer
} from 'lucide-react';
import { ReportSummaryData } from '../types';

interface ReportSummaryProps {
  report: ReportSummaryData;
  courseTitle?: string;
}

/**
 * 8. 교육 결과 요약 컴포넌트
 * 교육 담당자가 결과보고서에 즉시 붙여넣을 수 있도록 정형화된 4개 핵심 영역 요약문
 * - 교육 만족도 종합 평가 (2~3문장)
 * - 주요 긍정 의견 (2~3문장)
 * - 주요 개선 의견 (2~3문장)
 * - 향후 교육 운영 시사점 (2~3문장)
 */
export const ReportSummary: React.FC<ReportSummaryProps> = ({
  report,
  courseTitle = '공공 교육과정'
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // 보고서 전체 텍스트 조합
  const generateFullReportText = () => {
    return `[교육 만족도 분석 결과보고서 요약]\n
1. 교육 만족도 종합 평가
${report.overallAssessment}

2. 주요 긍정 의견
${report.mainPositives}

3. 주요 개선 의견
${report.mainImprovements}

4. 향후 교육 운영 시사점
${report.futureImplications}\n
* 작성일: ${new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
* 작성시스템: 교육 만족도 분석기`;
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(generateFullReportText());
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    } catch {
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  const handleCopySection = async (sectionName: string, text: string) => {
    try {
      await navigator.clipboard.writeText(`${sectionName}\n${text}`);
      setCopiedSection(sectionName);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      alert('복사에 실패했습니다.');
    }
  };

  return (
    <section className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-5 bg-blue-700 rounded-xs inline-block"></span>
            교육 결과 요약 (보고서용)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            결과보고서 결재 문서 및 내부 보고에 즉시 활용할 수 있도록 4대 핵심 항목별로 2~3문장으로 간결하게 작성되었습니다.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto no-print">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-300 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>보고서 인쇄</span>
          </button>

          <button
            type="button"
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-lg shadow-2xs transition-colors"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? '전체 복사 완료!' : '보고서 전체 텍스트 복사'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
        {/* 보고서 공식 헤더 */}
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-700" />
            <h4 className="text-base font-bold text-slate-900">
              만족도 설문조사 종합 분석 결과보고
            </h4>
          </div>
          <span className="text-xs text-slate-500">
            기준일: {new Date().toLocaleDateString('ko-KR')}
          </span>
        </div>

        {/* 4대 항목 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. 교육 만족도 종합 평가 */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-900">
                    1. 교육 만족도 종합 평가
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopySection('1. 교육 만족도 종합 평가', report.overallAssessment)
                  }
                  className="text-xs text-slate-500 hover:text-blue-700 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white"
                  title="이 항목만 복사"
                >
                  {copiedSection === '1. 교육 만족도 종합 평가' ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedSection === '1. 교육 만족도 종합 평가' ? '복사됨' : '복사'}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-1">
                {report.overallAssessment}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-blue-100/60 text-[11px] text-blue-800 font-semibold">
              ※ 결과보고서 총평 단락 인용 권장 (2~3문장)
            </div>
          </div>

          {/* 2. 주요 긍정 의견 */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <ThumbsUp className="w-4 h-4" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-900">
                    2. 주요 긍정 의견
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopySection('2. 주요 긍정 의견', report.mainPositives)
                  }
                  className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white"
                  title="이 항목만 복사"
                >
                  {copiedSection === '2. 주요 긍정 의견' ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedSection === '2. 주요 긍정 의견' ? '복사됨' : '복사'}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-1">
                {report.mainPositives}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-emerald-100/60 text-[11px] text-emerald-800 font-semibold">
              ※ 교육 우수 성과 요약 단락 인용 권장 (2~3문장)
            </div>
          </div>

          {/* 3. 주요 개선 의견 */}
          <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-900">
                    3. 주요 개선 의견
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopySection('3. 주요 개선 의견', report.mainImprovements)
                  }
                  className="text-xs text-slate-500 hover:text-amber-700 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white"
                  title="이 항목만 복사"
                >
                  {copiedSection === '3. 주요 개선 의견' ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedSection === '3. 주요 개선 의견' ? '복사됨' : '복사'}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-1">
                {report.mainImprovements}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-amber-100/60 text-[11px] text-amber-800 font-semibold">
              ※ 애로사항 및 개선 요구분석 단락 인용 권장 (2~3문장)
            </div>
          </div>

          {/* 4. 향후 교육 운영 시사점 */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-900">
                    4. 향후 교육 운영 시사점
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopySection('4. 향후 교육 운영 시사점', report.futureImplications)
                  }
                  className="text-xs text-slate-500 hover:text-indigo-700 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white"
                  title="이 항목만 복사"
                >
                  {copiedSection === '4. 향후 교육 운영 시사점' ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedSection === '4. 향후 교육 운영 시사점' ? '복사됨' : '복사'}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-1">
                {report.futureImplications}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-indigo-100/60 text-[11px] text-indigo-800 font-semibold">
              ※ 차기 교육계획 수립 및 환류 제언 단락 인용 권장 (2~3문장)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
