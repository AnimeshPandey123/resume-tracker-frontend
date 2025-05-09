import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Resume } from '@/interfaces/types';
import AnimatedWrapper from './AnimatedWrapper';

interface ResumeCardProps {
  resume: Resume;
  onEdit: (resume: Resume) => void;
  onDelete: (id: string) => void;
  index: number;
}

const ResumeCard = ({ 
  resume, 
  onEdit, 
  onDelete, 
  index 
}: ResumeCardProps) => {
  // Safe date formatting function
  const formatDate = (dateString: string) => {
    try {
      console.log("Date string:", dateString);
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Recently";
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Recently";
    }
  };

  return (
    <AnimatedWrapper delay={index * 50} className="h-full">
      <Card className="glass h-full overflow-hidden border transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center gap-2 text-lg">
            <span className="truncate">{resume.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm truncate">{resume.title}</p>
            <div className="mt-2 line-clamp-2 text-xs text-muted-foreground">
              {resume.summary}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2 border-t bg-secondary/20">
          <p className="text-xs text-muted-foreground">
            {formatDate(resume.updated_at)}
          </p>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={() => onEdit(resume)}
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              onClick={() => onDelete(resume.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </AnimatedWrapper>
  );
};

export default ResumeCard;