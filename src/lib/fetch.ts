import { JobApplication, Resume } from '@/interfaces/types';

import { API_URL } from '@/constants';


const token = localStorage.getItem('token');
// console.log(token)
export const resumesFetch = async (): Promise<Resume[]> => {
    try {
      const url = API_URL + '/api/resumes?user_id=1'
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data: Resume[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching resumes:', error);
      return []; 
    }
};

export  const jobsFetch = async (): Promise<JobApplication[]> => {
    try {
      const url = API_URL + '/api/jobs?user_id=1'
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data: JobApplication[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching resumes:', error);
      return [];
    }
  };