
import { useState, useEffect } from 'react';
import { useNoteContext } from '@/contexts/NoteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash, Edit, Save, File, FilePlus, Notebook, PenLine } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Note, NoteSection } from '@/types/task';

const NotesView = () => {
  const { 
    notes, 
    addNote, 
    updateNote, 
    deleteNote, 
    addNoteSection, 
    updateNoteSection, 
    deleteNoteSection 
  } = useNoteContext();
  
  const [activeNoteId, setActiveNoteId] = useState<string | null>(
    notes.length > 0 ? notes[0].id : null
  );
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editingNoteTitle, setEditingNoteTitle] = useState('');
  const [editingNoteContent, setEditingNoteContent] = useState('');
  const [isAddSectionDialogOpen, setIsAddSectionDialogOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({});
  const [editingSectionContent, setEditingSectionContent] = useState<Record<string, string>>({});
  const [editingSectionTitle, setEditingSectionTitle] = useState<Record<string, string>>({});
  const [isEditingSectionTitle, setIsEditingSectionTitle] = useState<Record<string, boolean>>({});
  
  // This ensures we always have the correct active note
  useEffect(() => {
    if (notes.length > 0) {
      // If current active note doesn't exist, set to first note
      if (!activeNoteId || !notes.find(note => note.id === activeNoteId)) {
        setActiveNoteId(notes[0].id);
      }
    } else {
      setActiveNoteId(null);
    }
  }, [notes, activeNoteId]);
  
  const activeNote = notes.find(note => note.id === activeNoteId) || null;
  
  const handleAddNote = () => {
    if (newNoteTitle.trim()) {
      const newNoteId = addNote(newNoteTitle.trim());
      setNewNoteTitle('');
      setIsAddNoteDialogOpen(false);
      setActiveNoteId(newNoteId);
    }
  };
  
  const handleUpdateNote = () => {
    if (!activeNote) return;
    
    updateNote(activeNote.id, {
      title: editingNoteTitle,
      content: editingNoteContent,
    });
    
    setIsEditingNote(false);
  };
  
  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    
    if (activeNoteId === id) {
      const remainingNotes = notes.filter(note => note.id !== id);
      setActiveNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
    }
  };
  
  const handleAddSection = () => {
    if (!activeNote || !newSectionTitle.trim()) return;
    
    addNoteSection(activeNote.id, newSectionTitle.trim());
    setNewSectionTitle('');
    setIsAddSectionDialogOpen(false);
  };
  
  const startEditingSectionTitle = (section: NoteSection) => {
    setIsEditingSectionTitle({
      ...isEditingSectionTitle,
      [section.id]: true,
    });
    setEditingSectionTitle({
      ...editingSectionTitle,
      [section.id]: section.title,
    });
  };

  const saveEditingSectionTitle = (noteId: string, sectionId: string) => {
    if (!editingSectionTitle[sectionId]) return;
    
    updateNoteSection(noteId, sectionId, {
      title: editingSectionTitle[sectionId],
    });
    
    setIsEditingSectionTitle({
      ...isEditingSectionTitle,
      [sectionId]: false,
    });
  };
  
  const startEditingSection = (section: NoteSection) => {
    setEditingSections({
      ...editingSections,
      [section.id]: true,
    });
    setEditingSectionContent({
      ...editingSectionContent,
      [section.id]: section.content,
    });
  };
  
  const saveEditingSection = (noteId: string, sectionId: string) => {
    updateNoteSection(noteId, sectionId, {
      content: editingSectionContent[sectionId] || '',
    });
    
    setEditingSections({
      ...editingSections,
      [sectionId]: false,
    });
  };
  
  const handleStartEditingNote = () => {
    if (!activeNote) return;
    
    setEditingNoteTitle(activeNote.title);
    setEditingNoteContent(activeNote.content);
    setIsEditingNote(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Notes</h2>
        <Button onClick={() => setIsAddNoteDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Notebook className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No notes yet. Create a note to start jotting down your thoughts.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsAddNoteDialogOpen(true)} 
              className="mt-4"
            >
              Create your first note
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-lg font-medium mb-4">Your Notes</h3>
            {notes.map(note => (
              <Card 
                key={note.id}
                className={`cursor-pointer transition-colors ${note.id === activeNoteId ? 'border-primary' : ''}`}
                onClick={() => setActiveNoteId(note.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{note.title}</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {note.content || 'No content'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {note.sections.length} section{note.sections.length !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {activeNote && (
            <div className="md:col-span-2">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    {isEditingNote ? (
                      <Input
                        value={editingNoteTitle}
                        onChange={(e) => setEditingNoteTitle(e.target.value)}
                        className="text-xl font-bold"
                      />
                    ) : (
                      <CardTitle>{activeNote.title}</CardTitle>
                    )}
                    <div className="flex gap-2">
                      {isEditingNote ? (
                        <Button variant="outline" size="sm" onClick={handleUpdateNote}>
                          <Save className="h-4 w-4 mr-1" /> Save
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={handleStartEditingNote}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsAddSectionDialogOpen(true)}
                      >
                        <FilePlus className="h-4 w-4 mr-1" /> Add Section
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow overflow-auto pb-6">
                  <Tabs defaultValue="main">
                    <TabsList className="mb-4 flex flex-wrap">
                      <TabsTrigger value="main">Main Note</TabsTrigger>
                      {activeNote.sections.map((section) => (
                        <TabsTrigger key={section.id} value={section.id}>
                          {section.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    <TabsContent value="main" className="mt-0">
                      {isEditingNote ? (
                        <Textarea
                          value={editingNoteContent}
                          onChange={(e) => setEditingNoteContent(e.target.value)}
                          className="min-h-[300px]"
                          placeholder="Write your note here..."
                        />
                      ) : (
                        <div className="prose max-w-none">
                          {activeNote.content ? (
                            <div className="whitespace-pre-wrap">{activeNote.content}</div>
                          ) : (
                            <p className="text-muted-foreground">No content yet. Click edit to add content.</p>
                          )}
                        </div>
                      )}
                    </TabsContent>
                    
                    {activeNote.sections.map((section) => (
                      <TabsContent key={section.id} value={section.id} className="mt-0">
                        <div className="flex justify-between items-center mb-4">
                          {isEditingSectionTitle[section.id] ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={editingSectionTitle[section.id] || section.title}
                                onChange={(e) => setEditingSectionTitle({
                                  ...editingSectionTitle,
                                  [section.id]: e.target.value,
                                })}
                                className="w-64"
                              />
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => saveEditingSectionTitle(activeNote.id, section.id)}
                              >
                                <Save className="h-4 w-4 mr-1" /> Save Title
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <h3 className="text-lg font-medium">{section.title}</h3>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="ml-2 h-8 w-8 p-0"
                                onClick={() => startEditingSectionTitle(section)}
                              >
                                <PenLine className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          <div className="flex gap-2">
                            {editingSections[section.id] ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => saveEditingSection(activeNote.id, section.id)}
                              >
                                <Save className="h-4 w-4 mr-1" /> Save
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => startEditingSection(section)}
                              >
                                <Edit className="h-4 w-4 mr-1" /> Edit
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteNoteSection(activeNote.id, section.id)}
                            >
                              <Trash className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </div>
                        </div>
                        
                        {editingSections[section.id] ? (
                          <Textarea
                            value={editingSectionContent[section.id] || section.content}
                            onChange={(e) => setEditingSectionContent({
                              ...editingSectionContent,
                              [section.id]: e.target.value,
                            })}
                            className="min-h-[300px]"
                            placeholder="Write section content here..."
                          />
                        ) : (
                          <div className="prose max-w-none">
                            {section.content ? (
                              <div className="whitespace-pre-wrap">{section.content}</div>
                            ) : (
                              <p className="text-muted-foreground">No content yet. Click edit to add content.</p>
                            )}
                          </div>
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Add Note Dialog */}
      <Dialog open={isAddNoteDialogOpen} onOpenChange={setIsAddNoteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Note</DialogTitle>
            <DialogDescription>
              Create a new note to organize your thoughts.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Note Title</label>
                <Input
                  id="title"
                  placeholder="Enter note title"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddNoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote}>
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Section Dialog */}
      <Dialog open={isAddSectionDialogOpen} onOpenChange={setIsAddSectionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Section</DialogTitle>
            <DialogDescription>
              Create a new section to organize your note contents.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="sectionTitle" className="text-sm font-medium">Section Title</label>
                <Input
                  id="sectionTitle"
                  placeholder="Enter section title"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSection}>
              Add Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotesView;
