import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Education, Experience, Resume, Skill } from '@/interfaces/types';
import { Plus, Trash2, GraduationCap, Briefcase, Star } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { API_URL } from '@/constants';

interface ResumeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Resume;
  onSave: (resume: Resume) => void;
}


const emptyEducation: Education = {
  id: '',
  institution: '',
  degree: '',
  field_of_study: '',
  start_date: '',
  end_date: '',
  description: ''
};

const emptyExperience: Experience = {
  id: '',
  company: '',
  title: '',
  location: '',
  start_date: '',
  end_date: '',
  description: ''
};

const emptySkill: Skill = {
  id: '',
  name: '',
  proficiency: ''
};

const emptyResume: Resume = {
  id: '',
  title: '',
  summary: '',
  education: [],
  experiences: [],
  skills: [],
  created_at: '',
  updated_at: ''
};

const ResumeForm = ({ open, onOpenChange, initialData, onSave }: ResumeFormProps) => {  
  // Initialize with default values and ensure all arrays exist
  const [resume, setResume] = useState<Resume>({
    ...emptyResume,
    ...(initialData || {}),
  });

  const token = localStorage.getItem('token');
  
  // For debugging
  console.log('resume state initialized:', resume);

  useEffect(() => {
    if (initialData) {
      // When initialData changes, update state with a guarantee that arrays exist
      setResume({
        ...initialData,
      });
      
      // For debugging
      console.log('Resume state updated from initialData:', initialData);
    }
  }, [initialData]);

  const [activeTab, setActiveTab] = useState('personal');

  const handleSave = async () => {
    if (!resume.title.trim()) {
      toast.error('Please add a resume title');
      return;
    }
    
    try {
      if (initialData?.id) {
        const url = `${API_URL}/api/resumes/${initialData.id}`;
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(resume),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update resume: ${response.statusText}`);
        }
      }else{
        const url = `${API_URL}/api/resumes`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(resume),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to create resume: ${response.statusText}`);
        }
      }
      
      onSave(resume);
      onOpenChange(false);
      toast.success(initialData ? 'Resume updated' : 'Resume created');
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResume({ ...resume, [name]: value });
  };

  const addEducation = () => {
    setResume({
      ...resume,
      education: [...(resume.education || []), { ...emptyEducation }]
    });
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updatedEducation = [...(resume.education || [])];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setResume({ ...resume, education: updatedEducation });
  };

  const removeEducation = (index: number) => {
    const updatedEducation = [...(resume.education || [])];
    updatedEducation.splice(index, 1);
    setResume({ ...resume, education: updatedEducation });
  };

  const addExperience = () => {
    setResume({
      ...resume,
      experiences: [...(resume.experiences || []), { ...emptyExperience }]
    });
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updatedExperience = [...(resume.experiences || [])];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setResume({ ...resume, experiences: updatedExperience });
  };

  const removeExperience = (index: number) => {
    const updatedExperience = [...(resume.experiences || [])];
    updatedExperience.splice(index, 1);
    setResume({ ...resume, experiences: updatedExperience });
  };

  const addSkill = () => {
    setResume({
      ...resume,
      skills: [...(resume.skills || []), { ...emptySkill }]
    });
  };

  const updateSkill = (index: number, field: keyof Skill, value: string) => {
    const updatedSkills = [...(resume.skills || [])];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setResume({ ...resume, skills: updatedSkills });
  };

  const removeSkill = (index: number) => {
    const updatedSkills = [...(resume.skills || [])];
    updatedSkills.splice(index, 1);
    setResume({ ...resume, skills: updatedSkills });
  };

  // Ensure we always have arrays for rendering, even if they're somehow lost in the state
  const education = Array.isArray(resume.education) ? resume.education : [];
  const experience = Array.isArray(resume.experiences) ? resume.experiences : [];
  const skills = Array.isArray(resume.skills) ? resume.skills : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] lg:max-w-[900px] h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <DialogTitle>
            {initialData ? 'Edit Resume' : 'Create Resume'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col md:flex-row">
          <div className="md:w-64 p-4 border-r border-b md:border-b-0">
            <TabsList className="flex flex-row md:flex-col h-auto bg-transparent space-x-2 md:space-x-0 md:space-y-1 w-full">
              <TabsTrigger 
                value="personal" 
                className="justify-start data-[state=active]:bg-secondary w-full"
              >
                Personal Info
              </TabsTrigger>
              <TabsTrigger 
                value="education" 
                className="justify-start data-[state=active]:bg-secondary w-full"
              >
                Education
              </TabsTrigger>
              <TabsTrigger 
                value="experience" 
                className="justify-start data-[state=active]:bg-secondary w-full"
              >
                Experience
              </TabsTrigger>
              <TabsTrigger 
                value="skills" 
                className="justify-start data-[state=active]:bg-secondary w-full"
              >
                Skills
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1">
            <ScrollArea className="h-[calc(80vh-138px)] p-6 custom-scrollbar">
              <TabsContent value="personal" className="mt-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Resume Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={resume.title || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., Software Developer Resume"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    value={resume.summary || ''}
                    onChange={handleInputChange}
                    placeholder="Write a short summary of your professional background and goals"
                    className="min-h-[120px]"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="education" className="mt-0">
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={`edu-${index}`} className="p-4 border rounded-lg bg-secondary/20 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium flex items-center">
                          <GraduationCap className="h-4 w-4 mr-2" />
                          {edu.institution || `Education #${index + 1}`}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-destructive"
                          onClick={() => removeEducation(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Education details fields */}
                      <div className="space-y-2">
                        <Label htmlFor={`edu-institution-${index}`}>School/University</Label>
                        <Input
                          id={`edu-institution-${index}`}
                          value={edu.institution || ''}
                          onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                          placeholder="e.g., Stanford University"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`edu-degree-${index}`}>Degree</Label>
                          <Input
                            id={`edu-degree-${index}`}
                            value={edu.degree || ''}
                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            placeholder="e.g., Bachelor of Science"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`edu-field-${index}`}>Field of Study</Label>
                          <Input
                            id={`edu-field-${index}`}
                            value={edu.field_of_study || ''}
                            onChange={(e) => updateEducation(index, 'field_of_study', e.target.value)}
                            placeholder="e.g., Computer Science"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`edu-start-${index}`}>Start Date</Label>
                          <Input
                            id={`edu-start-${index}`}
                            type="date"
                            value={edu.start_date || ''}
                            onChange={(e) => updateEducation(index, 'start_date', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`edu-end-${index}`}>End Date</Label>
                          <Input
                            id={`edu-end-${index}`}
                            type="date"
                            value={edu.end_date || ''}
                            onChange={(e) => updateEducation(index, 'end_date', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`edu-desc-${index}`}>Description</Label>
                        <Textarea
                          id={`edu-desc-${index}`}
                          value={edu.description || ''}
                          onChange={(e) => updateEducation(index, 'description', e.target.value)}
                          placeholder="Describe your studies, achievements, etc."
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    onClick={addEducation} 
                    className="w-full rounded-lg border border-dashed py-6 bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="experience" className="mt-0">
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={`exp-${index}`} className="p-4 border rounded-lg bg-secondary/20 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium flex items-center">
                          <Briefcase className="h-4 w-4 mr-2" />
                          {exp.company || `Experience #${index + 1}`}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-destructive"
                          onClick={() => removeExperience(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`exp-company-${index}`}>Company</Label>
                          <Input
                            id={`exp-company-${index}`}
                            value={exp.company || ''}
                            onChange={(e) => updateExperience(index, 'company', e.target.value)}
                            placeholder="e.g., Google Inc."
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`exp-title-${index}`}>Position</Label>
                          <Input
                            id={`exp-title-${index}`}
                            value={exp.title || ''}
                            onChange={(e) => updateExperience(index, 'title', e.target.value)}
                            placeholder="e.g., Senior Developer"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`exp-location-${index}`}>Location</Label>
                        <Input
                          id={`exp-location-${index}`}
                          value={exp.location || ''}
                          onChange={(e) => updateExperience(index, 'location', e.target.value)}
                          placeholder="e.g., Mountain View, CA"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`exp-start-${index}`}>Start Date</Label>
                          <Input
                            id={`exp-start-${index}`}
                            type="date"
                            value={exp.start_date || ''}
                            onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`exp-end-${index}`}>End Date</Label>
                          <Input
                            id={`exp-end-${index}`}
                            type="date"
                            value={exp.end_date || ''}
                            onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`exp-desc-${index}`}>Description</Label>
                        <Textarea
                          id={`exp-desc-${index}`}
                          value={exp.description || ''}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          placeholder="Describe your responsibilities and achievements"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    onClick={addExperience} 
                    className="w-full rounded-lg border border-dashed py-6 bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="skills" className="mt-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bulk-skills">Add Skills (comma-separated)</Label>
                  <Textarea
                    id="bulk-skills"
                    value={skills.map(s => s.name).join(', ')}
                    onChange={(e) => {
                      const names = e.target.value.split(',').map(n => n.trim()).filter(Boolean);
                      const updated = names.map((n, i) => ({
                        id: `skill-${i}`,
                        name: n,
                        proficiency: 'Expert',
                      }));
                      setResume(prev => ({ ...prev, skills: updated }));
                    }}
                    placeholder="e.g., JavaScript, React, Python, Go, Rust, Docker, GraphQL, etc."
                    className="min-h-[100px]"
                  />

                  <p className="text-sm text-muted-foreground">Separate skills with commas. </p>
                </div>
              </TabsContent>

            </ScrollArea>
          </div>
        </Tabs>

        <DialogFooter className="px-6 py-4 border-t sticky bottom-0 bg-white/80 backdrop-blur-md">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {initialData ? 'Save Changes' : 'Create Resume'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeForm;

