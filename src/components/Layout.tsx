
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from "react-router"

import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarMenuBadge,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { FileText, Briefcase, LayoutTemplate, BarChart3, Settings, LogOut } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Resume } from '@/interfaces/types';
import { toast } from 'sonner';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () =>{
    console.log('Logged out');
    localStorage.removeItem('token');

    toast.success('Logged out successfully!');
    navigate('/');
  }

  // Get current page name for breadcrumbs
  const getPageName = () => {
    const path = location.pathname;
    if (path === '/home') return 'Resumes';
    if (path === '/jobs') return 'Job Applications';
    return '';
  };

  // Check if a route is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="flex flex-col">
            <div className="flex items-center px-2 py-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">Resume Builder</h1>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/home')} tooltip="Resumes">
                      <Link to="/home">
                        <FileText className="h-4 w-4" />
                        <span>Resumes</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/jobs')} tooltip="Job Applications">
                      <Link to="/jobs">
                        <Briefcase className="h-4 w-4" />
                        <span>Job Applications</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton  tooltip="Logout" onClick={handleLogout} >
                      <LogOut className="h-4 w-4"   />
                        <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="ml-auto">
          <SidebarTrigger />
        </div>

        <SidebarInset className="p-4 md:p-6 overflow-y-auto">
          <div className="container mx-auto">
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/home">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{getPageName()}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
