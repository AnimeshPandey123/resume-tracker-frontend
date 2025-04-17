import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, ExternalLink, BarChart3, Loader2 } from 'lucide-react';
import { JobApplication, Resume } from '@/types';
import AnimatedWrapper from './AnimatedWrapper';
import { cn } from '@/lib/utils';
import ResumeAnalysisModal from './ResumeAnalysisModal';

interface JobCardProps {
  job: JobApplication;
  resume: Resume;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
  index: number;
}
const API_URL = import.meta.env.VITE_API_URL;

const JobCard = ({ 
  job, 
  resume, 
  onEdit, 
  onDelete, 
  index 
}: JobCardProps) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resume) return;
    setLoading(true);
    try {
      const url = `${API_URL}/api/analyze-resume`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_id: resume.id,
          job_application_id: job.id,
        }),
      });
      const data = await res.json();
      setAnalysis(data);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (status: string) => {
    switch(status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'interviewing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'offered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <AnimatedWrapper delay={index * 50} className="h-full">
      <Card className="glass h-full overflow-hidden border transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span className="truncate">{job.position}</span>
            <Badge className={cn("font-normal", getStatusStyles(job.status))}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm truncate">{job.company}</p>
            {resume && (
              <p className="text-xs text-muted-foreground truncate">
                Using: {resume.title}
              </p>
            )}
            <div className="mt-2 line-clamp-2 text-xs text-muted-foreground">
              {job.description}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2 border-t bg-secondary/20">
          <p className="text-xs text-muted-foreground">
            Applied {job.dateApplied}
          </p>
          <div className="flex space-x-1">
            {job.link && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={() => window.open(job.link, '_blank')}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="sr-only">View Job</span>
              </Button>
            )}
            {resume && (
             <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <BarChart3 className="h-3.5 w-3.5" />
              )}
              <span className="sr-only">Analyze Resume</span>
           </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={() => onEdit(job)}
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              onClick={() => onDelete(job.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Resume Analysis Modal */}
      <ResumeAnalysisModal
        open={showAnalysis}
        onClose={() => setShowAnalysis(false)}
        analysis={analysis}
      />
    </AnimatedWrapper>
  );
};

export default JobCard;
