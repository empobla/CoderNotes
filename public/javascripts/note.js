if (window.location.pathname === '/') {
    document.getElementById('note-form__save').addEventListener('click', openSaveModal);
    document.getElementById('js-save-note').addEventListener('click', saveNote);
} else {
    document.getElementById('note-form__save').addEventListener('click', quickSave);
    document.getElementById('note-form__edit').addEventListener('click', openSaveModal);
    document.getElementById('js-edit-note').addEventListener('click', updateName);
    document.getElementById('note-form__delete').addEventListener('click', deleteNote);
}

function openSaveModal() {
    const modalBg = document.getElementById('modal-bg');
    const modalContent = document.querySelector('.modal__content');

    modalBg.style.display = 'flex';

    function clickOutside(e) {
        if (e.target.matches('.modal--close') || !e.target.closest('.modal')) {
            modalBg.style.display = '';
            modalBg.removeEventListener('click', clickOutside);
        }
    };

    modalBg.addEventListener('click', clickOutside);

    document.addEventListener('keydown', e => {
        if (e.keyCode === 27) modalBg.style.display = '';
    }, { once: true });
};

function saveNote() {
    const noteName = document.getElementById('js-note-name').value;
    const noteBody = document.getElementById('note-form__note').value;

    fetch('/savenote', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            // 'CSRF-Token': Cookies.get('XSRF-TOKEN')
        },
        body: JSON.stringify({ name: noteName, body: noteBody })
    })
    .then(response => {
        if (response.status != 201) return console.error('Error saving note.');  
        window.location.assign(`/notes/${noteName}`);
    })
    .catch(e => console.error('Error saving note.'));
};

function quickSave() {
    const saveButton = document.getElementById('note-form__save');
    const noteName = document.getElementById('js-note-name').value;
    const noteBody = document.getElementById('note-form__note').value;

    saveButton.innerHTML = '<i class="fas fa-sync icon-rotate"></i>';

    fetch('/quicksavenote', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            // 'CSRF-Token': Cookies.get('XSRF-TOKEN')
        },
        body: JSON.stringify({ name: noteName, body: noteBody })
    })
    .then(response => {
        saveButton.innerHTML = '<i class="far fa-save"></i>';
        if (response.status != 201) return console.error('Error quicksaving.');
    })
    .catch(e => console.error('Error quicksaving.'));
};

function updateName() {
    const previousName = document.getElementById('js-previousname').value;
    const noteName = document.getElementById('js-note-name').value;
    const noteBody = document.getElementById('note-form__note').value;

    fetch('/updatenote', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            // 'CSRF-Token': Cookies.get('XSRF-TOKEN')
        },
        body: JSON.stringify({ name: noteName, body: noteBody, previousName })
    })
    .then(response => {
        if (response.status != 201) return console.error('Error saving note.');  
        window.location.assign(`/notes/${noteName}`);
    })
    .catch(e => console.error('Error saving note.'));
};

function deleteNote() {
    const noteName = document.getElementById('js-note-name').value;

    const confirmDelete = confirm(`Are you sure you want to delete this note (${noteName})? Press 'OK' to delete.`);
    
    if (!confirmDelete) return;
    
    fetch('/deletenote', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: noteName })
    })
    .then(response => {
        if (response.status != 201) return console.error('Error deleting note.');
        window.location.assign('/');
    })
    .catch(e => console.error('Error deleting note.'));
};