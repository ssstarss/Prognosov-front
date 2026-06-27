import { useMemo } from 'react';
import type { Prognose } from '../../../interfaces/interfaces';
import {
  countPrognosePoints,
  topFrequentPrognoseScores,
} from '../../../functions/playerPrognoseStats';

const POINT_ROWS = [
  { points: 5 as const, className: 'score_orange' },
  { points: 4 as const, className: 'score_aqua' },
  { points: 3 as const, className: 'score_green' },
  { points: 2 as const, className: 'score_blue' },
];

interface PlayerAvatarStatsPanelProps {
  prognoses: Prognose[];
}

export default function PlayerAvatarStatsPanel({ prognoses }: PlayerAvatarStatsPanelProps) {
  const pointCounts = useMemo(() => countPrognosePoints(prognoses), [prognoses]);
  const topScores = useMemo(() => topFrequentPrognoseScores(prognoses, 3), [prognoses]);

  return (
    <div className="playerAvatarStatsPanel" aria-hidden>
      <ul className="playerAvatarStatsPoints">
      <h4 className="playerAvatarStatsTitle"> Угадал:</h4>
        {POINT_ROWS.map(({ points, className }) => (
          <li key={points} className="playerAvatarStatsRow">
            <span className={`score ${className}`}>{points}</span>
            <span className="playerAvatarStatsCount">x{pointCounts[points]}</span>
          </li>
        ))}
      </ul>
      {topScores.length > 0 && (
        <ul className="playerAvatarStatsScores">
          <h4 className="playerAvatarStatsTitle"> Часто ставит:</h4>
          {topScores.map((item) => (
            <li key={item.key} className="playerAvatarStatsScoreRow">
              <span className="playerAvatarStatsScoreLabel">{item.label}</span>
              <span className="playerAvatarStatsScoreCount">× {item.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
