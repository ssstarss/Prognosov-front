import avatarToDataUrl from '../../functions/avatarToDataUrl';
import {
  competitionAvatarUrl,
  teamAvatarUrl,
  userAvatarUrl,
} from '../../functions/avatarUrl';

interface AvatarCircleProps {
  avatar?: unknown;
  userId?: number;
  teamId?: number;
  competitionId?: number;
  alt?: string;
  className?: string;
  placeholderClassName?: string;
  placeholderText?: string;
}

function resolveImageSrc(props: AvatarCircleProps): string | null {
  if (props.userId != null && props.userId > 0) {
    return userAvatarUrl(props.userId);
  }
  if (props.teamId != null && props.teamId > 0) {
    return teamAvatarUrl(props.teamId);
  }
  if (props.competitionId != null && props.competitionId > 0) {
    return competitionAvatarUrl(props.competitionId);
  }
  return avatarToDataUrl(props.avatar);
}

export default function AvatarCircle({
  avatar,
  userId,
  teamId,
  competitionId,
  alt = 'User avatar',
  className = '',
  placeholderClassName = '',
  placeholderText = '?',
}: AvatarCircleProps) {
  const src = resolveImageSrc({ avatar, userId, teamId, competitionId });
  const avatarClass = `avatarCircle ${className}`.trim();
  const fallbackClass = `avatarCircle avatarCirclePlaceholder ${className} ${placeholderClassName}`.trim();

  if (src) {
    return <img className={avatarClass} src={src} alt={alt} />;
  }

  return <div className={fallbackClass}>{placeholderText}</div>;
}
