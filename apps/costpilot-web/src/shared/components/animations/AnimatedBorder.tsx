interface AnimatedBorderProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedBorder({ children, className }: AnimatedBorderProps) {
  return (
    <div className={`group relative ${className || ""}`}>
      <div className="absolute -inset-px rounded-[inherit] bg-gradient-to-br from-emerald-500/20 via-lime-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute -inset-px rounded-[inherit] bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-500/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      {children}
    </div>
  );
}
