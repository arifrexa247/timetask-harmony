
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Note, NoteSection } from '@/types/task';
import { useToast } from '@/hooks/use-toast';

interface NoteContextType {
  notes: Note[];
  addNote: (title: string) => string;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addNoteSection: (noteId: string, title: string) => string;
  updateNoteSection: (noteId: string, sectionId: string, updates: Partial<NoteSection>) => void;
  deleteNoteSection: (noteId: string, sectionId: string) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes 
      ? JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
        })) 
      : [];
  });

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (title: string): string => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title,
      content: '',
      sections: [],
      createdAt: new Date(),
    };
    
    setNotes(prev => [...prev, newNote]);
    
    toast({
      title: "Note created",
      description: `"${title}" has been added to your notes.`,
    });
    
    return newNote.id;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id ? { ...note, ...updates } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    const noteToDelete = notes.find(note => note.id === id);
    if (!noteToDelete) return;
    
    setNotes(prev => prev.filter(note => note.id !== id));
    
    toast({
      title: "Note deleted",
      description: `"${noteToDelete.title}" has been removed.`,
      variant: "destructive",
    });
  };

  const addNoteSection = (noteId: string, title: string): string => {
    const newSection: NoteSection = {
      id: crypto.randomUUID(),
      title,
      content: '',
    };
    
    setNotes(prev => 
      prev.map(note => 
        note.id === noteId 
          ? { ...note, sections: [...note.sections, newSection] } 
          : note
      )
    );
    
    return newSection.id;
  };

  const updateNoteSection = (noteId: string, sectionId: string, updates: Partial<NoteSection>) => {
    setNotes(prev => 
      prev.map(note => {
        if (note.id !== noteId) return note;
        return {
          ...note,
          sections: note.sections.map(section =>
            section.id === sectionId ? { ...section, ...updates } : section
          )
        };
      })
    );
  };

  const deleteNoteSection = (noteId: string, sectionId: string) => {
    setNotes(prev => 
      prev.map(note => {
        if (note.id !== noteId) return note;
        return {
          ...note,
          sections: note.sections.filter(section => section.id !== sectionId)
        };
      })
    );
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        deleteNote,
        addNoteSection,
        updateNoteSection,
        deleteNoteSection,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNoteContext = () => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error('useNoteContext must be used within a NoteProvider');
  }
  return context;
};
