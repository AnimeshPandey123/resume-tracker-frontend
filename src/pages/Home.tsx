import { useEffect, useState } from 'react';
import { useNavigate } from "react-router"
import "@/styles/resumes.css"
import Resumes from '@/components/Resumes'
// import API_URL from '@/config'

function Home() {
  const navigate = useNavigate();

  return (
    <div className="Home">
     <div>
        <Resumes />
      </div>
    </div>
  );
}

export default Home;
