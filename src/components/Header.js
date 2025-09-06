import React from "react";

export default function Header({ onNew, onExport, onImport, onLock }) {
  return (
    <div className="header">
      <div>
        <div className="kicker">Encrypted & Offline Notes</div>
        <h1>Your Secure Notes</h1>
        <div className="meta">AES-256 • IndexedDB • Client-side only</div>
      </div>
      <div className="toolbar">
        <button className="btn ok" onClick={onNew}>New note</button>
        <button className="btn" onClick={onExport}>Export JSON</button>
        <label className="btn">
          Import JSON
          <input type="file" accept="application/json" style={{ display: "none" }} onChange={onImport} />
        </label>
        <button className="btn danger" onClick={onLock}>Lock vault</button>
      </div>
    </div>
  );
}
