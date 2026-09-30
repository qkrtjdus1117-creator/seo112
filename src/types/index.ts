export interface SurveyRow {
  id: number | string;
  department: string;
  overallSatisfaction: number;
  contentSatisfaction: number;
  instructorClarity: number;
  practiceHelpfulness: number;
  recommendationScore: number;
  positiveFeedback: string;
  improvementFeedback: string;
}

export type SatisfactionItemKey =
  | 'overallSatisfaction'
  | 'contentSatisfaction'
  | 'instructorClarity'
  | 'practiceHelpfulness'
  | 'recommendationScore';

export interface ItemScoreInfo {
  key: SatisfactionItemKey;
  label: string;
  score: number;
}

export interface ScoreDistribution {
  score: number; // 1 to 5
  label: string;
  count: number;
  percentage: number;
}

export interface DepartmentStat {
  department: string;
  count: number;
  avgOverall: number;
  avgContent: number;
  avgInstructor: number;
  avgPractice: number;
  avgRecommend: number;
}

export type PositiveCategoryType = '실습' | '강의 내용' | '업무 활용' | '강사 설명' | '기타';
export type ImprovementCategoryType =
  | '실습 시간'
  | '진행 속도'
  | '초보자 설명'
  | '자료 및 예제'
  | '추가 기능 요청'
  | '기타';

export interface CategorySummary<T extends string> {
  category: T;
  count: number;
  percentage: number;
  representativeQuotes: string[];
  summary: string;
  items: Array<{
    id: string | number;
    department: string;
    text: string;
    score?: number;
  }>;
}

export interface ReportSummaryData {
  overallAssessment: string;
  mainPositives: string;
  mainImprovements: string;
  futureImplications: string;
}

export interface KeywordFrequency {
  keyword: string;
  count: number;
  percentage: number;
  category: string;
}

export interface ValidationErrorDetail {
  type: 'FORMAT' | 'MISSING_COLUMNS' | 'INVALID_SCORE' | 'EMPTY_DATA';
  message: string;
  rowNumber?: number;
  columnName?: string;
  invalidValue?: string;
}

export interface AnalysisResult {
  totalCount: number;
  averages: {
    overallSatisfaction: number;
    contentSatisfaction: number;
    instructorClarity: number;
    practiceHelpfulness: number;
    recommendationScore: number;
  };
  itemScores: ItemScoreInfo[];
  highestItem: ItemScoreInfo;
  lowestItem: ItemScoreInfo;
  distribution: ScoreDistribution[];
  departmentStats: DepartmentStat[];
  positiveCategories: CategorySummary<PositiveCategoryType>[];
  improvementCategories: CategorySummary<ImprovementCategoryType>[];
  positiveKeywords: KeywordFrequency[];
  improvementKeywords: KeywordFrequency[];
  reportSummary: ReportSummaryData;
  rawRows: SurveyRow[];
}

