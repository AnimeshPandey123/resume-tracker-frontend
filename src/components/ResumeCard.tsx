
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Copy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Resume } from '@/interfaces/types';
import AnimatedWrapper from './AnimatedWrapper';

interface ResumeCardProps {
  resume: Resume;
  onEdit: (resume: Resume) => void;
  onDelete: (id: string) => void;
  onDuplicate: (resume: Resume) => void;
  index: number;
}

const ResumeCard = ({ 
  resume, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  index 
}: ResumeCardProps) => {
  return (
    <AnimatedWrapper delay={index * 50} className="h-full">
      <Card className="glass h-full overflow-hidden border transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center gap-2 text-lg">
            <span className="truncate">{resume.title}</span>
            {/* <div className="flex-shrink-0 inline-flex h-5 items-center rounded-full border px-2 text-xs font-medium">
              {resume.experience && resume.experience.length} exp
            </div> */}
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
            {formatDistanceToNow(new Date(resume.updated_at), { addSuffix: true })}
          </p>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={() => onDuplicate(resume)}
            >
              <Copy className="h-3.5 w-3.5" />
              <span className="sr-only">Duplicate</span>
            </Button>
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
  