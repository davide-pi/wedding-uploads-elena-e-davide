import { LucideIcon } from 'lucide-react';
import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  title?: string;
}

/**
 * A reusable circular action button with an icon
 * Used for the expandable menu buttons in the mobile FAB
 */
const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  icon: Icon,
  label,
  title
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-12 h-12 rounded-full bg-sage-600 text-white flex items-center justify-center shadow-lg hover:bg-sage-700 transition-all transform hover:scale-105 active:rotate-45 active:scale-95 focus:outline-none"
      title={title || label}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
};

export default ActionButton;
