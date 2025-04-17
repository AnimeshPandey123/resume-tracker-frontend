'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type ResumeAnalysis = {
  matched_skills: string[];
  missing_skills: string[];
  suggested_skills: string[];
  matched_keywords: string[];
  missing_keywords: string[];
  experience_match: {
    percentage: number;
    details: string;
  };
  education_match: {
    percentage: number;
    details: string;
  };
  certifications_match: {
    percentage: number;
    details: string;
  };
  job_fit_score: {
    overall_score: number;
    breakdown: {
      skills: number;
      experience: number;
      education: number;
      certifications: number;
    };
  };
  strengths: string[];
  weaknesses: string[];
  career_trajectory: string[];
  recommendations: string[];
};

type ResumeAnalysisModalProps = {
  analysis: ResumeAnalysis;
  open: boolean;
  onClose: () => void;
};

const ResumeAnalysisModal = ({ open, onClose, analysis }: ResumeAnalysisModalProps) => {
  return (
    analysis && <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-screen overflow-y-scroll max-w-3xl">
        <DialogHeader>
          <DialogTitle>Resume Analysis Report</DialogTitle>
          <DialogDescription>Detailed breakdown of the resume compared to the job role</DialogDescription>
        </DialogHeader>

        <section className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold">Matched Skills</h3>
            <p>{analysis.matched_skills.join(', ') || 'None'}</p>
          </div>

          <div>
            <h3 className="font-semibold">Missing Skills</h3>
            <p>{analysis.missing_skills.join(', ') || 'None'}</p>
          </div>

          <div>
            <h3 className="font-semibold">Suggested Skills</h3>
            <p>{analysis.suggested_skills.join(', ') || 'None'}</p>
          </div>

          <div>
            <h3 className="font-semibold">Matched Keywords</h3>
            <p>{analysis.matched_keywords.join(', ') || 'None'}</p>
          </div>

          <div>
            <h3 className="font-semibold">Missing Keywords</h3>
            <p>{analysis.missing_keywords.join(', ') || 'None'}</p>
          </div>

          <div>
            <h3 className="font-semibold">Experience Match</h3>
            <p><strong>{analysis.experience_match.percentage}%</strong> - {analysis.experience_match.details}</p>
          </div>

          <div>
            <h3 className="font-semibold">Education Match</h3>
            <p><strong>{analysis.education_match.percentage}%</strong> - {analysis.education_match.details}</p>
          </div>

          <div>
            <h3 className="font-semibold">Certifications Match</h3>
            <p><strong>{analysis.certifications_match.percentage}%</strong> - {analysis.certifications_match.details}</p>
          </div>

          <div>
            <h3 className="font-semibold">Job Fit Score</h3>
            <ul className="list-disc list-inside">
              <li>Overall: {analysis.job_fit_score.overall_score}%</li>
              <li>Skills: {analysis.job_fit_score.breakdown.skills}%</li>
              <li>Experience: {analysis.job_fit_score.breakdown.experience}%</li>
              <li>Education: {analysis.job_fit_score.breakdown.education}%</li>
              <li>Certifications: {analysis.job_fit_score.breakdown.certifications}%</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Strengths</h3>
            <ul className="list-disc list-inside">
              {analysis.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Weaknesses</h3>
            <ul className="list-disc list-inside">
              {analysis.weaknesses.map((w, idx) => <li key={idx}>{w}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Career Trajectory</h3>
            <ul className="list-disc list-inside">
              {analysis.career_trajectory.map((c, idx) => <li key={idx}>{c}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Recommendations</h3>
            <ul className="list-disc list-inside">
              {analysis.recommendations.map((r, idx) => <li key={idx}>{r}</li>)}
            </ul>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeAnalysisModal;
