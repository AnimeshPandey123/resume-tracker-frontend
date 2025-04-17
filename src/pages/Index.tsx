
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { Resume } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import ResumeCard from '@/components/ResumeCard';
import ResumeForm from '@/components/ResumeForm';
import EmptyState from '@/components/EmptyState';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { resumesFetch } from '@/lib/fetch';
import { JobApplication } from '@/interfaces/types';

const Index = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | undefined>(undefined);
  const API_URL = import.meta.env.VITE_API_URL;

  const resumeSetter = async (): Promise<void> => {
    try{
      const resumes = await resumesFetch()
      setResumes(resumes)
    }catch (error){

    }
  }
  

  useEffect(() => {
    resumeSetter();
  }, []);

  const handleCreateResume = () => {
    setEditingResume(undefined);
    setIsFormOpen(true);
  };

  const handleEditResume = (resume: Resume) => {
    setEditingResume(resume);
    setIsFormOpen(true);
  };

  const resumeDelete = async (id: string): Promise<void> => {
    const url = `${API_URL}/api/resumes/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update resume: ${response.statusText}`);
      }
  }

  const handleDeleteResume = async (id: string) => {
    // setResumes(resumes.filter(resume => resume.id !== id));
    await resumeDelete(id)
    resumeSetter()
    toast.success('Resume deleted');
  };

  const handleDuplicateResume = (resume: Resume) => {
    const newResume: Resume = {
      ...resume,
      id: '',
      title: `${resume.title} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setResumes([...resumes, newResume]);
    toast.success('Resume duplicated');
  };

  const handleSaveResume = (resume: Resume) => {
    if (editingResume && resumes) {
      // Update existing resume
      setResumes(resumes.map(r => r.id === resume.id ? resume : r));
    } else {
      // Add new resume
      setResumes([...resumes, resume]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <AnimatedWrapper className="flex-1">
          <h2 className="text-3xl font-medium">Your Resumes</h2>
          <p className="text-muted-foreground mt-1">
            Create and manage your professional resumes
          </p>
        </AnimatedWrapper>
        
        <AnimatedWrapper delay={100}>
          <Button onClick={handleCreateResume} className="rounded-full gap-2">
            <Plus className="h-4 w-4" />
            New Resume
          </Button>
        </AnimatedWrapper>
      </div>

      {resumes.length === 0 ? (
        <EmptyState
          title="No resumes yet"
          description="Create your first resume to get started"
          buttonText="Create Resume"
          icon={<FileText className="h-6 w-6" />}
          onClick={handleCreateResume}
        />
      ) : (
        <>
          <AnimatedWrapper delay={150} className="mb-6">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>Resume Builder</AlertTitle>
              <AlertDescription>
                Create multiple resumes for different job types.
              </AlertDescription>
            </Alert>
          </AnimatedWrapper>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes && resumes.map((resume, index) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onEdit={handleEditResume}
                onDelete={handleDeleteResume}
                onDuplicate={handleDuplicateResume}
                index={index}
              />
            ))}
          </div>
        </>
      )}
      
      <ResumeForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingResume}
        onSave={handleSaveResume}
      />
    </div>
  );
};

export default Index;
