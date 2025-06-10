
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FAQEditor = () => {
  const [question, setQuestion] = useState("What is included in your tour packages?");
  const [answer, setAnswer] = useState("Our tour packages typically include accommodation, transportation, guided tours, and some meals. Specific inclusions vary by package and can be customized based on your preferences and budget.");
  const { toast } = useToast();

  const saveFAQ = () => {
    toast({
      title: "Success",
      description: "FAQ has been saved to the knowledge base!"
    });
  };

  const goBack = () => {
    window.close();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={goBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit FAQ</h1>
              <p className="text-gray-600">AI-generated FAQ based on customer email</p>
            </div>
          </div>
          <Button onClick={saveFAQ}>
            <Save className="h-4 w-4 mr-2" />
            Save to Knowledge Base
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>FAQ Details</CardTitle>
            <CardDescription>
              Review and edit the AI-generated FAQ before adding to your knowledge base
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter the frequently asked question..."
              />
            </div>

            <div>
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter the detailed answer..."
                rows={8}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={goBack}>
                Cancel
              </Button>
              <Button onClick={saveFAQ}>
                <Check className="h-4 w-4 mr-2" />
                Save FAQ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQEditor;
