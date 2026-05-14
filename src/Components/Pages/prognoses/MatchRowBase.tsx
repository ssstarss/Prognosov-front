import './gameLine.scss';
import { formatDateString, formatTimeString } from '../../../functions/formatDate';
import AvatarCircle from '../../common/AvatarCircle';

type MatchRowBaseProps = {
  startsAt: Date | string;
  team1Name?: string;
  team2Name?: string;
  team1Avatar?: unknown;
  team2Avatar?: unknown;
  team1Score?: number;
  team2Score?: number;
  extraRight?: React.ReactNode;
  className?: string;
  as?: 'li' | 'div';
  onClick?: () => void;
};

export default function MatchRowBase({
  startsAt,
  team1Name,
  team2Name,
  team1Avatar,
  team2Avatar,
  team1Score,
  team2Score,
  extraRight,
  className = '',
  as = 'div',
  onClick,
}: MatchRowBaseProps) {
  const WrapperTag = as;
  const startDate = new Date(startsAt);

  return (
    <WrapperTag className={`prognoses__prognose_wrapper ${className}`.trim()} onClick={onClick}>
      <div className="prognose__date-wrapper">
        <div className="prognoses__date">{formatDateString(startDate, true)}</div>
        <div className="prognoses__time">{formatTimeString(startDate)}</div>
      </div>

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
          <span className="prognoses__team-score">{team1Score ?? '-'}</span>
          <span className="prognoses__separator">:</span>
          <span className="prognoses__team-score">{team2Score ?? '-'}</span>
        </div>

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
      {extraRight}
    </WrapperTag>
  );
}
