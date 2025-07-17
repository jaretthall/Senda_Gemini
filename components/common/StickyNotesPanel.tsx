
import * as React from 'react';
import { MOCK_STICKY_NOTES } from '../../constants.tsx';
import { PlusCircleIcon, TrashIcon, XIcon } from './icons.tsx';

interface StickyNotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const noteColors = [
    'bg-yellow-200 dark:bg-yellow-700/80',
    'bg-blue-200 dark:bg-blue-700/80',
    'bg-green-200 dark:bg-green-700/80',
    'bg-pink-200 dark:bg-pink-700/80',
    'bg-purple-200 dark:bg-purple-700/80',
];

const Note: React.FC<{ note: typeof MOCK_STICKY_NOTES[0], onDelete: (id: string) => void }> = ({ note, onDelete }) => {
    return (
        <div className={`p-3 rounded-lg shadow-sm relative group ${note.color}`}>
            <p className="text-sm text-secondary-800 dark:text-secondary-100 break-words">{note.text}</p>
            <button
                onClick={() => onDelete(note.id)}
                className="absolute top-1 right-1 p-0.5 bg-black bg-opacity-10 rounded-full text-secondary-700 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-black"
                aria-label={`Delete note: ${note.text}`}
            >
                <TrashIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

const StickyNotesPanel: React.FC<StickyNotesPanelProps> = ({ isOpen, onClose }) => {
  const [notes, setNotes] = React.useState(MOCK_STICKY_NOTES);
  const [newNoteText, setNewNoteText] = React.useState('');
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  const addNote = () => {
    if (newNoteText.trim() === '') return;
    const newNote = {
      id: `note${Date.now()}`,
      text: newNoteText,
      color: noteColors[notes.length % noteColors.length],
    };
    setNotes([newNote, ...notes]);
    setNewNoteText('');
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div
        ref={panelRef}
        className="absolute top-16 right-4 mt-2 w-80 bg-white dark:bg-secondary-800 rounded-lg shadow-xl z-50 border border-secondary-200 dark:border-secondary-600 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sticky-notes-heading"
    >
        <div className="flex justify-between items-center p-3 border-b border-secondary-200 dark:border-secondary-700">
            <h3 id="sticky-notes-heading" className="text-md font-semibold text-secondary-700 dark:text-secondary-200">My Sticky Notes</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary-200 dark:hover:bg-secondary-700 text-secondary-500" aria-label="Close sticky notes">
                <XIcon className="w-5 h-5" />
            </button>
        </div>
        
        <div className="p-3 space-y-3 max-h-80 overflow-y-auto bg-amber-50 dark:bg-secondary-900/50">
           {notes.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                    {notes.map(note => <Note key={note.id} note={note} onDelete={deleteNote} />)}
                </div>
            ) : (
                <p className="text-center text-sm text-secondary-500 dark:text-secondary-400 py-4">No sticky notes yet.</p>
            )}
        </div>

        <div className="p-3 border-t border-secondary-200 dark:border-secondary-700">
            <form onSubmit={(e) => { e.preventDefault(); addNote(); }}>
              <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add a new note..."
                  rows={3}
                  className="block w-full text-sm border border-secondary-300 dark:border-secondary-600 rounded-md p-2 bg-secondary-50 dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                  type="submit"
                  className="mt-2 w-full flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-150 ease-in-out disabled:bg-primary-300 disabled:dark:bg-primary-800 disabled:cursor-not-allowed"
                  disabled={!newNoteText.trim()}
              >
                  <PlusCircleIcon className="w-5 h-5 mr-2" />
                  Add Note
              </button>
            </form>
        </div>
    </div>
  );
};

export default StickyNotesPanel;