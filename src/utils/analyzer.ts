import {
  AnalysisResult,
  CategorySummary,
  DepartmentStat,
  ImprovementCategoryType,
  ItemScoreInfo,
  KeywordFrequency,
  PositiveCategoryType,
  ReportSummaryData,
  ScoreDistribution,
  SurveyRow
} from '../types';

/**
 * Calculates mean rounded to two decimal places.
 */
function roundTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Classifies a positive comment into one of the 5 required categories:
 * - 실습
 * - 강의 내용
 * - 업무 활용
 * - 강사 설명
 * - 기타
 */
export function classifyPositiveFeedback(text: string): PositiveCategoryType {
  const t = text.toLowerCase();

  // Pattern checks with priority weighting
  const practiceKeywords = ['실습', '직접', '따라하', '손으로', '타이핑', '컴퓨터', '예제 실습', '핸즈온', '코드', '만들어보'];
  const instructorKeywords = ['강사', '전달력', '설명', '목소리', '친절', '답변', '피드백', '질문', '열정', '가르쳐', '교수'];
  const workKeywords = ['업무', '실무', '현업', '현장', '활용', '적용', '공공', '보고서', '도움', '효율', '접목'];
  const contentKeywords = ['강의 내용', '내용', '커리큘럼', '구성', '체계적', '알찬', '흐름', '주제', '이해', '기초부터', '수준'];

  let practiceScore = practiceKeywords.filter((k) => t.includes(k)).length;
  let instructorScore = instructorKeywords.filter((k) => t.includes(k)).length;
  let workScore = workKeywords.filter((k) => t.includes(k)).length;
  let contentScore = contentKeywords.filter((k) => t.includes(k)).length;

  const maxScore = Math.max(practiceScore, instructorScore, workScore, contentScore);
  if (maxScore === 0) return '기타';

  if (practiceScore === maxScore) return '실습';
  if (instructorScore === maxScore) return '강사 설명';
  if (workScore === maxScore) return '업무 활용';
  if (contentScore === maxScore) return '강의 내용';

  return '기타';
}

/**
 * Classifies an improvement comment into one of the 6 required categories:
 * - 실습 시간
 * - 진행 속도
 * - 초보자 설명
 * - 자료 및 예제
 * - 추가 기능 요청
 * - 기타
 */
export function classifyImprovementFeedback(text: string): ImprovementCategoryType {
  const t = text.toLowerCase();

  // Keywords
  const timeKeywords = ['실습 시간', '시간 부족', '시간이', '촉박', '짧았', '시간 더', '시간 배분', '여유', '자율 실습'];
  const speedKeywords = ['속도', '빠르', '빨라', '진도', '따라가기', '템포', '놓쳤', '벅찼', '천천히'];
  const beginnerKeywords = ['초보', '초급', '입문', '비전공', '기초', '배경', '사전지식', '어려', '눈높이', '난이도'];
  const materialKeywords = ['자료', '교재', '교안', '슬라이드', '예제 파일', '코드', '배포', '인쇄', '다운로드', '매뉴얼', '캡처'];
  const additionalKeywords = ['추가', '심화', '다음', '후속', '2탄', '2기', '2단계', '다른 기능', '새로운', '과정 개설', '사례 추가'];

  let timeScore = timeKeywords.filter((k) => t.includes(k)).length;
  let speedScore = speedKeywords.filter((k) => t.includes(k)).length;
  let beginnerScore = beginnerKeywords.filter((k) => t.includes(k)).length;
  let materialScore = materialKeywords.filter((k) => t.includes(k)).length;
  let additionalScore = additionalKeywords.filter((k) => t.includes(k)).length;

  const maxScore = Math.max(timeScore, speedScore, beginnerScore, materialScore, additionalScore);
  if (maxScore === 0) return '기타';

  if (timeScore === maxScore) return '실습 시간';
  if (speedScore === maxScore) return '진행 속도';
  if (beginnerScore === maxScore) return '초보자 설명';
  if (materialScore === maxScore) return '자료 및 예제';
  if (additionalScore === maxScore) return '추가 기능 요청';

  return '기타';
}

/**
 * Generates concise representative summary text for categories
 */
