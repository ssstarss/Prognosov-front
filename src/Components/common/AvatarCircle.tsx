import avatarToDataUrl from '../../functions/avatarToDataUrl';

interface AvatarCircleProps {
  avatar?: unknown;
  alt?: string;
  className?: string;
  placeholderClassName?: string;
  placeholderText?: string;
}

export default function AvatarCircle({
  avatar,
  alt = 'User avatar',
  className = '',
  placeholderClassName = '',
  placeholderText = '?',
}: AvatarCircleProps) {
  const src = avatarToDataUrl(avatar);
  const avatarClass = `avatarCircle ${className}`.trim();
  const fallbackClass = `avatarCircle avatarCirclePlaceholder ${className} ${placeholderClassName}`.trim();

  if (src) {
    return <img className={avatarClass} src={src} alt={alt} />;
  }

  return <div className={fallbackClass}>{placeholderText}</div>;
}
