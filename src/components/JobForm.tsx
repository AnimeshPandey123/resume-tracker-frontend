
// import { useState } from 'react';
import { useState, useEffect } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobApplication, Resume } from '@/interfaces/types';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { v4 as uuidv4 } from 'uuid';
import { API_URL } from '@/constants';

interface JobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: JobApplication;
  onSave: (job: JobApplication) => void;
  resumes: Resume[];
}



const emptyJob: JobApplication = {
  id: '',
  company: '',
  position: '',
  status: 'applied',
  date_applied: '',
  resume_id: '',
  description: '',
  notes: '',
  link: '',
};

const JobForm = ({ open, onOpenChange, initialData, onSave, resumes }: JobFormProps) => {
  const [job, setJob] = useState<JobApplication>(initialData || {
    ...emptyJob,
    date_applied: new Date().toISOString().split('T')[0]
  });

  const token = localStorage.getItem('token');



    useEffect(() => {
      if (initialData) {
        // When initialData changes, update state with a guarantee that arrays exist
        setJob({
          ...initialData,
        });
        
        // For debugging
        console.log('Resume state updated from initialData:', initialData);
      }
    }, [initialData]);

  const handleSave = async () => {
    // Validate required fields
    console.log(job)

    if (!job.company.trim()) {
      toast.error('Please add a company name');
      return;
    }
    
    if (!job.position.trim()) {
      toast.error('Please add a position');
      return;
    }
    
    if (!job.resume_id && resumes.length > 0) {
      toast.error('Please select a resume');
      return;
    }

    if (job.id){
      const url = `${API_URL}/api/jobs/${job.id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(job),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update resume: ${response.statusText}`);
      }
    }else{
      const url = `${API_URL}/api/jobs`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(job),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update resume: ${response.statusText}`);
      }
    }

   
    

    
    onSave(job);
    onOpenChange(false);
    toast.success(initialData ? 'Job application updated' : 'Job application created');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
    console.log(job)
  };

  const handleSelectChange = (field: keyof JobApplication, value: string) => {
    setJob({ ...job, [field]: value });
  };
  
  // Set default resume if only one exists and no resume selected
  if (resumes.length === 1 && !job.resume_id) {
    setJob({ ...job, resume_id: resumes[0].id });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b sticky top-0 bg-white/80 backdrop-blur-md">
          <DialogTitle>
            {initialData ? 'Edit Job Application' : 'Add Job Application'}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(80vh-138px)] p-6 custom-scrollbar">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={job.company}
                onChange={handleInputChange}
                placeholder="e.g., Google Inc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                value={job.position}
                onChange={handleInputChange}
                placeholder="e.g., Senior Front-end Developer"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Application Status</Label>
                <Select
                  value={job.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applying">Applying</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                    <SelectItem value="offered">Offered</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date_applied">Date Applied</Label>
                <Input
                  id="date_applied"
                  name="date_applied"
                  type="date"
                  value={job.date_applied}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resume_id">Resume</Label>
              {resumes.length > 0 ? (
                <Select
                  value={job.resume_id}
                  onValueChange={(value) => handleSelectChange('resume_id', value)}
                >
                  <SelectTrigger id="resume_id">
                    <SelectValue placeholder="Select a resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes.map((resume) => (
                      <SelectItem key={resume.id} value={resume.id}>
                        {resume.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-muted-foreground">
                  <p className="p-2 border rounded-md">
                    No resumes available. Please create a resume first.
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="link">Job Posting URL</Label>
              <Input
                id="link"
                name="link"
                value={job.link}
                onChange={handleInputChange}
                placeholder="e.g., https://careers.google.com/jobs/12345"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                name="description"
                value={job.description}
                onChange={handleInputChange}
                placeholder="Paste the job description here"
                className="min-h-[120px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Personal Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={job.notes}
                onChange={handleInputChange}
                placeholder="Add any notes or reminders about this application"
                className="min-h-[120px]"
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t sticky bottom-0 bg-white/80 backdrop-blur-md">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {initialData ? 'Save Changes' : 'Add Job Application'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobForm;
