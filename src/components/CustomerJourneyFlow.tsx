
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, Calendar, MapPin, CheckCircle, Star, ArrowRight, MessageSquare, CreditCard, Plane } from "lucide-react";

const CustomerJourneyFlow = () => {
  const journeySteps = [
    {
      id: 1,
      stage: "Initial Contact",
      icon: Mail,
      title: "Customer Inquiry",
      description: "Customer sends email with travel requirements",
      status: "active",
      details: ["Destination preferences", "Travel dates", "Group size", "Budget range"]
    },
    {
      id: 2,
      stage: "Consultation",
      icon: MessageSquare,
      title: "Needs Assessment",
      description: "Travel agent conducts detailed consultation",
      status: "active",
      details: ["Travel preferences", "Special requirements", "Activity interests", "Accommodation needs"]
    },
    {
      id: 3,
      stage: "Planning",
      icon: Calendar,
      title: "Itinerary Creation",
      description: "Custom itinerary designed based on requirements",
      status: "active",
      details: ["Route planning", "Activity selection", "Hotel recommendations", "Guide assignment"]
    },
    {
      id: 4,
      stage: "Booking",
      icon: CreditCard,
      title: "Reservation & Payment",
      description: "Bookings confirmed and payments processed",
      status: "pending",
      details: ["Hotel reservations", "Activity bookings", "Transport arrangements", "Payment processing"]
    },
    {
      id: 5,
      stage: "Pre-Travel",
      icon: MapPin,
      title: "Travel Preparation",
      description: "Final arrangements and travel documents",
      status: "upcoming",
      details: ["Document verification", "Final itinerary", "Emergency contacts", "Local guide briefing"]
    },
    {
      id: 6,
      stage: "Experience",
      icon: Plane,
      title: "Travel Experience",
      description: "Customer enjoys their trip with live support",
      status: "future",
      details: ["24/7 support", "Real-time assistance", "Experience monitoring", "Issue resolution"]
    },
    {
      id: 7,
      stage: "Post-Travel",
      icon: Star,
      title: "Follow-up & Feedback",
      description: "Gather feedback and maintain relationship",
      status: "future",
      details: ["Satisfaction survey", "Photo sharing", "Review collection", "Future trip planning"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'future':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'upcoming':
        return 'text-blue-600 bg-blue-50';
      case 'future':
        return 'text-gray-500 bg-gray-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Customer Journey Flow</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {journeySteps.map((step, index) => (
            <div key={step.id} className="relative">
              <div className="flex items-start space-x-4">
                {/* Step Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getIconColor(step.status)}`}>
                  <step.icon className="h-6 w-6" />
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(step.status)} mb-2`}>
                    {step.stage}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  
                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connector Arrow */}
              {index < journeySteps.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>

        {/* Journey Metrics */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Journey Metrics</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-sm text-gray-500">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">7.2</div>
              <div className="text-sm text-gray-500">Avg. Journey Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">3.4</div>
              <div className="text-sm text-gray-500">Touchpoints</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerJourneyFlow;
