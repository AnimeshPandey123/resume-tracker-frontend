
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AnimatedWrapper from './AnimatedWrapper';

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const EmptyState = ({
  title,
  description,
  buttonText,
  icon,
  onClick
}: EmptyStateProps) => {
  return (
    <AnimatedWrapper 
      className="flex flex-col items-center justify-center h-[60vh] px-4 text-center"
      delay={100}
    >
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-2xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      <Button onClick={onClick} className="rounded-full gap-2 transition-all">
        <Plus className="h-4 w-4" />
        {buttonText}
      </Button>
    </AnimatedWrapper>
  );
};

export default EmptyState;
