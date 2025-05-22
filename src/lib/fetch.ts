import { JobApplication, Resume } from '@/interfaces/types';

import { API_URL } from '@/constants';


// console.log(token)
export const resumesFetch = async (): Promise<Resume[]> => {
    try {
      const token = localStorage.getItem('token');

      const url = API_URL + '/api/resumes'
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
      const token = localStorage.getItem('token');

      const url = API_URL + '/api/jobs'
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


export async function getAuthenticatedUser(): Promise<{ name: string } | null> {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/api/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) throw new Error('Invalid token');

    const user = await res.json();
    return user;
  } catch (err) {
    localStorage.removeItem('token');
    return null;
  }
}
