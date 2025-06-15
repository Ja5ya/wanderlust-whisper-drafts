
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Hotel } from "lucide-react";
import { Link } from "react-router-dom";
import AITrainingSettings from "@/components/AITrainingSettings";
import BackOffice from "@/components/BackOffice";

const DashboardNavigation = () => {
  const [isTrainingSettingsOpen, setIsTrainingSettingsOpen] = useState(false);
  const [isBackOfficeOpen, setIsBackOfficeOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold text-primary">TravelAssist AI</h1>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Dialog open={isTrainingSettingsOpen} onOpenChange={setIsTrainingSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  AI Training Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>AI Training Settings</DialogTitle>
                </DialogHeader>
                <AITrainingSettings />
              </DialogContent>
            </Dialog>
            <Dialog open={isBackOfficeOpen} onOpenChange={setIsBackOfficeOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Hotel className="h-4 w-4 mr-2" />
                  Back Office
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Back Office Management</DialogTitle>
                </DialogHeader>
                <BackOffice />
              </DialogContent>
            </Dialog>
            <Button variant="outline">Settings</Button>
            <Button variant="outline">Account</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavigation;
