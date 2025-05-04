import { useState } from 'react';
import { useNavigate } from "react-router"

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL as string;

const Landing = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Invalid credentials');

      const data = await res.json();
      localStorage.setItem('token', data.token);
      toast.success('Login successful!');
      setIsLoginOpen(false);
      navigate('/home');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'

        },
        body: JSON.stringify({
          'name': name, 'email': email,'password': password, 'password_confirmation':confirmPassword
         }),
      });

      if (!res.ok) throw new Error('Registration failed');

      const data = await res.json();
      localStorage.setItem('token', data.token);
      toast.success('Registration successful!');
      setIsRegisterOpen(false);
      navigate('/home');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="border-b py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Resume Builder</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* LOGIN DIALOG */}
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Log In
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Log in to your account</DialogTitle>
                  <DialogDescription>
                    Enter your email and password to access your resumes.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="submit" className="w-full">
                      Log In
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* REGISTER DIALOG */}
            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Register
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create an account</DialogTitle>
                  <DialogDescription>
                    Register to start creating professional resumes.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleRegister} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirm Password</Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="submit" className="w-full">
                      Register
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>


      {/* Hero Section */}
      <section className="flex-1 flex items-center py-16 md:py-24">
        <div className="container mx-auto grid md:grid-cols-2 gap-8 px-4">
          <AnimatedWrapper className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Craft your professional resume in minutes
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Create, customize and download professional resumes tailored to your career goals. Stand out to employers and land your dream job.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button onClick={() => setIsRegisterOpen(true)} size="lg" className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Link to="/home">
                <Button variant="outline" size="lg">
                  Explore Templates
                </Button>
              </Link>
            </div>
          </AnimatedWrapper>
          
          <AnimatedWrapper delay={200} className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-primary/50 opacity-75 blur-xl"></div>
              <div className="relative rounded-xl shadow-xl overflow-hidden border glass">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                  alt="Resume Builder" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </AnimatedWrapper>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <AnimatedWrapper>
            <h2 className="text-3xl font-bold text-center mb-12">Resume Builder Features</h2>
          </AnimatedWrapper>
          
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedWrapper delay={100} className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Templates</h3>
              <p className="text-muted-foreground">Choose from a variety of professional templates suitable for any industry.</p>
            </AnimatedWrapper>
            
            <AnimatedWrapper delay={150} className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Customization</h3>
              <p className="text-muted-foreground">Tailor your resume with our intuitive editor to highlight your skills and experience.</p>
            </AnimatedWrapper>
            
            <AnimatedWrapper delay={200} className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Job Application Tracking</h3>
              <p className="text-muted-foreground">Keep track of your job applications and maintain different versions of your resume.</p>
            </AnimatedWrapper>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold">Resume Builder</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4 md:mt-0">
              © {new Date().getFullYear()} Resume Builder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
