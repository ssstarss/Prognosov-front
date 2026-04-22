import { appState } from '../constants';

/**
 * Временно: admin / superadmin может открывать и менять прогнозы без учёта дедлайна
 * (и на главной таблице — чужие ячейки). Убрать/сузить, когда бэкенд начнёт сам валидировать.
 */
export function isPrognoseDeadlineBypassRole(): boolean {
  const r = appState.userRole;
  return r === 'admin' || r === 'superadmin';
}