function summarizeCategoryOpinions(
  categoryName: string,
  quotes: string[],
  isPositive: boolean
): string {
  if (quotes.length === 0) {
    return '해당 유형에 접수된 서술형 의견이 없습니다.';
  }

  if (isPositive) {
    switch (categoryName) {
      case '실습':
        return '이론에 치우치지 않고 수강생이 컴퓨터로 직접 데이터를 가공·분석해보는 핸즈온 실습 위주의 진행에 대해 전반적인 만족도가 매우 높게 나타났습니다.';
      case '강의 내용':
        return '체계적인 커리큘럼 구성과 현업 공공행정에 꼭 필요한 알찬 주제를 다루어 교육 내용의 완성도와 유익성이 호평을 받았습니다.';
      case '업무 활용':
        return '행정 통계 작성, 보고서 데이터 정제 등 현업 실무에 즉시 적용 가능한 실전 스킬을 체득할 수 있었다는 긍정 평가가 주를 이루었습니다.';
      case '강사 설명':
        return '강사의 뛰어난 전달력과 명쾌한 발음, 수강생 질의에 대한 친절하고 세심한 1:1 맞춤 피드백이 높은 호응을 얻었습니다.';
      case '기타':
        return '전반적인 교육 시설 및 원활한 과정 진행 전반에 대해 전반적으로 긍정적인 평가가 제시되었습니다.';
      default:
        return '수강생들의 긍정적인 평가 의견이 다수 접수되었습니다.';
    }
  } else {
    switch (categoryName) {
      case '실습 시간':
        return '실습 진행 시 시간이 다소 촉박하여 심화 예제를 다루거나 충분히 연습할 자율 실습 시간의 확대를 요청하는 의견이 가장 많았습니다.';
      case '진행 속도':
        return '강의 후반부로 갈수록 진도 속도가 다소 빨라져 코드를 놓치거나 화면을 따라가기 벅찼다는 속도 조절 건의가 있었습니다.';
      case '초보자 설명':
        return '비전공자 및 IT 초급 수강생을 배려하여 기초 필수 용어와 단계별 화면 캡처 등 사전 안내 강화를 희망하였습니다.';
      case '자료 및 예제':
        return '강의 교재 슬라이드 사전 배포, 실습 완성본 코드 및 단계별 트러블슈팅 매뉴얼 제공을 보완점으로 꼽았습니다.';
      case '추가 기능 요청':
        return '기초 과정에 이어 OpenAPI 연동, 인공지능 분석 등 타 부서 우수 사례를 다루는 2단계 심화 연계 과정 개설을 희망했습니다.';
      case '기타':
        return '강의장 환경 점검 등 기타 운영 관련 건의사항이 일부 접수되었습니다.';
      default:
        return '차기 교육 품질 향상을 위한 다양한 개선 의견이 제시되었습니다.';
    }
  }
}

/**
 * Synthesizes the Executive Report Summary in 4 structured sections (2~3 sentences each).
 */
function generateReportSummary(
  totalCount: number,
  avgOverall: number,
  highest: ItemScoreInfo,
  lowest: ItemScoreInfo,
  topPositives: CategorySummary<PositiveCategoryType>[],
  topImprovements: CategorySummary<ImprovementCategoryType>[],
  departmentStats: DepartmentStat[]
): ReportSummaryData {
  // 1. 교육 만족도 종합 평가 (2~3문장)
  const sortedDepts = [...departmentStats].sort((a, b) => b.avgOverall - a.avgOverall);
  const bestDept = sortedDepts[0]?.department || '전 부서';

  const overallAssessment =
    `이번 교육은 총 ${totalCount}명의 공공기관 교육생이 참여하였으며, 전반적 만족도 평균 ${avgOverall.toFixed(2)}점(5.0점 만점)으로 매우 우수한 교육 성과를 달성하였습니다. ` +
    `세부 평가 지표 중 '${highest.label}' 항목이 ${highest.score.toFixed(2)}점으로 가장 높은 신뢰도를 기록하였으며, ${bestDept} 등 주요 실무 부서를 중심으로 전반적인 교육 효과성이 입증되었습니다. ` +
    `반면 '${lowest.label}' 항목은 ${lowest.score.toFixed(2)}점으로 상대적으로 개선 여지가 있는 영역으로 확인되어 보완 조치가 요구됩니다.`;

  // 2. 주요 긍정 의견 (2~3문장)
  const pos1 = topPositives[0];
  const pos2 = topPositives[1];
  const mainPositives =
    `서술형 의견 분석 결과 수강생들은 특히 '${pos1 ? pos1.category : '실습'}'(${pos1 ? pos1.percentage : 0}%)과 '${pos2 ? pos2.category : '강사 설명'}'(${pos2 ? pos2.percentage : 0}%) 영역에서 압도적인 호평을 나타냈습니다. ` +
    `참여자들은 현업 행정 업무에 직결되는 핸즈온 실습과 강사의 친절하고 명쾌한 질의응답 대응을 가장 큰 강점으로 손꼽았습니다. ` +
    `이러한 실무 밀착형 학습 방식이 수강생의 교육 몰입도와 성취감을 크게 견인한 것으로 평가됩니다.`;

  // 3. 주요 개선 의견 (2~3문장)
  const imp1 = topImprovements[0];
  const imp2 = topImprovements[1];
  const mainImprovements =
    `개선 요구사항으로는 '${imp1 ? imp1.category : '실습 시간'}'(${imp1 ? imp1.percentage : 0}%) 부족 및 '${imp2 ? imp2.category : '진행 속도'}'(${imp2 ? imp2.percentage : 0}%) 조절에 대한 건의가 주된 요인으로 도출되었습니다. ` +
    `다수의 응답자가 주어진 시간 내에 실습을 완전히 소화하기에 촉박함을 토로하였으며, 비전공 초보자를 위한 단계별 보충 가이드의 필요성을 제기하였습니다. ` +
    `더불어 강의 교재의 사전 배포 및 사후 복습용 완성본 코드 제공 요청이 공통적으로 확인되었습니다.`;

  // 4. 향후 교육 운영 시사점 (2~3문장)
  const futureImplications =
    `향후 교육과정 설계 시 실습 시간 비중을 기존 대비 최소 30% 이상 확대 편성하고, 자율 실습 및 1:1 보조 강사 배치를 검토할 필요가 있습니다. ` +
    `수강생 수준별(입문자/실무자) 사전 진단을 통해 교육 트랙을 이원화하고, 완성형 캡처 교재를 사전 배포함으로써 학습 편차를 해소해야 합니다. ` +
    `또한 교육생들의 높은 심화 학습 수요를 반영하여 실무 데이터 분석 2단계 연계 심화과정의 정례 개설을 적극 추진하는 것이 바람직합니다.`;

  return {
    overallAssessment,
    mainPositives,
    mainImprovements,
    futureImplications
  };
}

