import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  FileCheck2,
  RefreshCw,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { readCsvFileContent } from '../utils/csvParser';
import { ValidationErrorDetail } from '../types';

interface FileUploadProps {
  onFileLoaded: (csvText: string, fileName: string) => void;
  onLoadSample: () => void;
  currentFileName: string | null;
  totalCount: number | null;
  errorMessage: string | null;
  validationErrors?: ValidationErrorDetail[] | null;
  onClearError: () => void;
}

/**
 * CSV 파일 업로드, 안내 문구 및 엄격한 유효성 검증 에러 패널 컴포넌트
 */
export const FileUpload: React.FC<FileUploadProps> = ({
  onFileLoaded,
  onLoadSample,
  currentFileName,
  totalCount,
  errorMessage,
  validationErrors,
  onClearError
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    // 1. 파일 확장자 검증
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('CSV 형식 파일(*.csv)만 업로드할 수 있습니다. 파일 확장자를 확인해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      onClearError();
      const content = await readCsvFileContent(file);
      onFileLoaded(content, file.name);
    } catch {
      alert('파일을 읽는 도중 오류가 발생했습니다. 파일 형식을 다시 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  // Group validation errors by type
  const missingColErrors = validationErrors?.filter((e) => e.type === 'MISSING_COLUMNS') || [];
  const scoreErrors = validationErrors?.filter((e) => e.type === 'INVALID_SCORE') || [];
  const formatErrors = validationErrors?.filter((e) => e.type === 'FORMAT' || e.type === 'EMPTY_DATA') || [];

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 mb-8 transition-all">
      {/* 2. 안내 문구 영역 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheetIcon className="w-5 h-5 text-blue-700" />
            CSV 파일 업로드 및 분석 준비
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            교육 수료 후 취합된 설문조사 CSV 파일을 업로드하면 5대 항목별 평균, 소속별 분석, 서술형 의견 키워드 빈도 및 결과보고서가 즉시 생성됩니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-700 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 transition-colors shrink-0 self-start sm:self-auto"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showGuide ? '서식 안내 닫기' : 'CSV 필수 9개 항목 및 유효범위 안내'}</span>
        </button>
      </div>

      {/* CSV 필수 항목 도움말 안내 박스 */}
      {showGuide && (
        <div className="mt-4 p-4 rounded-lg bg-blue-50/70 border border-blue-200/80 text-xs sm:text-sm text-slate-700 space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-blue-900">
              ※ 업로드할 CSV 파일에는 다음 9개 항목이 반드시 포함되어야 합니다:
            </p>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              점수 척도: 1점 ~ 5점
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1 font-mono text-xs">
            <span className="bg-white px-2 py-1 rounded border border-blue-200 text-blue-900 font-sans">
              1. 번호 (식별자)
            </span>
            <span className="bg-white px-2 py-1 rounded border border-blue-200 text-blue-900 font-sans">
              2. 소속 (부서/기관)
            </span>
            <span className="bg-white px-2 py-1 rounded border border-blue-200 text-blue-900 font-sans font-semibold">
              3. 전반적만족도 (1~5점)
            </span>
            <span className="bg-white px-2 py-1 rounded border border-blue-200 text-blue-900 font-sans font-semibold">
              4. 강의내용 (1~5점)
            </span>
            <span className="bg-white px-2 py-1 rounded border border-blue-200 text-blue-900 font-sans font-semibold">
              5. 강사전달력 (1~5점)
            </span>
            <span className="bg-white px-2 py-1 rounded border border-blue-200 text-blue-900 font-sans font-semibold">
              6. 실습도움도 (1~5점)
            </span>
            <span className="bg-white px-2 py-1 rounded border border-blue-200 text-blue-900 font-sans font-semibold">
              7. 추천의향 (1~5점)
            </span>
            <span className="bg-white px-2 py-1 rounded border border-blue-200 text-blue-900 font-sans">
              8. 좋았던점 (서술형)
            </span>
            <span className="bg-white px-2 py-1 rounded border border-blue-200 text-blue-900 font-sans">
              9. 개선점 (서술형)
            </span>
          </div>
          <p className="text-slate-500 text-xs pt-1">
            * 만족도 점수는 반드시 1 이상 5 이하의 숫자여야 하며, 유효 범위를 벗어나거나 빈 값일 경우 검증 오류가 표시됩니다.
          </p>
        </div>
      )}

      {/* 정밀 유효성 검증 오류 배너 */}
      {(errorMessage || (validationErrors && validationErrors.length > 0)) && (
        <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-rose-200/80">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <h4 className="text-sm font-bold text-rose-900">
                CSV 파일 유효성 검증 실패
              </h4>
              {validationErrors && validationErrors.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-200 text-rose-800">
                  총 {validationErrors.length}건 오류 감지
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onClearError}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline"
            >
              닫기
            </button>
          </div>

          {/* 일반 메시지 */}
          {errorMessage && (
            <p className="text-xs sm:text-sm text-rose-800 leading-relaxed whitespace-pre-line">
              {errorMessage}
            </p>
          )}

          {/* 1. 필수 열 누락 오류 */}
          {missingColErrors.length > 0 && (
            <div className="bg-white/90 p-3 rounded-lg border border-rose-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>[필수 열 누락 오류]</span>
              </div>
              {missingColErrors.map((err, idx) => (
                <p key={idx} className="text-xs text-rose-700 whitespace-pre-line pl-5">
                  {err.message}
                </p>
              ))}
            </div>
          )}

          {/* 2. 점수 유효 범위(1~5점) 초과/미달 오류 목록 */}
          {scoreErrors.length > 0 && (
            <div className="bg-white/90 p-3 rounded-lg border border-rose-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>[만족도 점수 범위(1~5점) 유효성 오류 ({scoreErrors.length}건)]</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  점수는 1점부터 5점 사이여야 합니다.
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 divide-y divide-rose-100">
                {scoreErrors.slice(0, 15).map((err, idx) => (
                  <div key={idx} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs text-rose-800">
                    <span className="font-mono font-medium">{err.message}</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-mono text-[11px]">
                      입력값: {err.invalidValue}
                    </span>
                  </div>
                ))}
              </div>

              {scoreErrors.length > 15 && (
                <p className="text-[11px] text-slate-500 pt-1">
                  * 외 {scoreErrors.length - 15}건의 점수 범위 오류가 추가로 존재합니다. CSV 원본 파일의 점수를 1~5점으로 수정한 후 다시 업로드해주세요.
                </p>
              )}
            </div>
          )}

          {/* 3. 파일 포맷/빈 데이터 오류 */}
          {formatErrors.length > 0 && (
            <div className="bg-white/90 p-3 rounded-lg border border-rose-200 space-y-1">
              {formatErrors.map((err, idx) => (
                <p key={idx} className="text-xs text-rose-700 pl-2">
                  • {err.message}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. CSV 파일 업로드 드롭존 영역 */}
      <div className="mt-5">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleFileInputChange}
        />

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-blue-600 bg-blue-50/60 scale-[0.99]'
              : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50/70 bg-slate-50/30'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 border border-blue-100">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <p className="text-base font-semibold text-slate-800">
                CSV 파일을 이곳에 끌어다 놓거나, <span className="text-blue-700 underline underline-offset-2">클릭하여 선택</span>하세요.
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                CSV 파일을 다시 업로드하면 언제든 새로운 분석 결과를 즉시 산출합니다.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-medium">
                지원 형식: .csv
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-medium">
                인코딩: UTF-8 / EUC-KR
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium border border-emerald-300">
                9개 필수 열 검증
              </span>
            </div>
          </div>
        </div>

        {/* 현재 로드된 파일 정보 또는 샘플 데이터 로드 바 */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-100/70 border border-slate-200 rounded-lg p-3 gap-2">
          {currentFileName && totalCount !== null ? (
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                분석 완료 파일: <strong className="text-slate-900">{currentFileName}</strong>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                전체 응답자: {totalCount.toLocaleString()}명
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
              <FileText className="w-4 h-4 text-slate-400 shrink-0" />
              <span>아직 업로드된 파일이 없습니다. 준비된 CSV가 없다면 샘플 데이터로 테스트해보세요.</span>
            </div>
          )}

          <div className="flex items-center gap-2 shrink-0">
            {currentFileName && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-300"
              >
                <RefreshCw className="w-3 h-3 text-slate-500" />
                <span>다른 파일 업로드</span>
              </button>
            )}
            <button
              type="button"
              onClick={onLoadSample}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-50 px-3 py-1 rounded border border-blue-300 shadow-2xs"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>샘플 데이터 바로 불러오기</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

function FileSpreadsheetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}
