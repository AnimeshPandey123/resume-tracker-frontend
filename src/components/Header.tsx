
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedWrapper from './AnimatedWrapper';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <AnimatedWrapper className="w-full">
      <header className="w-full py-6 px-4 md:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center">
          <h1 className="text-2xl font-medium">Resume Builder</h1>
        </div>
        
        <nav className="glass rounded-full border border-gray-200 p-1 flex items-center">
          <Link to="/">
            <Button
              variant={isActive('/') ? "default" : "ghost"}
              size="sm"
              className={cn(
                "rounded-full transition-all duration-300 flex items-center gap-2",
                isActive('/') ? "bg-primary text-white shadow-md" : "hover:bg-secondary/80"
              )}
            >
              <FileText className="h-4 w-4" />
              <span>Resumes</span>
            </Button>
          </Link>
          
          <Link to="/jobs">
            <Button
              variant={isActive('/jobs') ? "default" : "ghost"}
              size="sm"
              className={cn(
                "rounded-full transition-all duration-300 flex items-center gap-2 ml-1",
                isActive('/jobs') ? "bg-primary text-white shadow-md" : "hover:bg-secondary/80"
              )}
            >
              <Briefcase className="h-4 w-4" />
              <span>Job Applications</span>
            </Button>
          </Link>
        </nav>
      </header>
    </AnimatedWrapper>
  );
};

export default Header;
