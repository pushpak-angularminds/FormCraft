import React, { useEffect, useState } from 'react';
import { PlusCircle, BarChart2, Copy, Moon, Sun, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import KebabMenu from '@/components/KebabMenu';
import { useTheme } from '@/components/ThemeProvider';

const Dashboard = () => {
  const { userId } = useParams();
  const [recentForms, setRecentForms] = useState([]);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserForms() {
      try {
        const response = await axios.get(`http://localhost:3000/user-forms/${userId}`);
        const rev = [...response?.data.forms].reverse();
        setRecentForms(rev);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: error?.response?.data?.error || "Failed to fetch user forms.",
          variant: "destructive",
        });
      }
    }
    getUserForms();
  }, [userId]);

  const copyLink = (formId) => {
    const link = `${window.location.origin}/forms/${formId}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        toast({
          title: "Success",
          description: "Link copied to clipboard!",
        });
      })
      .catch((err) => {
        console.error('Failed to copy link:', err);
        toast({
          title: "Error",
          description: "Failed to copy URL.",
          variant: "destructive",
        });
      });
  };

  const deleteForm = async (formId) => {
    if (!window.confirm("Are you sure you want to delete this form?")) return;
  
    try {
      await axios.delete(`http://localhost:3000/forms/${formId}`);
      toast({
        title: "Success",
        description: "Form deleted successfully!",
      });
      setRecentForms((prevForms) => prevForms.filter((form) => form._id !== formId));
    } catch (error) {
      console.error("Error deleting form:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to delete the form.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    // Implement your logout logic here
    // For example:
    localStorage.removeItem('userId');
    navigate('/sign-in');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Form Creator Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={toggleTheme} >
            {theme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          <Button variant="outline" size="icon" onClick={handleLogout}>
            <LogOut className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
      </div>

      <div className="mb-8 flex">
        <Link className="ml-auto w-full sm:w-auto" to={`/create-form`}>
          <Button className="bg-blue-700 dark:bg-blue-600">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Form
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Forms</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentForms?.map((form) => (
            <Card key={form._id} className="dark:bg-gray-800">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{form.title}</CardTitle>
                  <KebabMenu 
                    onEdit={() => window.location.href = `/edit-form/${form._id}`}
                    onDelete={() => deleteForm(form._id)}
                  />
                </div>
                <CardDescription className="dark:text-gray-300">
                  Last edited: {new Date(form.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  Questions: {form?.questions?.length}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => copyLink(form?._id)}>
                  <Copy className="mr-2 h-4 w-4" /> Copy Link
                </Button>
                <Link to={`/form-responses/${form?._id}`}>
                  <Button variant="outline" size="sm">
                    <BarChart2 className="mr-2 h-4 w-4" /> View Responses
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

