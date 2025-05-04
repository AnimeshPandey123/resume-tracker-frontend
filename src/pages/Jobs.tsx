import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase, FileText } from 'lucide-react';
import { JobApplication, Resume } from '@/interfaces/types';
import JobCard from '@/components/JobCard';
import JobForm from '@/components/JobForm';
import EmptyState from '@/components/EmptyState';
import Header from '@/components/Header';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { resumesFetch, jobsFetch } from '@/lib/fetch';
import { API_URL } from '@/constants';

const Jobs = () => {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const token = localStorage.getItem('token');



  const handleCreateJob = () => {
    setEditingJob(undefined);
    setIsFormOpen(true);
  };



  const resumeSetter = async (): Promise<void> => {
    try{
      const resumes = await resumesFetch();
      setResumes(resumes)
    }catch (error){

    }
  }

  const jobsSetter = async (): Promise<void> => {
    try{
      const jobs = await jobsFetch();
      setJobs(jobs)
    }catch (error){

    }
  }

  useEffect(() => {
    resumeSetter();
    jobsSetter();
  }, []);

  const handleEditJob = (job: JobApplication) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleDeleteJob = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id));
    toast.success('Job application deleted');
  };

  const handleSaveJob = (job: JobApplication) => {
    if (editingJob) {
      // Update existing job
      setJobs(jobs.map(j => j.id === job.id ? job : j));
    } else {
      // Add new job
      setJobs([...jobs, job]);
    }
  };

  const filteredJobs = statusFilter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === statusFilter);

  const getResumeById = (resumeId: string) => {
    return resumes.find(resume => resume.id === resumeId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
          <AnimatedWrapper className="flex-1">
            <h2 className="text-3xl font-medium">Job Applications</h2>
            <p className="text-muted-foreground mt-1">
              Track and manage your job applications
            </p>
          </AnimatedWrapper>
          
          <div className="flex flex-col md:flex-row gap-4">
            <AnimatedWrapper delay={100} className="min-w-[200px]">
              <div className="space-y-2">
                <Label htmlFor="status-filter" className="text-sm">Filter by Status</Label>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger id="status-filter" data-testid="status-filter-trigger">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Applications</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                    <SelectItem value="offered">Offered</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AnimatedWrapper>
            
            <AnimatedWrapper delay={150} className="self-end">
              <Button 
                onClick={handleCreateJob} 
                className="rounded-full gap-2"
                disabled={resumes.length === 0}
              >
                <Plus className="h-4 w-4" />
                New Application
              </Button>
            </AnimatedWrapper>
          </div>
        </div>

        {resumes.length === 0 ? (
          <EmptyState
            title="Create a resume first"
            description="You need to create at least one resume before tracking job applications"
            buttonText="Create Resume"
            icon={<FileText className="h-6 w-6" />}
            onClick={() => window.location.href = '/'}
          />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="No job applications yet"
            description="Start tracking your job applications"
            buttonText="Add Job Application"
            icon={<Briefcase className="h-6 w-6" />}
            onClick={handleCreateJob}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                resume={getResumeById(job.resume_id)}
                onEdit={handleEditJob}
                onDelete={handleDeleteJob}
                index={index}
              />
            ))}
            
            {filteredJobs.length === 0 && (
              <div className="col-span-3 py-12 text-center">
                <h3 className="text-lg font-medium mb-2">No applications found</h3>
                <p className="text-muted-foreground mb-4">
                  No job applications with status "{statusFilter}" found.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setStatusFilter('all')}
                  className="rounded-full"
                >
                  View All Applications
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
      
      <JobForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingJob}
        onSave={handleSaveJob}
        resumes={resumes}
      />
    </div>
  );
};

export default Jobs;