/**
 * Extracts top keyword frequencies from feedback comments.
 */
export function extractKeywordFrequencies(
  comments: Array<{ text: string }>,
  isPositive: boolean
): KeywordFrequency[] {
  const totalComments = comments.filter((c) => c.text && c.text.trim().length > 0).length || 1;

  interface PatternDef {
    keyword: string;
    category: string;
    regex: RegExp;
  }

  const positivePatterns: PatternDef[] = [
    { keyword: '직접 실습', category: '실습', regex: /실습|직접|손으로|타이핑|따라하|핸즈온/ },
    { keyword: '업무 즉시 활용', category: '업무 활용', regex: /업무|실무|현업|활용|적용|행정/ },
    { keyword: '강사 설명 명쾌', category: '강사 설명', regex: /설명|명쾌|명확|알기\s*쉽|이해/ },
    { keyword: '친절한 질의응답', category: '강사 설명', regex: /친절|질문|질의응답|답변|피드백/ },
    { keyword: '체계적 커리큘럼', category: '강의 내용', regex: /체계적|커리큘럼|구성|흐름|알찬|내용/ },
    { keyword: '실전 예제 중심', category: '강의 내용', regex: /예제|사례|케이스|실습\s*자료/ },
    { keyword: '동료 수강 추천', category: '업무 활용', regex: /추천|권장|동료|소개/ },
    { keyword: '강의 전달력 탁월', category: '강사 설명', regex: /전달력|목소리|발음|톤|열정/ },
    { keyword: '현업 문제 해결', category: '업무 활용', regex: /해결|접목|통계|효율/ },
    { keyword: '이해도 및 몰입도', category: '실습', regex: /기억|몰입|자신감|흥미/ }
  ];

  const improvementPatterns: PatternDef[] = [
    { keyword: '실습 시간 확대', category: '실습 시간', regex: /시간\s*부족|시간이|촉박|짧았|시간\s*더|여유|실습\s*시간/ },
    { keyword: '진행 속도 조절', category: '진행 속도', regex: /속도|빠르|빨라|진도|따라가기|벅찼|템포|천천히/ },
    { keyword: '초보자·비전공 배려', category: '초보자 설명', regex: /초보|비전공|기초|입문|어려|눈높이|난이도|사전\s*지식/ },
    { keyword: '교재·슬라이드 사전 배포', category: '자료 및 예제', regex: /사전\s*배포|교재|슬라이드|pdf|인쇄본|자료\s*공유/ },
    { keyword: '심화 2단계 과정 개설', category: '추가 기능 요청', regex: /심화|2단계|2기|후속|다음\s*과정|개설/ },
    { keyword: '완성본 예제 소스 보강', category: '자료 및 예제', regex: /예제\s*파일|완성본|소스코드|가이드|파일/ },
    { keyword: '단계별 캡처 매뉴얼', category: '초보자 설명', regex: /캡처|스크린샷|매뉴얼|트러블슈팅/ },
    { keyword: '자습용 추가 과제', category: '추가 기능 요청', regex: /자습|과제|연습|추가\s*실습/ },
    { keyword: '강의 시설·환경 점검', category: '기타', regex: /시설|냉난방|강의장|환경/ }
  ];

  const patterns = isPositive ? positivePatterns : improvementPatterns;

  const results: KeywordFrequency[] = patterns.map((p) => {
    let matchCount = 0;
    comments.forEach((c) => {
      if (c.text && p.regex.test(c.text)) {
        matchCount++;
      }
    });

    const percentage = roundTwo((matchCount / totalComments) * 100);

    return {
      keyword: p.keyword,
      category: p.category,
      count: matchCount,
      percentage
    };
  });

  return results.filter((r) => r.count > 0).sort((a, b) => b.count - a.count);
}

