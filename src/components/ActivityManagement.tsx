
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, MapPin, Clock, Users, DollarSign } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ActivityRate {
  id: string;
  activity_name: string;
  activity_type: string;
  location: string;
  duration_hours: number | null;
  rate_per_person: number;
  currency: string;
  minimum_participants: number | null;
  maximum_participants: number | null;
  supplier_name: string | null;
  supplier_contact: string | null;
  includes: string[] | null;
  excludes: string[] | null;
  difficulty_level: string | null;
  age_restrictions: string | null;
  seasonal_availability: string[] | null;
  is_active: boolean;
}

const ActivityManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityRate | null>(null);
  const [formData, setFormData] = useState({
    activity_name: "",
    activity_type: "tour",
    location: "",
    duration_hours: "",
    rate_per_person: "",
    currency: "USD",
    minimum_participants: "1",
    maximum_participants: "",
    supplier_name: "",
    supplier_contact: "",
    difficulty_level: "easy",
    age_restrictions: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activity-rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_rates')
        .select('*')
        .eq('is_active', true)
        .order('activity_name', { ascending: true });
      
      if (error) throw error;
      return data as ActivityRate[];
    },
  });

  const createActivityMutation = useMutation({
    mutationFn: async (newActivity: any) => {
      const { data, error } = await supabase
        .from('activity_rates')
        .insert([{
          ...newActivity,
          duration_hours: newActivity.duration_hours ? parseFloat(newActivity.duration_hours) : null,
          rate_per_person: parseFloat(newActivity.rate_per_person),
          minimum_participants: parseInt(newActivity.minimum_participants),
          maximum_participants: newActivity.maximum_participants ? parseInt(newActivity.maximum_participants) : null,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-rates'] });
      setIsDialogOpen(false);
      setFormData({
        activity_name: "",
        activity_type: "tour",
        location: "",
        duration_hours: "",
        rate_per_person: "",
        currency: "USD",
        minimum_participants: "1",
        maximum_participants: "",
        supplier_name: "",
        supplier_contact: "",
        difficulty_level: "easy",
        age_restrictions: "",
      });
      toast({
        title: "Success",
        description: "Activity added successfully!"
      });
    },
  });

  const filteredActivities = activities.filter(activity =>
    activity.activity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.activity_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createActivityMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">Loading activities...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Activity Management</h2>
          <p className="text-muted-foreground">Manage activities, tours, and experiences</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Activity</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="activity_name">Activity Name</Label>
                  <Input
                    id="activity_name"
                    value={formData.activity_name}
                    onChange={(e) => setFormData({ ...formData, activity_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity_type">Activity Type</Label>
                  <Select value={formData.activity_type} onValueChange={(value) => setFormData({ ...formData, activity_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tour">Tour</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="sport">Sport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_hours">Duration (Hours)</Label>
                  <Input
                    id="duration_hours"
                    type="number"
                    step="0.5"
                    value={formData.duration_hours}
                    onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rate_per_person">Rate per Person</Label>
                  <Input
                    id="rate_per_person"
                    type="number"
                    step="0.01"
                    value={formData.rate_per_person}
                    onChange={(e) => setFormData({ ...formData, rate_per_person: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimum_participants">Min Participants</Label>
                  <Input
                    id="minimum_participants"
                    type="number"
                    value={formData.minimum_participants}
                    onChange={(e) => setFormData({ ...formData, minimum_participants: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maximum_participants">Max Participants</Label>
                  <Input
                    id="maximum_participants"
                    type="number"
                    value={formData.maximum_participants}
                    onChange={(e) => setFormData({ ...formData, maximum_participants: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier_name">Supplier Name</Label>
                  <Input
                    id="supplier_name"
                    value={formData.supplier_name}
                    onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier_contact">Supplier Contact</Label>
                  <Input
                    id="supplier_contact"
                    value={formData.supplier_contact}
                    onChange={(e) => setFormData({ ...formData, supplier_contact: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createActivityMutation.isPending}>
                  {createActivityMutation.isPending ? "Adding..." : "Add Activity"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Activities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <Card key={activity.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{activity.activity_name}</CardTitle>
                <Badge variant="secondary">{activity.activity_type}</Badge>
              </div>
              <CardDescription>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  {activity.location}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activity.duration_hours && (
                  <div className="flex items-center text-sm">
                    <Clock className="h-3 w-3 mr-2" />
                    {activity.duration_hours} hours
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <DollarSign className="h-3 w-3 mr-2" />
                  {activity.rate_per_person} {activity.currency} per person
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-3 w-3 mr-2" />
                  {activity.minimum_participants} - {activity.maximum_participants || "∞"} participants
                </div>
                {activity.difficulty_level && (
                  <Badge variant="outline" className="text-xs">
                    {activity.difficulty_level}
                  </Badge>
                )}
              </div>
              {activity.supplier_name && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground">
                    Supplier: {activity.supplier_name}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">No activities found</div>
          <p className="text-sm text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms" : "Add your first activity to get started"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityManagement;
