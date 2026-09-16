'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

/**
 * HealthGhuru IconAction Wrapper
 * -----------------------------------------------------------------------------
 * Wraps every icon used as an interactive element (nav icons, button icons,
 * table row actions, status badges) so each gets a small, deliberate hover
 * animation — varying slightly by context per the three "contexts" below,
 * rather than one identical effect applied everywhere.
 *
 * Three contexts:
 *   "nav"    — sidebar/navbar icons: gentle 4px upward nudge + color shift
 *   "action" — clickable icon buttons (edit/delete/upload/etc): scale + slight rotate
 *   "status" — read-only badges/indicators (plan badge, streak flame): soft pulse only,
 *              NOT clickable, no pointer cursor — signals "informational," not "actionable"
 *
 * Usage — wrap any lucide-react icon used interactively:
 *   <IconAction context="nav"><LayoutDashboard size={18} /></IconAction>
 *   <IconAction context="action" onClick={handleDelete}><Trash2 size={16} /></IconAction>
 *   <IconAction context="status"><Flame size={16} /></IconAction>
 *
 * Colors are inherited from the icon's own `style`/`className` — this wrapper
 * only controls motion, never overrides color, so it works identically across
 * the public site, Free/Pro Vault, and Admin without needing per-surface variants.
 */

type IconContext = 'nav' | 'action' | 'status' | 'decorative';

interface IconActionProps {
  context: IconContext;
  children: React.ReactNode;
  onClick?: () => void;
  label?: string; // for aria-label when used as a standalone icon button
  className?: string;
  disabled?: boolean;
}

const VARIANTS: Record<IconContext, { whileHover: any; whileTap: any; transition: any }> = {
  nav: {
    whileHover: { y: -3, scale: 1.08 },
    whileTap: { scale: 0.94 },
    transition: { type: 'spring', stiffness: 400, damping: 18 },
  },
  action: {
    whileHover: { scale: 1.15, rotate: -6 },
    whileTap: { scale: 0.9, rotate: 0 },
    transition: { type: 'spring', stiffness: 420, damping: 16 },
  },
  status: {
    whileHover: { scale: 1.06 },
    whileTap: {},
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  decorative: {
    whileHover: { scale: 1.15, rotate: -6 },
    whileTap: {},
    transition: { type: 'spring', stiffness: 420, damping: 16 },
  },
};

export const IconAction = forwardRef<HTMLSpanElement, IconActionProps>(
  ({ context, children, onClick, label, className = '', disabled = false }, ref) => {
    const variant = VARIANTS[context];
    const isInteractive = context !== 'status' && context !== 'decorative' && !disabled;

    return (
      <motion.span
        ref={ref}
        role={isInteractive && onClick ? 'button' : undefined}
        tabIndex={isInteractive && onClick ? 0 : undefined}
        aria-label={label}
        aria-disabled={disabled}
        onClick={isInteractive ? onClick : undefined}
        onKeyDown={
          isInteractive && onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        data-cursor={isInteractive ? (context === 'nav' ? 'tab' : 'button') : undefined}
        whileHover={isInteractive ? variant.whileHover : undefined}
        whileTap={isInteractive ? variant.whileTap : undefined}
        transition={variant.transition}
        className={[
          'inline-flex items-center justify-center',
          isInteractive ? '' : 'pointer-events-none select-none',
          disabled ? 'opacity-40' : '',
          className,
        ].join(' ')}
        style={{ display: 'inline-flex' }}
      >
        {children}
      </motion.span>
    );
  }
);

IconAction.displayName = 'IconAction';

/**
 * Convenience wrapper for the extremely common "icon-only button" pattern
 * (table row actions: edit/delete/duplicate). Bundles IconAction context="action"
 * with the underlying lucide icon component so call sites stay one line.
 */
interface IconButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  label: string;
  size?: number;
  color?: string;
  disabled?: boolean;
}

export function IconButton({ icon: Icon, onClick, label, size = 16, color, disabled }: IconButtonProps) {
  return (
    <IconAction context="action" onClick={onClick} label={label} disabled={disabled}>
      <Icon size={size} style={color ? { color } : undefined} />
    </IconAction>
  );
}
