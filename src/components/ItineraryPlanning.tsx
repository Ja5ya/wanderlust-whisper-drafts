
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useTourTemplates } from "@/hooks/useTourTemplates";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ItineraryPlanning = () => {
  const { data: tourTemplates = [], isLoading: templatesLoading } = useTourTemplates();
  
  const { data: dayTemplates = [], isLoading: dayTemplatesLoading } = useQuery({
    queryKey: ['tour-day-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_day_templates')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: contentBlocks = [], isLoading: blocksLoading } = useQuery({
    queryKey: ['tour-content-blocks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_content_blocks')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Itinerary Planning</h2>
      </div>

      <Tabs defaultValue="tour-templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tour-templates">Tour Templates</TabsTrigger>
          <TabsTrigger value="day-templates">Day Templates</TabsTrigger>
          <TabsTrigger value="content-blocks">Content Blocks</TabsTrigger>
        </TabsList>

        <TabsContent value="tour-templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Tour Templates</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Template
            </Button>
          </div>
          
          {templatesLoading ? (
            <div>Loading templates...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tourTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Duration:</span>
                        <span className="text-sm">{template.duration_days} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Theme:</span>
                        <Badge variant="secondary">{template.theme}</Badge>
                      </div>
                      {template.base_price && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Base Price:</span>
                          <span className="text-sm">{template.currency} {template.base_price}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="day-templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Day Templates</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Day Template
            </Button>
          </div>
          
          {dayTemplatesLoading ? (
            <div>Loading day templates...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {dayTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Route:</span>
                        <span className="text-sm">{template.start_point} → {template.end_point}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Travel Time:</span>
                        <span className="text-sm">{template.travel_hours}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Places:</span>
                        <span className="text-sm">{template.places_visited?.length || 0} locations</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="content-blocks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Content Blocks</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Content Block
            </Button>
          </div>
          
          {blocksLoading ? (
            <div>Loading content blocks...</div>
          ) : (
            <div className="grid gap-4">
              {contentBlocks.map((block) => (
                <Card key={block.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{block.name}</CardTitle>
                      <div className="flex space-x-2">
                        <Badge variant="outline">{block.type}</Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{block.content}</p>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        {block.location && (
                          <span className="text-sm text-gray-500">📍 {block.location}</span>
                        )}
                        {block.duration_hours && (
                          <div className="text-sm text-gray-500">⏱️ {block.duration_hours}h</div>
                        )}
                      </div>
                      {block.cost_per_person && (
                        <div className="text-sm font-medium">
                          {block.currency} {block.cost_per_person}/person
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ItineraryPlanning;
