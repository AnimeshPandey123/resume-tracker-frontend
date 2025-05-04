import { useEffect, useState } from 'react';
import { useNavigate } from "react-router"
import "@/styles/resumes.css"
import { API_URL } from '@/constants';
import { resumesFetch } from '@/lib/fetch';

interface Resume {
  id: number;
  title: string;
  summary: string;
}

function Resumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const navigate = useNavigate();


  useEffect(() => {
    resumesFetch();
  }, []);


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
