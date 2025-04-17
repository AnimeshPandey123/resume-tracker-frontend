import { useEffect, useState } from 'react';
import { useNavigate } from "react-router"
import "@/styles/resumes.css"
// import API_URL from '@/config'

interface Resume {
  id: number;
  title: string;
  summary: string;
}

function Resumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();


  useEffect(() => {
    resumesFetch();
  }, []);

  const resumesFetch = async (): Promise<void> => {
    try {
      const url = API_URL + '/api/resumes?user_id=1'
      const response = await fetch(url);
      const data: Resume[] = await response.json();
      setResumes(data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  return (
    <div className="Resumes">
      <div>Resumes:</div>
      <div className="resumes">
        {resumes.map((resume) => (
          <div className="resume-item" key={resume.id} onClick={
            () => navigate(`/resumes/${resume.id}`)
          }>
            {resume.title}: {resume.summary}  
          </div>
        ))}
      </div>
    </div>
  );
}

export default Resumes;
