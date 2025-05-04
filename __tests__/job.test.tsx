import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Jobs from '@/pages/Jobs';
import '@testing-library/jest-dom';
import { toast } from 'sonner';
import { within } from '@testing-library/react';



// Mock dependencies
jest.mock('@/components/JobForm', () => ({ 
  open, onOpenChange, initialData, onSave, resumes 
}) => (
  <div data-testid="job-form" data-open={open} data-editing={!!initialData}>
    <button onClick={() => {
      if (initialData) {
        onSave(initialData);
      } else {
        onSave({ 
          id: 'new-id', 
          title: 'New Job Application',
          company: 'Test Company',
          location: 'Remote',
          status: 'applied',
          resume_id: resumes[0]?.id || '',
          notes: 'Test notes',
          url: 'https://example.com/job',
          date_applied: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      onOpenChange(false);
    }}>
      Save Job
    </button>
  </div>
));

jest.mock('@/components/JobCard', () => ({ 
  job, resume, onEdit, onDelete, index 
}) => (
  <div data-testid={`job-card-${job.id}`} className="job-card">
    <h3>{job.title}</h3>
    <p>{job.company}</p>
    <p>Status: {job.status}</p>
    <p>Resume: {resume?.title || 'N/A'}</p>
    <div className="actions">
      <button onClick={() => onEdit(job)} data-testid={`edit-job-${job.id}`}>Edit</button>
      <button onClick={() => onDelete(job.id)} data-testid={`delete-job-${job.id}`}>Delete</button>
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

jest.mock('@/components/Header', () => () => (
  <div data-testid="header">Header</div>
));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }) => (
    <div data-testid="select" data-value={value}>
      <button onClick={() => onValueChange('applied')}>Applied</button>
      <button onClick={() => onValueChange('interviewing')}>Interviewing</button>
      <button onClick={() => onValueChange('offered')}>Offered</button>
      <button onClick={() => onValueChange('rejected')}>Rejected</button>
      <button onClick={() => onValueChange('all')}>All</button>
      {children}
    </div>
  ),
  SelectContent: ({ children }) => <div>{children}</div>,
  SelectItem: ({ children, value }) => <div data-value={value}>{children}</div>,
  SelectTrigger: ({ children }) => <div>{children}</div>,
  SelectValue: ({ placeholder }) => <div>{placeholder}</div>
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('@/lib/fetch', () => ({
  resumesFetch: jest.fn(),
  jobsFetch: jest.fn()

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

// Sample job application data for testing
const mockJobs = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'Tech Corp',
    location: 'Remote',
    status: 'applied',
    resume_id: '1',
    notes: 'Applied through LinkedIn',
    url: 'https://techcorp.com/careers',
    date_applied: '2025-03-10T09:00:00Z',
    created_at: '2025-03-10T09:00:00Z',
    updated_at: '2025-03-10T09:00:00Z'
  },
  {
    id: '2',
    title: 'Senior React Developer',
    company: 'Startup Inc',
    location: 'New York, NY',
    status: 'interviewing',
    resume_id: '1',
    notes: 'First interview scheduled for next week',
    url: 'https://startup.com/jobs',
    date_applied: '2025-03-05T14:30:00Z',
    created_at: '2025-03-05T14:30:00Z',
    updated_at: '2025-03-08T10:15:00Z'
  },
  {
    id: '3',
    title: 'Product Manager',
    company: 'Enterprise Solutions',
    location: 'San Francisco, CA',
    status: 'rejected',
    resume_id: '2',
    notes: 'Rejected after final interview',
    url: 'https://enterprise.com/careers',
    date_applied: '2025-02-20T11:45:00Z',
    created_at: '2025-02-20T11:45:00Z',
    updated_at: '2025-03-15T16:30:00Z'
  }
];

// Mock localStorage
const localStorageMock = (() => {
  let store = { token: 'fake-token' };
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = { token: 'fake-token' }; // Keep the token property
    }),
    removeItem: jest.fn((key) => {
      if (key !== 'token') { // Don't remove the token
        delete store[key];
      }
    })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Jobs Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock global fetch
    global.fetch = jest.fn();
  });

  test('renders empty state when no resumes are available', async () => {
    // Mock resumesFetch to return an empty array
    const { resumesFetch, jobsFetch } = require('@/lib/fetch');
    resumesFetch.mockResolvedValue([]);
    jobsFetch.mockResolvedValue([]);
    
    render(<Jobs />);
    
    // Check page title is rendered
    expect(screen.getByText('Job Applications')).toBeInTheDocument();
    expect(screen.getByText('Track and manage your job applications')).toBeInTheDocument();
    
    // Wait for empty state to appear with message about creating resumes first
    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText('Create a resume first')).toBeInTheDocument();
      expect(screen.getByText('You need to create at least one resume before tracking job applications')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Resume' })).toBeInTheDocument();
    });
  });
  test('renders empty state when resumes exist but no jobs are available', async () => {
    // Mock resumesFetch to return sample resumes
    const { resumesFetch, jobsFetch } = require('@/lib/fetch');
    resumesFetch.mockResolvedValue(mockResumes);
    jobsFetch.mockResolvedValue([]);
    
    render(<Jobs />);
    
    // Wait for empty state to appear with message about no job applications
    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText('No job applications yet')).toBeInTheDocument();
      expect(screen.getByText('Start tracking your job applications')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add Job Application' })).toBeInTheDocument();
    });
  });

  test('renders job cards when jobs are available', async () => {
    // Mock resumesFetch to return sample resumes
    const { resumesFetch, jobsFetch } = require('@/lib/fetch');
    resumesFetch.mockResolvedValue(mockResumes);
    jobsFetch.mockResolvedValue(mockJobs);
    
    render(<Jobs />);
    
    // Wait for jobs to load
    await waitFor(() => {
      // Check that job cards are rendered
      expect(screen.getByTestId(`job-card-${mockJobs[0].id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`job-card-${mockJobs[1].id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`job-card-${mockJobs[2].id}`)).toBeInTheDocument();
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
      expect(screen.getByText('Senior React Developer')).toBeInTheDocument();
      expect(screen.getByText('Product Manager')).toBeInTheDocument();
    });
  });

  test('opens job form when "New Application" button is clicked', async () => {
    // Mock resumesFetch to return sample resumes
    const { resumesFetch, jobsFetch } = require('@/lib/fetch');
    resumesFetch.mockResolvedValue(mockResumes);
    jobsFetch.mockResolvedValue(mockJobs);
    
    render(<Jobs />);
    
    // Wait for jobs to load then click "New Application" button
    await waitFor(() => {
      expect(screen.getByText('New Application')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('New Application'));
    
    // Check that form is opened with no initial data
    await waitFor(() => {
      const jobForm = screen.getByTestId('job-form');
      expect(jobForm).toBeInTheDocument();
      expect(jobForm.getAttribute('data-open')).toBe('true');
      expect(jobForm.getAttribute('data-editing')).toBe('false');
    });
  });

  test('opens job form with data when "Edit" button is clicked', async () => {
    // Mock resumesFetch to return sample resumes
    const { resumesFetch, jobsFetch } = require('@/lib/fetch');
    resumesFetch.mockResolvedValue(mockResumes);
    jobsFetch.mockResolvedValue(mockJobs);
    
    render(<Jobs />);
    
    // Wait for jobs to load then click edit button on first job
    await waitFor(() => {
      fireEvent.click(screen.getByTestId(`edit-job-${mockJobs[0].id}`));
    });
    
    // Check that form is opened with initial data
    await waitFor(() => {
      const jobForm = screen.getByTestId('job-form');
      expect(jobForm).toBeInTheDocument();
      expect(jobForm.getAttribute('data-open')).toBe('true');
      expect(jobForm.getAttribute('data-editing')).toBe('true');
    });
  });

  test('deletes a job when delete button is clicked', async () => {
    // Mock resumesFetch to return sample resumes
    const { resumesFetch, jobsFetch } = require('@/lib/fetch');
    resumesFetch.mockResolvedValue(mockResumes);
    jobsFetch.mockResolvedValue(mockJobs);
    
    render(<Jobs />);
    
    // Wait for job card to appear
    const deleteBtn = await screen.findByTestId(`delete-job-${mockJobs[0].id}`);
    fireEvent.click(deleteBtn);
    
    // Check that job was removed from the UI
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Job application deleted');
      // The job should be removed from the UI
      expect(screen.queryByTestId(`job-card-${mockJobs[0].id}`)).not.toBeInTheDocument();
    });
  });
  test('filters jobs by status when status filter is changed', async () => {
    const { resumesFetch, jobsFetch } = require('@/lib/fetch');
    resumesFetch.mockResolvedValue(mockResumes);
    jobsFetch.mockResolvedValue(mockJobs);
  
    render(<Jobs />);
  
    // Wait for jobs to load
    await waitFor(() => {
      expect(screen.getByTestId(`job-card-${mockJobs[0].id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`job-card-${mockJobs[1].id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`job-card-${mockJobs[2].id}`)).toBeInTheDocument();
    });
  
    const user = userEvent.setup();
  
     // Find the select container first
    const selectContainer = screen.getByTestId('select');
    
    // Find the button within the select container
    // Based on the DOM structure, we need to get the button within the select container
    // const trigger = await within(selectContainer).findByText('All Applications');
    await user.click(selectContainer);
    
    // Select "Interviewing"
    const interviewingOption = await within(selectContainer).getByRole('button', {
      name: /Interviewing/i
    });
    await user.click(interviewingOption);
  
    // Check that only interviewing job is visible
    await waitFor(() => {
      expect(screen.queryByTestId(`job-card-${mockJobs[0].id}`)).not.toBeInTheDocument(); // applied
      expect(screen.getByTestId(`job-card-${mockJobs[1].id}`)).toBeInTheDocument(); // interviewing
      expect(screen.queryByTestId(`job-card-${mockJobs[2].id}`)).not.toBeInTheDocument(); // rejected
    });
  
    // Repeat for Rejected
    await user.click(await screen.findByTestId('select'));
    await user.click(await screen.getByRole('button', {
      name: /Rejected/i

    }));
  
    await waitFor(() => {
      expect(screen.queryByTestId(`job-card-${mockJobs[0].id}`)).not.toBeInTheDocument();
      expect(screen.queryByTestId(`job-card-${mockJobs[1].id}`)).not.toBeInTheDocument();
      expect(screen.getByTestId(`job-card-${mockJobs[2].id}`)).toBeInTheDocument();
    });
  
    // Back to All
    await user.click(await screen.findByTestId('select'));
    await user.click(await screen.getByRole('button', {
      name: /All/i

    }));
  
    await waitFor(() => {
      expect(screen.getByTestId(`job-card-${mockJobs[0].id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`job-card-${mockJobs[1].id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`job-card-${mockJobs[2].id}`)).toBeInTheDocument();
    });
  });
  
  
  test('shows message when no jobs match the selected filter', async () => {
    const { resumesFetch, jobsFetch } = require('@/lib/fetch');
    resumesFetch.mockResolvedValue(mockResumes);
    jobsFetch.mockResolvedValue(mockJobs);
  
    render(<Jobs />);
  
    // Wait for jobs to load
    await waitFor(() => {
      expect(screen.getByTestId(`job-card-${mockJobs[0].id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`job-card-${mockJobs[1].id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`job-card-${mockJobs[2].id}`)).toBeInTheDocument();
    });
  
    const user = userEvent.setup();
  
    // Find the select container
    const selectContainer = screen.getByTestId('select');
    await user.click(selectContainer);
    
    // Select "Offered" (no jobs have this status)
    const offeredOption = await screen.getByRole('button', { name: /Offered/i });
    await user.click(offeredOption);
  
    // Check that no job cards are visible and empty state is shown
    await waitFor(() => {
      expect(screen.queryByTestId(`job-card-${mockJobs[0].id}`)).not.toBeInTheDocument();
      expect(screen.queryByTestId(`job-card-${mockJobs[1].id}`)).not.toBeInTheDocument();
      expect(screen.queryByTestId(`job-card-${mockJobs[2].id}`)).not.toBeInTheDocument();
      
      // Check for empty state message
      expect(screen.getByText(/No applications found/i)).toBeInTheDocument();
    });
  });
  test('adds a new job when form is submitted', async () => {
    // Mock the API responses
    const { resumesFetch, jobsFetch } = require('@/lib/fetch');
    resumesFetch.mockResolvedValue(mockResumes);
    jobsFetch.mockResolvedValue(mockJobs);
    
    // Properly mock fetch for POST request
    // First, make it a jest mock function
    global.fetch = jest.fn().mockImplementation((url, options) => {
      if (url.includes('/api/jobs') && options.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: 'new-id',
            title: 'New Job Application',
            company: 'Test Company',
            location: 'Remote',
            status: 'applied',
            resume_id: mockResumes[0].id,
            notes: 'Test notes',
            url: 'https://example.com/job',
            date_applied: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        });
      }
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Unhandled request' })
      });
    });
  
    render(<Jobs />);
    
    // Wait for jobs to load
    await waitFor(() => {
      expect(screen.getByText('New Application')).toBeInTheDocument();
    });
    
    // Click the "New Application" button
    fireEvent.click(screen.getByText('New Application'));
    
    // Wait for the form to open
    await waitFor(() => {
      const jobForm = screen.getByTestId('job-form');
      expect(jobForm).toBeInTheDocument();
      expect(jobForm.getAttribute('data-open')).toBe('true');
    });
    
    // Click the Save button in the mock form
    fireEvent.click(screen.getByText('Save Job'));
    
    // Check that new job was added to the UI
    await waitFor(() => {
      // The new job should be in the document
      expect(screen.getByText('New Job Application')).toBeInTheDocument();
      expect(screen.getByText('Test Company')).toBeInTheDocument();
    });
  });
  // Navigation tests
  test('navigates to resume page when "Create Resume" is clicked', async () => {
    // Mock resumesFetch to return an empty array
    const { resumesFetch, jobsFetch } = require('@/lib/fetch');
    resumesFetch.mockResolvedValue([]);
    jobsFetch.mockResolvedValue([]);
    

    render(<Jobs />);
    
    // Wait for empty state to appear
    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText('Create a resume first')).toBeInTheDocument();
    });
    
    // Click "Create Resume" button
    fireEvent.click(screen.getByRole('button', { name: 'Create Resume' }));
    
    // Check that router.push was called with correct path
    expect(window.location.pathname).toBe('/');
  });
});