import { LucideIcon } from 'lucide-react';

interface HealthCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  unit: string;
  trend?: 'up' | 'down' | 'neutral';
  color: 'primary' | 'accent' | 'secondary';
}

export const HealthCard = ({ icon: Icon, title, value, unit, color }: HealthCardProps) => {
  const colorClasses = {
    primary: 'from-primary/10 to-primary/5 text-primary',
    accent: 'from-accent/10 to-accent/5 text-accent',
    secondary: 'from-secondary/20 to-secondary/10 text-primary'
  };

  return (
    <div className="card-elegant p-6 hover:shadow-[0_8px_32px_-4px_hsl(var(--primary)/0.12)] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[2]}`} />
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
};
