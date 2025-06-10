
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Route, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">TravelAssist AI</h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Revolutionize Your DMC Customer Service
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI-powered email drafting, route planning, and booking automation for Destination Management Companies. 
            Reduce response time by 90% and increase customer satisfaction.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3">
                Try Email Drafting
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything Your DMC Needs
          </h2>
          <p className="text-lg text-gray-600">
            Start with email automation, scale to full service management
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Smart Email Drafting</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI-powered email responses that understand context and maintain your brand voice
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Route className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Route Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Intelligent itinerary creation with optimal routes and timing for your clients
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Booking Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automated hotel and flight booking with real-time availability and pricing
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Customer Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive client profiles with communication history and preferences
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">90%</div>
              <div className="text-lg text-gray-600">Faster Response Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-lg text-gray-600">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">50%</div>
              <div className="text-lg text-gray-600">Cost Reduction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Customer Service?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join leading DMCs who are already saving hours daily with our AI-powered platform
          </p>
          <Link to="/dashboard">
            <Button variant="secondary" size="lg" className="text-lg px-8 py-3">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">TravelAssist AI</h3>
            <p className="text-gray-400">
              Empowering DMCs with intelligent automation
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
