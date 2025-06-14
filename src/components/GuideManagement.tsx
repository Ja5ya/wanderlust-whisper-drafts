
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, Star, Phone, Mail, Plus, Edit, Calendar } from "lucide-react";
import { useGuides, useGuideRates } from "@/hooks/useGuides";

const GuideManagement = () => {
  const { data: guides = [], isLoading } = useGuides();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGuides = guides.filter(guide =>
    guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (guide.location && guide.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const GuideDetailsDialog = ({ guide }: { guide: any }) => {
    const { data: rates = [] } = useGuideRates(guide.id);

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{guide.name}</CardTitle>
                <Badge variant={guide.is_active ? 'default' : 'secondary'}>
                  {guide.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {guide.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {guide.location}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 mr-2" />
                  {guide.experience_years || 0} years experience
                </div>
                {guide.languages && guide.languages.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {guide.languages.slice(0, 3).map((lang: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                    {guide.languages.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{guide.languages.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {guide.name}
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Guide
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="info" className="space-y-4">
            <TabsList>
              <TabsTrigger value="info">Guide Information</TabsTrigger>
              <TabsTrigger value="rates">Rates & Services</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <p className="text-sm text-gray-600">{guide.location || 'Not specified'}</p>
                    </div>
                    {guide.phone && (
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <p className="text-sm text-gray-600">{guide.phone}</p>
                      </div>
                    )}
                    {guide.email && (
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="text-sm text-gray-600">{guide.email}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Professional Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Experience</label>
                      <p className="text-sm text-gray-600">{guide.experience_years || 0} years</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Languages</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {guide.languages?.map((lang: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {lang}
                          </Badge>
                        )) || <span className="text-sm text-gray-600">Not specified</span>}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Specialties</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {guide.specialties?.map((specialty: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        )) || <span className="text-sm text-gray-600">Not specified</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {guide.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Biography</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{guide.bio}</p>
                  </CardContent>
                </Card>
              )}

              {guide.certifications && guide.certifications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {guide.certifications.map((cert: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="rates" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Service Rates</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rate
                </Button>
              </div>
              
              <div className="grid gap-4">
                {rates.length > 0 ? (
                  rates.map((rate: any) => (
                    <Card key={rate.id}>
                      <CardContent className="pt-4">
                        <div className="grid md:grid-cols-4 gap-4">
                          <div>
                            <label className="text-sm font-medium">Service Type</label>
                            <p className="text-sm capitalize">{rate.service_type.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Rate</label>
                            <p className="text-sm font-semibold">{rate.currency} {rate.rate_per_unit}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Valid From</label>
                            <p className="text-sm">{new Date(rate.valid_from).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Valid Until</label>
                            <p className="text-sm">
                              {rate.valid_to ? new Date(rate.valid_to).toLocaleDateString() : 'Open ended'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No rates configured for this guide</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="availability" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Availability Calendar</h3>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Update Availability
                </Button>
              </div>
              
              <Card>
                <CardContent className="pt-4">
                  <p className="text-center text-gray-500 py-8">
                    Availability calendar integration coming soon
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Guide Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Guide
        </Button>
      </div>

      <div className="flex space-x-4">
        <Input
          placeholder="Search guides..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading guides...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredGuides.map((guide) => (
            <GuideDetailsDialog key={guide.id} guide={guide} />
          ))}
        </div>
      )}

      {filteredGuides.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          No guides found matching your search criteria
        </div>
      )}
    </div>
  );
};

export default GuideManagement;
