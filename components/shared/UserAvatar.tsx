'use client';

/** Tailwind bg colour classes cycled by name hash for consistent per-user colours. */
const AVATAR_COLOURS = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-pink-500',
];

const SIZE_CLASSES = {
  xs: 'w-5 h-5 text-[10px]',
  sm: 'w-7 h-7 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColour(name: string): string {
  const index =
    name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) %
    AVATAR_COLOURS.length;
  return AVATAR_COLOURS[index];
}

interface UserAvatarProps {
  /** Display name — used for initials and as the img alt text. */
  name: string;
  /** Optional URL for a profile photo. Falls back to initials when absent. */
  src?: string;
  /** Visual size of the avatar. Defaults to "md". */
  size?: keyof typeof SIZE_CLASSES;
}

export default function UserAvatar({ name, src, size = 'md' }: UserAvatarProps) {
  const sizeClass = SIZE_CLASSES[size];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${getColour(name)} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 select-none`}
      title={name}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}
