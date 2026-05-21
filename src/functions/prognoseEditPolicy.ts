import { appState } from '../constants';

/**
 * Временно: admin / superadmin может открывать и менять прогнозы без учёта дедлайна
 * (и на главной таблице — чужие ячейки). Убрать/сузить, когда бэкенд начнёт сам валидировать.
 */
export function isPrognoseDeadlineBypassRole(): boolean {
  const r = appState.userRole;
  return r === 'admin' || r === 'superadmin';
}

/** До начала матча ещё можно вносить/менять прогноз (с учётом deadlineMinutes). */
export function isGameBeforePrognoseDeadline(startsAt: Date | string | null | undefined): boolean {
  if (startsAt == null) return false;
  const startMs = new Date(startsAt).getTime();
  if (!Number.isFinite(startMs)) return false;
  const deadlineMs = Date.now() + appState.deadlineMinutes * 60 * 1000;
  return startMs > deadlineMs;
}

/** Игра доступна для редактирования прогноза (дедлайн или роль admin). */
export function isGamePrognoseEditable(startsAt: Date | string | null | undefined): boolean {
  return isPrognoseDeadlineBypassRole() || isGameBeforePrognoseDeadline(startsAt);
}
