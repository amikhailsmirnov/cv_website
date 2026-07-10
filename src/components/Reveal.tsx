import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

type Tag = 'div' | 'span' | 'li' | 'h2' | 'p';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: Tag;
  inline?: boolean;
}

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
      style={inline ? { display: 'inline-block', willChange: 'transform, opacity' } : undefined}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </Comp>
  );
}
