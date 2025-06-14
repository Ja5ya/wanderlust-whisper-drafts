
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, Edit } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ItineraryPlanning from "./ItineraryPlanning";

const AITrainingSettings = () => {
  const queryClient = useQueryClient();
  const [newFaq, setNewFaq] = useState({ question: "", answer: "", category: "" });
  
  // FAQ queries and mutations
  const { data: faqs = [], isLoading: faqsLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const createFaqMutation = useMutation({
    mutationFn: async (faq: typeof newFaq) => {
      const { data, error } = await supabase
        .from('faqs')
        .insert([faq])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      setNewFaq({ question: "", answer: "", category: "" });
      toast.success('FAQ added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add FAQ');
      console.error('Error adding FAQ:', error);
    },
  });

  const deleteFaqMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('faqs')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('FAQ deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete FAQ');
      console.error('Error deleting FAQ:', error);
    },
  });

  const handleAddFaq = () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      toast.error('Please fill in both question and answer');
      return;
    }
    createFaqMutation.mutate(newFaq);
  };

  const handleDeleteFaq = (id: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      deleteFaqMutation.mutate(id);
    }
  };

  const groupedFaqs = faqs.reduce((acc: any, faq: any) => {
    const category = faq.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">AI Training Settings</h2>
        <p className="text-gray-600">Configure AI responses, knowledge base, and itinerary planning tools.</p>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary Planning</TabsTrigger>
          <TabsTrigger value="responses">Response Templates</TabsTrigger>
          <TabsTrigger value="settings">AI Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Booking, Travel, General"
                    value={newFaq.category}
                    onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    placeholder="Enter the frequently asked question"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  placeholder="Enter the answer to this question"
                  className="min-h-[100px]"
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                />
              </div>
              <Button 
                onClick={handleAddFaq} 
                disabled={createFaqMutation.isPending}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                {createFaqMutation.isPending ? 'Adding...' : 'Add FAQ'}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {faqsLoading ? (
              <div className="text-center py-8">Loading FAQs...</div>
            ) : (
              Object.entries(groupedFaqs).map(([category, categoryFaqs]: [string, any]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {category}
                      <Badge variant="secondary">{categoryFaqs.length} FAQs</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categoryFaqs.map((faq: any) => (
                        <div key={faq.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-lg">{faq.question}</h4>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteFaq(faq.id)}
                                disabled={deleteFaqMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">{faq.answer}</p>
                          <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                            <span>Used {faq.usage_count || 0} times</span>
                            <span>Updated {new Date(faq.updated_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="itinerary" className="space-y-6">
          <ItineraryPlanning />
        </TabsContent>

        <TabsContent value="responses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Response Templates</CardTitle>
              <p className="text-sm text-gray-600">
                Pre-configured response templates for common customer inquiries
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Response Template
                </Button>
                <div className="text-center py-8 text-gray-500">
                  No response templates configured yet
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Behavior Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tone">Response Tone</Label>
                <Input id="tone" placeholder="Professional, Friendly, Casual" />
              </div>
              <div>
                <Label htmlFor="language">Default Language</Label>
                <Input id="language" placeholder="English" />
              </div>
              <div>
                <Label htmlFor="context">Additional Context</Label>
                <Textarea 
                  id="context" 
                  placeholder="Additional context about your business, services, or policies"
                  className="min-h-[100px]"
                />
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AITrainingSettings;
