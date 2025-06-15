
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  content: string;
  createdAt: string;
  category: string;
  isPrivate: boolean;
}

interface NotesSectionProps {
  contextId: string;
  contextType: 'customer' | 'itinerary' | 'booking';
  title?: string;
}

const NotesSection = ({ contextId, contextType, title = "Notes" }: NotesSectionProps) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'Client prefers morning activities. Has dietary restrictions - vegetarian only.',
      createdAt: new Date().toISOString(),
      category: 'preferences',
      isPrivate: false
    },
    {
      id: '2', 
      content: 'VIP client - ensure premium service. Anniversary trip, arrange special dinner.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      category: 'special',
      isPrivate: true
    }
  ]);

  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const { toast } = useToast();

  const addNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      createdAt: new Date().toISOString(),
      category: 'general',
      isPrivate: false
    };

    setNotes([note, ...notes]);
    setNewNote('');
    setIsAddingNote(false);
    
    toast({
      title: "Success",
      description: "Note added successfully!",
    });
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const saveEdit = () => {
    if (!editContent.trim()) return;

    setNotes(notes.map(note => 
      note.id === editingId 
        ? { ...note, content: editContent }
        : note
    ));

    setEditingId(null);
    setEditContent('');
    
    toast({
      title: "Success",
      description: "Note updated successfully!",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{title}</CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddingNote(true)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Note
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Note */}
        {isAddingNote && (
          <div className="space-y-2 p-3 border rounded-lg bg-blue-50">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note..."
              rows={3}
              className="border-blue-200"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={addNote}>
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsAddingNote(false)}>
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {notes.map((note) => (
            <div key={note.id} className="p-3 border rounded-lg">
              {editingId === note.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="border-green-200 bg-green-50"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit}>
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {note.category}
                      </Badge>
                      {note.isPrivate && (
                        <Badge variant="outline" className="text-xs">
                          Private
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(note)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm mb-2">{note.content}</p>
                  <p className="text-xs text-gray-500">{formatDate(note.createdAt)}</p>
                </div>
              )}
            </div>
          ))}
          
          {notes.length === 0 && !isAddingNote && (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm">No notes yet</p>
              <p className="text-xs">Click "Add Note" to create your first note</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesSection;
