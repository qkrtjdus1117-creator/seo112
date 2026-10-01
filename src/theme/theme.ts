export type ThemeKey = 'navy' | 'slate' | 'teal' | 'indigo' | 'royal';

export interface ThemeConfig {
  id: ThemeKey;
  name: string;
  badge: string;
  dotColor: string;
  primaryBg: string;
  primaryHoverBg: string;
  primaryActiveBg: string;
  primaryText: string;
  primaryBorder: string;
  primaryRing: string;
  accentBgLight: string;
  accentTextDark: string;
  barColor: string;
  gradientFrom: string;
  gradientTo: string;
}

export const THEMES: Record<ThemeKey, ThemeConfig> = {
  navy: {
    id: 'navy',
    name: '정부 표준 네이비',
    badge: '대한민국 공공표준',
    dotColor: '#1e3a8a',
    primaryBg: 'bg-blue-900',
    primaryHoverBg: 'hover:bg-blue-950',
    primaryActiveBg: 'active:bg-slate-900',
    primaryText: 'text-blue-900',
    primaryBorder: 'border-blue-900',
    primaryRing: 'ring-blue-900',
    accentBgLight: 'bg-blue-50',
    accentTextDark: 'text-blue-950',
    barColor: 'bg-blue-900',
    gradientFrom: 'from-blue-950',
    gradientTo: 'to-slate-900'
  },
  slate: {
    id: 'slate',
    name: '차분한 슬레이트 그레이',
    badge: '눈이 편한 데이터 테마',
    dotColor: '#334155',
    primaryBg: 'bg-slate-800',
    primaryHoverBg: 'hover:bg-slate-900',
    primaryActiveBg: 'active:bg-slate-950',
    primaryText: 'text-slate-800',
    primaryBorder: 'border-slate-800',
    primaryRing: 'ring-slate-800',
    accentBgLight: 'bg-slate-100',
    accentTextDark: 'text-slate-900',
    barColor: 'bg-slate-700',
    gradientFrom: 'from-slate-900',
    gradientTo: 'to-slate-800'
  },
  teal: {
    id: 'teal',
    name: '스마트 딥 틸',
    badge: '청렴 & 친환경 공공',
    dotColor: '#0f766e',
    primaryBg: 'bg-teal-800',
    primaryHoverBg: 'hover:bg-teal-900',
    primaryActiveBg: 'active:bg-teal-950',
    primaryText: 'text-teal-900',
    primaryBorder: 'border-teal-800',
    primaryRing: 'ring-teal-800',
    accentBgLight: 'bg-teal-50',
    accentTextDark: 'text-teal-950',
    barColor: 'bg-teal-700',
    gradientFrom: 'from-teal-900',
    gradientTo: 'to-slate-900'
  },
  indigo: {
    id: 'indigo',
    name: '품격있는 인디고',
    badge: '학술 & 전문인재개발',
    dotColor: '#3730a3',
    primaryBg: 'bg-indigo-900',
    primaryHoverBg: 'hover:bg-indigo-950',
    primaryActiveBg: 'active:bg-slate-900',
    primaryText: 'text-indigo-900',
    primaryBorder: 'border-indigo-900',
    primaryRing: 'ring-indigo-900',
    accentBgLight: 'bg-indigo-50',
    accentTextDark: 'text-indigo-950',
    barColor: 'bg-indigo-800',
    gradientFrom: 'from-indigo-950',
    gradientTo: 'to-slate-900'
  },
  royal: {
    id: 'royal',
    name: '클래식 로열 블루',
    badge: '모던 비즈니스 블루',
    dotColor: '#2563eb',
    primaryBg: 'bg-blue-700',
    primaryHoverBg: 'hover:bg-blue-800',
    primaryActiveBg: 'active:bg-blue-900',
    primaryText: 'text-blue-800',
    primaryBorder: 'border-blue-700',
    primaryRing: 'ring-blue-700',
    accentBgLight: 'bg-blue-50',
    accentTextDark: 'text-blue-900',
    barColor: 'bg-blue-600',
    gradientFrom: 'from-blue-800',
    gradientTo: 'to-blue-950'
  }
};
