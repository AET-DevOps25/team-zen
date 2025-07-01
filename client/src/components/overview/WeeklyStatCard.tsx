interface WeeklyStatCardProps {
  title: string;
  value: string;
  progress?: number;
  icon: React.ComponentType<{ className?: string }>;
  gradientClass: string;
  iconColorClass: string;
  progressColorClass?: string;
  subtitle?: string;
  colSpan?: string;
}

const WeeklyStatCard = ({
  title,
  value,
  progress,
  icon: Icon,
  gradientClass,
  iconColorClass,
  progressColorClass,
  subtitle,
  colSpan,
}: WeeklyStatCardProps) => (
  <div className={`${gradientClass} rounded-xl p-4 ${colSpan || ''}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p
          className={`text-2xl font-bold ${iconColorClass.replace('text-', 'text-').replace('-500', '-600')}`}
        >
          {value}
        </p>
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${progressColorClass}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <Icon className={`w-8 h-8 ${iconColorClass}`} />
    </div>
  </div>
);

export default WeeklyStatCard;
