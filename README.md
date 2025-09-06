 Secure Notes – Privacy-Focused Encrypted Notes App
 About the Project

This is a privacy-first note-taking app built with React.
Unlike regular note apps, your notes are encrypted on the client-side using AES-256 before they are saved.
That means only you can read them – not the browser, not the developer, not even the database.

All data is stored locally in the browser using IndexedDB, so the app works fully offline.
Your passphrase never leaves your device.

 Features

 Create, Edit, Delete notes (CRUD)

 AES-256 encryption using a passphrase

 Offline storage in IndexedDB (data persists even after refresh/close)

 Search notes by title or content

 Pin important notes to keep them at the top

 Archive notes to declutter without deleting

 Export notes as encrypted JSON

 Import notes back securely

 Zero data leakage → all encryption happens inside your browser

 Tech Stack

React – UI framework

CryptoJS – AES encryption/decryption

IndexedDB (via idb) – offline storage

JavaScript (ES6) – main programming language

HTML + CSS – styling and layout

 How It Works

You unlock the app with a passphrase (like a vault key).

When you create a note:

The note is encrypted with AES using your passphrase.

Only the encrypted text is saved in IndexedDB.

When you view notes:

AES decrypts them back into readable text using your passphrase.

If someone steals the database, all they see is gibberish (ciphertext).

 Project Structure
src/
  App.js           # Main app logic
  index.js         # Entry point
  index.css        # Global styles
  lib/
    crypto.js      # AES encryption/decryption helpers
    db.js          # IndexedDB functions
    util.js        # Utility functions
  components/
    Header.js      # Top navigation
    VaultGate.js   # Unlock screen
    NoteEditor.js  # Note editing panel
    NoteList.js    # List of notes
    NoteCard.js    # Single note card
    SearchBar.js   # Search + filter bar
    EmptyState.js  # Empty state placeholder

Why This Project Stands Out?

Most student projects are to-do apps or e-commerce clones.
This project shows:

✅ Security awareness (AES encryption)

✅ Offline-first design (IndexedDB)

✅ Clean architecture (modular components)

✅ User-centric features (search, pin, archive, export/import)

It’s practical, unique, and interview-friendly.

🔮 Future Improvements

Turn it into a PWA (Progressive Web App) → installable like a mobile app

Add biometric unlock (fingerprint/Face ID)

Support tags/folders for better organization

Enable cloud sync with end-to-end encryption

🏁 Getting Started

Clone the repo and run locally:

git clone https://github.com/AbhijitRai2003/secure-notes.git
cd secure-notes
npm install
npm start

🔐 Security Note

The passphrase you choose is never stored anywhere.

If you forget it, your notes cannot be recovered.

This is a feature, not a bug – it guarantees privacy.

👨‍💻 Author

Built with ❤️ by [Abhijit Rai B.Tech. Computer Science & Engineering]

📧 Email: raiabhijit58@gmail.com

💼 LinkedIn: www.linkedin.com/in/abhijit-rai-9196b3255

🐙 GitHub: https://github.com/AbhijitRai2003
Feel free to fork and improve!