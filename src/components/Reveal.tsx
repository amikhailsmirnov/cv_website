import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

type Tag = 'div' | 'span' | 'li' | 'h2' | 'p';

interface RevealProps {
  children: ReactNode;
  /** Seconds to delay the animation — use for staggering siblings. */
  delay?: number;
  className?: string;
  as?: Tag;
  /** Render inline-block (for word-block reveals inside a headline). */
  inline?: boolean;
}

// Shared reveal-on-scroll primitive. Mirrors the hero's entrance easing:
// fade up from 28px with an 8px blur over 1.1s, triggered once at ~30% in view.
export default function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
  inline = false,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  // motion[tag] is correctly typed per-tag; the union makes a precise type
  // intractable here, so widen to a component that accepts the motion props.
  const Comp = motion[as] as React.ComponentType<{
    className?: string;
    style?: CSSProperties;
    initial?: object;
    whileInView?: object;
    viewport?: object;
    transition?: object;
    children?: ReactNode;
  }>;

  return (
    <Comp
      className={className}
      style={
        inline
          ? { display: 'inline-block', willChange: 'transform, filter, opacity' }
          : undefined
      }
      initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </Comp>
  );
}
