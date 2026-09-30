import { SurveyRow, ValidationErrorDetail } from '../types';

/**
 * Standard RFC 4180 CSV parser supporting multiline fields, commas inside quotes, and escaped quotes.
 */
export function parseCsvRaw(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  // Strip BOM if present
  let text = csvText;
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  while (i < text.length) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i += 2;
          continue;
        } else {
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        currentField += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
        continue;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
        i++;
        continue;
      } else if (char === '\r') {
        if (nextChar === '\n') {
          i += 2;
        } else {
          i++;
        }
        currentRow.push(currentField.trim());
        if (currentRow.some((c) => c.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
        continue;
      } else if (char === '\n') {
        i++;
        currentRow.push(currentField.trim());
        if (currentRow.some((c) => c.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
        continue;
      } else {
        currentField += char;
        i++;
      }
    }
  }

  // Push remainder
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((c) => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Normalizes header string by removing spaces, underscores, and lowercase.
 */
function cleanHeader(header: string): string {
  return header.replace(/[\s_\-()[\]]/g, '').toLowerCase();
}

export interface ParseSurveyResult {
  rows: SurveyRow[];
  errors: ValidationErrorDetail[];
  isValid: boolean;
}

/**
 * Robust CSV Validation & Parser:
 * 1. Checks CSV format
 * 2. Checks all 9 required columns:
 *    ('번호', '소속', '전반적만족도', '강의내용', '강사전달력', '실습도움도', '추천의향', '좋았던점', '개선점')
 * 3. Checks satisfaction scores within valid range (1 - 5)
 */
export function parseSurveyCsv(csvText: string): ParseSurveyResult {
  const errors: ValidationErrorDetail[] = [];

  // 1. Basic Format Validation
  if (!csvText || typeof csvText !== 'string' || csvText.trim().length === 0) {
    errors.push({
      type: 'EMPTY_DATA',
      message: 'CSV 파일의 내용이 비어있습니다. 데이터를 포함한 유효한 CSV 파일을 업로드해주세요.'
    });
    return { rows: [], errors, isValid: false };
  }

  const rawRows = parseCsvRaw(csvText);

  if (rawRows.length < 2) {
    errors.push({
      type: 'FORMAT',
      message: 'CSV 파일에 헤더(열 제목) 또는 유효한 응답 데이터 행이 부족합니다. 최소 1개 이상의 데이터 행이 필요합니다.'
    });
    return { rows: [], errors, isValid: false };
  }

  const rawHeaders = rawRows[0];
  const cleanedHeaders = rawHeaders.map(cleanHeader);

  // Field mapping lookup supporting exact and fuzzy matches
  const findColumnIndex = (patterns: string[]): number => {
    for (const pattern of patterns) {
      const cleaned = cleanHeader(pattern);
      const exactIndex = cleanedHeaders.indexOf(cleaned);
      if (exactIndex !== -1) return exactIndex;
    }
    for (const pattern of patterns) {
      const cleaned = cleanHeader(pattern);
      const partialIndex = cleanedHeaders.findIndex((h) => h.includes(cleaned));
      if (partialIndex !== -1) return partialIndex;
    }
    return -1;
  };

  // Find all 9 required columns
  const idIdx = findColumnIndex(['번호', 'no', 'id', '순번', '연번']);
  const deptIdx = findColumnIndex(['소속', '부서', '기관', '소속부서', '소속기관', '부서명', '소속명']);
  const overallIdx = findColumnIndex(['전반적만족도', '전반만족도', '전반적', '만족도', '종합만족도']);
  const contentIdx = findColumnIndex(['강의내용', '교육내용', '내용만족도', '커리큘럼']);
  const instructorIdx = findColumnIndex(['강사전달력', '강사', '전달력', '강사만족도', '강의전달력']);
  const practiceIdx = findColumnIndex(['실습도움도', '실습', '실습만족도', '도움도', '실습도움']);
  const recommendIdx = findColumnIndex(['추천의향', '추천', '추천도', '추천점수']);
  const positiveIdx = findColumnIndex(['좋았던점', '좋은점', '만족스러운점', '긍정의견', '우수의견', '좋았던', '장점']);
  const improvementIdx = findColumnIndex(['개선점', '개선할점', '개선사항', '건의사항', '바라는점', '불만사항', '개선']);

  // Check ALL 9 required columns as explicitly specified
  const requiredSpecs: Array<{ name: string; index: number }> = [
    { name: '번호', index: idIdx },
    { name: '소속', index: deptIdx },
    { name: '전반적만족도', index: overallIdx },
    { name: '강의내용', index: contentIdx },
    { name: '강사전달력', index: instructorIdx },
    { name: '실습도움도', index: practiceIdx },
    { name: '추천의향', index: recommendIdx },
    { name: '좋았던점', index: positiveIdx },
    { name: '개선점', index: improvementIdx }
  ];

  const missingColumns = requiredSpecs.filter((spec) => spec.index === -1).map((spec) => spec.name);

  if (missingColumns.length > 0) {
    errors.push({
      type: 'MISSING_COLUMNS',
      message: `CSV 파일에 필수 열이 누락되었습니다: [${missingColumns.join(', ')}].\n` +
        `다음 9개 필수 열이 모두 포함되어야 합니다: '번호', '소속', '전반적만족도', '강의내용', '강사전달력', '실습도움도', '추천의향', '좋았던점', '개선점'`
    });
    return { rows: [], errors, isValid: false };
  }

  // 3. Row-level Score Validation (1 to 5)
  const rows: SurveyRow[] = [];
  const scoreColumns: Array<{ name: string; index: number }> = [
    { name: '전반적만족도', index: overallIdx },
    { name: '강의내용', index: contentIdx },
    { name: '강사전달력', index: instructorIdx },
    { name: '실습도움도', index: practiceIdx },
    { name: '추천의향', index: recommendIdx }
  ];

  const scoreErrors: ValidationErrorDetail[] = [];

  for (let rowIndex = 1; rowIndex < rawRows.length; rowIndex++) {
    const raw = rawRows[rowIndex];
    if (raw.length === 0 || raw.every((cell) => cell.trim() === '')) {
      continue; // Skip blank line
    }

    const rowNum = rowIndex + 1; // 1-indexed based on CSV line
    let rowHasScoreError = false;

    // Validate each satisfaction score column
    const parsedScores: Record<string, number> = {};

    for (const col of scoreColumns) {
      const cellValue = raw[col.index]?.trim();

      if (cellValue === undefined || cellValue === '') {
        scoreErrors.push({
          type: 'INVALID_SCORE',
          rowNumber: rowNum,
          columnName: col.name,
          invalidValue: '(빈 값)',
          message: `[행 ${rowNum}] '${col.name}' 점수 값이 비어있습니다. 1점부터 5점 사이의 점수를 입력해야 합니다.`
        });
        rowHasScoreError = true;
        continue;
      }

      const num = Number(cellValue);
      if (isNaN(num)) {
        scoreErrors.push({
          type: 'INVALID_SCORE',
          rowNumber: rowNum,
          columnName: col.name,
          invalidValue: cellValue,
          message: `[행 ${rowNum}] '${col.name}' 점수("${cellValue}")가 숫자가 아닙니다. 1점부터 5점 사이의 숫자를 입력해주세요.`
        });
        rowHasScoreError = true;
        continue;
      }

      if (num < 1 || num > 5) {
        scoreErrors.push({
          type: 'INVALID_SCORE',
          rowNumber: rowNum,
          columnName: col.name,
          invalidValue: cellValue,
          message: `[행 ${rowNum}] '${col.name}' 점수(${cellValue})가 유효 범위(1~5점)를 벗어났습니다. 만족도 점수는 1점부터 5점 사이여야 합니다.`
        });
        rowHasScoreError = true;
        continue;
      }

      parsedScores[col.name] = num;
    }

    if (!rowHasScoreError) {
      const rowId = raw[idIdx] || rowIndex;
      const department = raw[deptIdx]?.trim() || '기타/미지정';
      const positiveFeedback = raw[positiveIdx]?.trim() || '';
      const improvementFeedback = raw[improvementIdx]?.trim() || '';

      rows.push({
        id: rowId,
        department,
        overallSatisfaction: parsedScores['전반적만족도'],
        contentSatisfaction: parsedScores['강의내용'],
        instructorClarity: parsedScores['강사전달력'],
        practiceHelpfulness: parsedScores['실습도움도'],
        recommendationScore: parsedScores['추천의향'],
        positiveFeedback,
        improvementFeedback
      });
    }
  }

  // If there are score errors, abort and return detailed errors
  if (scoreErrors.length > 0) {
    return {
      rows: [],
      errors: scoreErrors,
      isValid: false
    };
  }

  if (rows.length === 0) {
    errors.push({
      type: 'EMPTY_DATA',
      message: 'CSV 파일에서 유효한 응답 데이터 행을 찾을 수 없습니다.'
    });
    return { rows: [], errors, isValid: false };
  }

  return { rows, errors: [], isValid: true };
}

/**
 * Reads a File with auto UTF-8 or EUC-KR fallback for Korean Excel CSVs.
 */
export async function readCsvFileContent(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  
  // Try UTF-8 first
  const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
  try {
    return utf8Decoder.decode(buffer);
  } catch {
    // If UTF-8 fails (e.g. legacy Windows Excel CP949 / EUC-KR), try euc-kr
    try {
      const eucKrDecoder = new TextDecoder('euc-kr');
      return eucKrDecoder.decode(buffer);
    } catch {
      // Fallback to lossy utf-8
      const fallbackDecoder = new TextDecoder('utf-8');
      return fallbackDecoder.decode(buffer);
    }
  }
}