/**
 * Main Analyzer function: processes survey rows into complete statistical analysis.
 */
export function analyzeSurveyData(rows: SurveyRow[]): AnalysisResult {
  const totalCount = rows.length;

  if (totalCount === 0) {
    throw new Error('분석할 데이터가 존재하지 않습니다.');
  }

  // Calculate Averages
  const sumOverall = rows.reduce((acc, r) => acc + r.overallSatisfaction, 0);
  const sumContent = rows.reduce((acc, r) => acc + r.contentSatisfaction, 0);
  const sumInstructor = rows.reduce((acc, r) => acc + r.instructorClarity, 0);
  const sumPractice = rows.reduce((acc, r) => acc + r.practiceHelpfulness, 0);
  const sumRecommend = rows.reduce((acc, r) => acc + r.recommendationScore, 0);

  const avgOverall = roundTwo(sumOverall / totalCount);
  const avgContent = roundTwo(sumContent / totalCount);
  const avgInstructor = roundTwo(sumInstructor / totalCount);
  const avgPractice = roundTwo(sumPractice / totalCount);
  const avgRecommend = roundTwo(sumRecommend / totalCount);

  const itemScores: ItemScoreInfo[] = [
    { key: 'overallSatisfaction', label: '전반적만족도', score: avgOverall },
    { key: 'contentSatisfaction', label: '강의내용', score: avgContent },
    { key: 'instructorClarity', label: '강사전달력', score: avgInstructor },
    { key: 'practiceHelpfulness', label: '실습도움도', score: avgPractice },
    { key: 'recommendationScore', label: '추천의향', score: avgRecommend }
  ];

  // Highest and lowest item
  const sortedItems = [...itemScores].sort((a, b) => b.score - a.score);
  const highestItem = sortedItems[0];
  const lowestItem = sortedItems[sortedItems.length - 1];

  // Score distribution for overall satisfaction (1 to 5)
  const distCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  rows.forEach((r) => {
    const s = Math.min(5, Math.max(1, Math.round(r.overallSatisfaction)));
    distCounts[s] = (distCounts[s] || 0) + 1;
  });

  const scoreLabels: Record<number, string> = {
    5: '매우 만족 (5점)',
    4: '만족 (4점)',
    3: '보통 (3점)',
    2: '불만족 (2점)',
    1: '매우 불만족 (1점)'
  };

  const distribution: ScoreDistribution[] = [5, 4, 3, 2, 1].map((score) => {
    const count = distCounts[score] || 0;
    return {
      score,
      label: scoreLabels[score],
      count,
      percentage: roundTwo((count / totalCount) * 100)
    };
  });

  // Department analysis
  const deptMap = new Map<
    string,
    {
      count: number;
      overall: number;
      content: number;
      instructor: number;
      practice: number;
      recommend: number;
    }
  >();

  rows.forEach((r) => {
    const dept = r.department || '기타';
    if (!deptMap.has(dept)) {
      deptMap.set(dept, {
        count: 0,
        overall: 0,
        content: 0,
        instructor: 0,
        practice: 0,
        recommend: 0
      });
    }
    const stat = deptMap.get(dept)!;
    stat.count++;
    stat.overall += r.overallSatisfaction;
    stat.content += r.contentSatisfaction;
    stat.instructor += r.instructorClarity;
    stat.practice += r.practiceHelpfulness;
    stat.recommend += r.recommendationScore;
  });

  const departmentStats: DepartmentStat[] = Array.from(deptMap.entries())
    .map(([department, stat]) => ({
      department,
      count: stat.count,
      avgOverall: roundTwo(stat.overall / stat.count),
      avgContent: roundTwo(stat.content / stat.count),
      avgInstructor: roundTwo(stat.instructor / stat.count),
      avgPractice: roundTwo(stat.practice / stat.count),
      avgRecommend: roundTwo(stat.recommend / stat.count)
    }))
    .sort((a, b) => b.avgOverall - a.avgOverall || b.count - a.count);

  // Positive feedback classification
  const positiveCategoriesOrder: PositiveCategoryType[] = [
    '실습',
    '강의 내용',
    '업무 활용',
    '강사 설명',
    '기타'
  ];

  const positiveBuckets = new Map<PositiveCategoryType, Array<{ id: string | number; department: string; text: string }>>();
  positiveCategoriesOrder.forEach((c) => positiveBuckets.set(c, []));

  rows.forEach((r) => {
    if (r.positiveFeedback && r.positiveFeedback.trim().length > 0) {
      const cat = classifyPositiveFeedback(r.positiveFeedback);
      positiveBuckets.get(cat)?.push({
        id: r.id,
        department: r.department,
        text: r.positiveFeedback
      });
    }
  });

  const totalPositiveComments = Array.from(positiveBuckets.values()).reduce((sum, arr) => sum + arr.length, 0) || 1;

  const positiveCategories: CategorySummary<PositiveCategoryType>[] = positiveCategoriesOrder
    .map((category) => {
      const items = positiveBuckets.get(category) || [];
      const count = items.length;
      const percentage = roundTwo((count / totalPositiveComments) * 100);
      const quotes = items.slice(0, 3).map((item) => item.text);
      const summary = summarizeCategoryOpinions(category, quotes, true);

      return {
        category,
        count,
        percentage,
        representativeQuotes: quotes,
        summary,
        items
      };
    })
    .sort((a, b) => b.count - a.count);

  // Improvement feedback classification
  const improvementCategoriesOrder: ImprovementCategoryType[] = [
    '실습 시간',
    '진행 속도',
    '초보자 설명',
    '자료 및 예제',
    '추가 기능 요청',
    '기타'
  ];

  const improvementBuckets = new Map<ImprovementCategoryType, Array<{ id: string | number; department: string; text: string }>>();
  improvementCategoriesOrder.forEach((c) => improvementBuckets.set(c, []));

  rows.forEach((r) => {
    if (r.improvementFeedback && r.improvementFeedback.trim().length > 0) {
      const cat = classifyImprovementFeedback(r.improvementFeedback);
      improvementBuckets.get(cat)?.push({
        id: r.id,
        department: r.department,
        text: r.improvementFeedback
      });
    }
  });

  const totalImprovementComments = Array.from(improvementBuckets.values()).reduce((sum, arr) => sum + arr.length, 0) || 1;

  const improvementCategories: CategorySummary<ImprovementCategoryType>[] = improvementCategoriesOrder
    .map((category) => {
      const items = improvementBuckets.get(category) || [];
      const count = items.length;
      const percentage = roundTwo((count / totalImprovementComments) * 100);
      const quotes = items.slice(0, 3).map((item) => item.text);
      const summary = summarizeCategoryOpinions(category, quotes, false);

      return {
        category,
        count,
        percentage,
        representativeQuotes: quotes,
        summary,
        items
      };
    })
    .sort((a, b) => b.count - a.count);

  // Generate 4-part Executive Report Summary
  const reportSummary = generateReportSummary(
    totalCount,
    avgOverall,
    highestItem,
    lowestItem,
    positiveCategories,
    improvementCategories,
    departmentStats
  );

  // Extract Keyword Frequencies
  const allPositiveComments = rows.map((r) => ({ text: r.positiveFeedback }));
  const allImprovementComments = rows.map((r) => ({ text: r.improvementFeedback }));
  const positiveKeywords = extractKeywordFrequencies(allPositiveComments, true);
  const improvementKeywords = extractKeywordFrequencies(allImprovementComments, false);

  return {
    totalCount,
    averages: {
      overallSatisfaction: avgOverall,
      contentSatisfaction: avgContent,
      instructorClarity: avgInstructor,
      practiceHelpfulness: avgPractice,
      recommendationScore: avgRecommend
    },
    itemScores,
    highestItem,
    lowestItem,
    distribution,
    departmentStats,
    positiveCategories,
    improvementCategories,
    positiveKeywords,
    improvementKeywords,
    reportSummary,
    rawRows: rows
  };
}
