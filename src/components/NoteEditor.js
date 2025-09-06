import React, { useEffect, useState } from "react";

export default function NoteEditor({ draft, onChange, onSave, onArchiveToggle, onPinToggle, onDelete }) {
  const [title, setTitle] = useState(draft.title);
  const [content, setContent] = useState(draft.content);

  useEffect(() => {
    setTitle(draft.title);
    setContent(draft.content);
  }, [draft.id]);

  useEffect(() => {
    onChange({ ...draft, title, content });
  }, [title, content]); // eslint-disable-line

  return (
    <div className="panel">
      <div className="row wrap">
        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="row" style={{ marginLeft: "auto", gap: 8 }}>
          <span className="badge">{draft.archived ? "Archived" : "Active"}</span>
          {draft.pinned ? <span className="badge">Pinned</span> : null}
        </div>
      </div>
      <hr className="sep" />
      <textarea
        className="textarea"
        placeholder="Write your thoughts…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <hr className="sep" />
      <div className="row">
        <button className="btn primary" onClick={onSave}>Save</button>
        <button className="btn" onClick={onPinToggle}>{draft.pinned ? "Unpin" : "Pin"}</button>
        <button className="btn" onClick={onArchiveToggle}>{draft.archived ? "Unarchive" : "Archive"}</button>
        <div style={{ marginLeft: "auto" }} />
        <button className="btn danger" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}
