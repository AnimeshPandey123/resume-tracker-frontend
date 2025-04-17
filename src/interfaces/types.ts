export type Education = {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  description: string;
};

export type Experience = {
  id: string;
  company: string;
  title: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
};

export type Skill = {
  id: string;
  name: string;
  proficiency: string; 
};

export type Resume = {
  id: string;
  title: string;
  summary: string; 
  education: Education[];
  experiences: Experience[];
  skills: Skill[];
  created_at: string; 
  updated_at: string; 
};

export type JobApplication = {
  id: string;
  company: string;
  position: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected';
  date_applied: string;
  resume_id: string;
  description: string;
  notes: string;
  link: string;
};
