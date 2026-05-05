import React, { useEffect, useState } from 'react';
import AvatarCircle from './AvatarCircle';

type ScoreState = {
  team1?: number;
  team2?: number;
};

type ScoreEditModalBaseProps = {
  title: string;
  team1Name?: string;
  team2Name?: string;
  team1Avatar?: unknown;
  team2Avatar?: unknown;
  initialScore: ScoreState;
  resetKey?: string | number;
  onSubmit: (score: ScoreState) => void | Promise<void>;
  topContent?: React.ReactNode;
};

export default function ScoreEditModalBase({
  title,
  team1Name,
  team2Name,
  team1Avatar,
  team2Avatar,
  initialScore,
  resetKey,
  onSubmit,
  topContent,
}: ScoreEditModalBaseProps) {
  const [currentScore, setCurrentScore] = useState<ScoreState>(initialScore);

  useEffect(() => {
    setCurrentScore(initialScore);
  }, [initialScore.team1, initialScore.team2, resetKey]);

  const hasTeam1 = typeof currentScore.team1 === 'number' && Number.isFinite(currentScore.team1);
  const hasTeam2 = typeof currentScore.team2 === 'number' && Number.isFinite(currentScore.team2);
  const bothEmpty = !hasTeam1 && !hasTeam2;
  const bothFilled = hasTeam1 && hasTeam2;
  const nonNegative =
    (!hasTeam1 || (currentScore.team1 as number) >= 0) &&
    (!hasTeam2 || (currentScore.team2 as number) >= 0);
  const canSubmit = (bothEmpty || bothFilled) && nonNegative;

  return (
    <div
      className="formWrapper updatePrognoseWrapper"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (canSubmit) void onSubmit(currentScore);
        }
      }}
    >
      <div className="formHeaderWrapper">
        <h2 className="formHeader">{title}</h2>
      </div>
      {topContent}
      <div className="prognoses__prognose_wrapper">
        <div className="prognoses__match-wrapper">
          <div className="prognoses__team-wrapper prognoses__team-wrapper--left">
            <div className="prognoses__team-name">{team1Name}</div>
            <div className="prognoses__team-logo">
              <AvatarCircle
                avatar={team1Avatar}
                alt={team1Name ? `${team1Name} logo` : 'Team logo'}
                className="prognoses__team-logo-circle"
              />
            </div>
          </div>
          <div className="prognoses__score-block">
            <input
              type="number"
              min={0}
              className="prognoseResultInput"
              value={currentScore.team1}
              pattern="^(\\d+$)"
              onChange={(e) => {
                const raw = e.target.value;
                const result = raw === '' ? undefined : Number(raw);
                setCurrentScore({ team1: result, team2: currentScore.team2 });
              }}
            ></input>
          </div>
          <span className="prognoses__separator">:</span>
          <input
            type="number"
            min={0}
            className="prognoseResultInput"
            value={currentScore.team2}
            pattern="^(\\d+$)"
            onChange={(e) => {
              const raw = e.target.value;
              const result = raw === '' ? undefined : Number(raw);
              setCurrentScore({ team1: currentScore.team1, team2: result });
            }}
          ></input>

          <div className="prognoses__team-wrapper prognoses__team-wrapper--right">
            <div className="prognoses__team-logo">
              <AvatarCircle
                avatar={team2Avatar}
                alt={team2Name ? `${team2Name} logo` : 'Team logo'}
                className="prognoses__team-logo-circle"
              />
            </div>
            <div className="prognoses__team-name">{team2Name}</div>
          </div>
        </div>
      </div>
      <button
        className="submitFormButton shortButton"
        onClick={() => void onSubmit(currentScore)}
        disabled={!canSubmit}
      >
        Submit
      </button>
    </div>
  );
}
