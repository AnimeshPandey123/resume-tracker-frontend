import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Index from '@/pages/Index';
import '@testing-library/jest-dom';
import { toast } from 'sonner';
import { Resume } from '@/interfaces/types';
import ResumeForm from '@/components/ResumeForm';


// Mock dependencies
jest.mock('@/components/ResumeForm', () => ({ 
  open, onOpenChange, initialData, onSave 
}) => (
  <div data-testid="resume-form" data-open={open} data-editing={!!initialData}>
    <button onClick={() => {
      if (initialData) {
        onSave(initialData);
      } else {
        onSave({ 
          id: 'new-id', 
          title: 'New Resume',
          summary: 'Test summary',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          experiences: [],
          education: [],
          skills: []
        });
      }
      onOpenChange(false);
    }}>
      Save Resume
    </button>
  </div>
));

jest.mock('@/components/ResumeCard', () => ({ 
  resume, onEdit, onDelete, onDuplicate, index 
}) => (
  <div data-testid={`resume-card-${resume.id}`} className="resume-card">
    <h3>{resume.title}</h3>
    <div className="actions">
      <button onClick={() => onEdit(resume)} data-testid={`edit-resume-${resume.id}`}>Edit</button>
      <button onClick={() => onDelete(resume.id)} data-testid={`delete-resume-${resume.id}`}>Delete</button>
      <button onClick={() => onDuplicate(resume)} data-testid={`duplicate-resume-${resume.id}`}>Duplicate</button>
    </div>
  </div>
));

jest.mock('@/components/EmptyState', () => ({ 
  title, description, buttonText, icon, onClick 
}) => (
  <div data-testid="empty-state">
    <div>{title}</div>
    <div>{description}</div>
    <button onClick={onClick}>{buttonText}</button>
  </div>
));

jest.mock('@/components/AnimatedWrapper', () => ({ 
  children, delay, className 
}) => (
  <div data-testid="animated-wrapper" data-delay={delay} className={className}>
    {children}
  </div>
));

jest.mock('@/components/ui/alert', () => ({
  Alert: ({ children }) => <div data-testid="alert">{children}</div>,
  AlertTitle: ({ children }) => <div data-testid="alert-title">{children}</div>,
  AlertDescription: ({ children }) => <div data-testid="alert-description">{children}</div>,
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('@/lib/fetch', () => ({
  resumesFetch: jest.fn()
}));

jest.mock('@/constants', () => ({
  API_URL: 'http://localhost:8000'
}));

// Sample resume data for testing
const mockResumes = [
  {
    id: '1',
    title: 'Software Engineer Resume',
    summary: 'Experienced software engineer with React and Node.js expertise',
    created_at: '2025-03-01T12:00:00Z',
    updated_at: '2025-03-05T14:30:00Z',
    experiences: [],
    education: [],
    skills: []
  },
  {
    id: '2',
    title: 'Product Manager Resume',
    summary: 'Product manager with 5 years experience in tech',
    created_at: '2025-02-15T09:45:00Z',
    updated_at: '2025-03-10T16:20:00Z',
    experiences: [],
    education: [],
    skills: []
  }
];

const newResume: Resume = {
  id: '1',
  title: 'Data Scientist Resume',
  summary: 'Data Scientist with 5 years experience in data science',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  experiences: [],
  education: [],
  skills: []
};
const defaultProps = {
  open: true,
  onOpenChange: jest.fn(),
  initialData: undefined,
  onSave: jest.fn(),
};


(global.fetch as jest.Mock) = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        {
            "id": 1,
            "user_id": 1,
            "title": "AI Engineer Resume",
            "summary": "AI developer with expertise in Laravel and Reaco",
            "created_at": "2025-03-06 12:07:04",
            "updated_at": "2025-04-11 13:52:21",
            "experiences": [],
            "education": [],
            "skills": []
        },
    ]),
    })
  );
  
  describe('Index Page', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    
    test('renders empty state when no resumes are available', async () => {
      // Mock resumesFetch to return an empty array
      const { resumesFetch } = require('@/lib/fetch');
      resumesFetch.mockResolvedValue([]);
      
      render(<Index />);
      
      // Check page title and button are rendered
      expect(screen.getByText('Your Resumes')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /new resume/i })).toBeInTheDocument();
      
      // Wait for empty state to appear
      await waitFor(() => {
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
        expect(screen.getByText('No resumes yet')).toBeInTheDocument();
        expect(screen.getByText('Create your first resume to get started')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create Resume' })).toBeInTheDocument();
      });
    });
    
    test('renders resume cards when resumes are available', async () => {
      // Mock resumesFetch to return sample resumes
      const { resumesFetch } = require('@/lib/fetch');
      resumesFetch.mockResolvedValue(mockResumes);
      
      render(<Index />);
      
      // Wait for resumes to load
      await waitFor(() => {
        // Check that the Alert component is rendered
        expect(screen.getByTestId('alert')).toBeInTheDocument();
        expect(screen.getByTestId('alert-title')).toBeInTheDocument();
        expect(screen.getByText('Resume Builder')).toBeInTheDocument();
        
        // Check that resume cards are rendered
        expect(screen.getByTestId(`resume-card-${mockResumes[0].id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`resume-card-${mockResumes[1].id}`)).toBeInTheDocument();
        expect(screen.getByText('Software Engineer Resume')).toBeInTheDocument();
        expect(screen.getByText('Product Manager Resume')).toBeInTheDocument();
      });
    });
    
    test('opens resume form when "New Resume" button is clicked', async () => {
      const { resumesFetch } = require('@/lib/fetch');
      resumesFetch.mockResolvedValue(mockResumes);
      
      render(<Index />);
      
      // Click on "New Resume" button
      fireEvent.click(screen.getByRole('button', { name: /new resume/i }));
      
      // Check that form is opened with no initial data
      await waitFor(() => {
        const resumeForm = screen.getByTestId('resume-form');
        expect(resumeForm).toBeInTheDocument();
        expect(resumeForm.getAttribute('data-open')).toBe('true');
        expect(resumeForm.getAttribute('data-editing')).toBe('false');
      });
    });
    test('opens resume form with data when "Edit" button is clicked', async () => {
        const { resumesFetch } = require('@/lib/fetch');
        resumesFetch.mockResolvedValue(mockResumes);
        
        render(<Index />);
        
        // Wait for resumes to load then click edit button on first resume
        await waitFor(() => {
          fireEvent.click(screen.getByTestId(`edit-resume-${mockResumes[0].id}`));
        });
        
        // Check that form is opened with initial data
        await waitFor(() => {
          const resumeForm = screen.getByTestId('resume-form');
          expect(resumeForm).toBeInTheDocument();
          expect(resumeForm.getAttribute('data-open')).toBe('true');
          expect(resumeForm.getAttribute('data-editing')).toBe('true');
        });
      });
      test('deletes a resume when delete button is clicked', async () => {
          const { resumesFetch } = require('@/lib/fetch');
          resumesFetch.mockResolvedValue([]);
          const mockResumes = [
            {
              id: '1',
              title: 'Software Engineer Resume',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ];
      
          (resumesFetch as jest.Mock).mockResolvedValue(mockResumes);
      
          global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
          }) as jest.Mock;
      
          render(<Index />);
      
          // Wait for resume card to appear
          const deleteBtn = await screen.findByRole('button', { name: /delete/i });
          fireEvent.click(deleteBtn);
      
          await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/resumes/1'), expect.objectContaining({
              method: 'DELETE',
            }));
          });
    });
});
