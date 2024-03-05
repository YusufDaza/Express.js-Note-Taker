// Declare variables for DOM elements
let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let clearBtn;
let noteList;

// Check if the current page is the notes page
if (window.location.pathname === '/notes') {
  // Select DOM elements for manipulation
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelector('.list-group'); // Select the note list container
}

// Function to show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Function to hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// Object to store the active note
let activeNote = {};

// Function to fetch existing notes from the server
const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

// Function to save a new note to the server
const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });

// Function to delete a note from the server
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

// Function to render the active note
const renderActiveNote = () => {
  hide(saveNoteBtn);
  hide(clearBtn);

  if (activeNote.id) {
    show(newNoteBtn);
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    hide(newNoteBtn);
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

// Function to handle saving a note
const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Function to handle deleting a note
const handleNoteDelete = (e) => {
  e.stopPropagation();

  const noteId = e.target.parentElement.dataset.noteId;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Function to handle viewing a note
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Function to handle creating a new note view
const handleNewNoteView = () => {
  activeNote = {};
  show(clearBtn);
  renderActiveNote();
};

// Function to render the list of notes
const renderNoteList = async () => {
  const notes = await getNotes();
  const jsonNotes = await notes.json();

  noteList.innerHTML = ''; // Clear existing list

  if (jsonNotes.length === 0) {
    noteList.innerHTML = '<li class="list-group-item">No saved Notes</li>';
  } else {
    jsonNotes.forEach((note) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.innerText = note.title;
      li.dataset.noteId = note.id;
      li.addEventListener('click', handleNoteView);
      noteList.appendChild(li);
    });
  }
};

// Function to handle input in the note form
const handleNoteFormInput = () => {
  show(clearBtn);
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Event listeners
if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  clearBtn.addEventListener('click', renderActiveNote);
  noteForm.addEventListener('input', handleNoteFormInput);
}

// Initial rendering of notes
getAndRenderNotes();
