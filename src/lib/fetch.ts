import { Resume } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;

export const resumesFetch = async (): Promise<Resume[]> => {
    try {
      const url = API_URL + '/api/resumes?user_id=1'
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data: Resume[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
};