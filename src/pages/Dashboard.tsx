
import DashboardNavigation from "@/components/DashboardNavigation";
import DashboardActionCards from "@/components/DashboardActionCards";
import DashboardTabs from "@/components/DashboardTabs";

const Dashboard = () => {
  const switchToNewMessages = () => {
    const newMessagesTab = document.querySelector('[value="new-messages"]') as HTMLButtonElement;
    if (newMessagesTab) {
      newMessagesTab.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DMC Dashboard</h1>
          <p className="text-gray-600">Manage your customer service operations efficiently</p>
        </div>

        {/* Action Cards */}
        <DashboardActionCards onEmailsClick={switchToNewMessages} />

        {/* Main Content Tabs */}
        <DashboardTabs />
      </div>
    </div>
  );
};

export default Dashboard;
