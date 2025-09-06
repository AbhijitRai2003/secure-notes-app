import React, { useState } from "react";
import { verifyVaultPassphrase, saveVaultProof } from "../lib/crypto";

export default function VaultGate({ onUnlock }) {
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const ok = verifyVaultPassphrase(pass);
    if (!ok) {
      setErr("Incorrect passphrase. Please try again Buddy😞");
      return;
    }
    // Save/refresh the proof so next loads can validate quickly
    saveVaultProof(pass);
    onUnlock(pass);
  };

  return (
    <div className="container" style={{ marginTop: 80 }}>
      <div className="panel" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ marginTop: 0 }}>Unlock Your Vault</h2>
        <p className="kicker">
          <b>Your passphrase never leaves this device. Notes are encrypted in your browser before they’re stored.</b>
        </p>
        <form onSubmit={submit} className="row" style={{ flexDirection: "column", gap: 12 }}>
          <input
            className="input"
            type="password"
            placeholder="Enter a new or existing passphrase"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
          {err && <div style={{ color: "salmon", fontSize: 13 }}>{err}</div>}
          <button className="btn primary" type="submit">Unlock</button>
          <div className="label">
            <b>Tip: Use a strong phrase you’ll remember. If you forget it, your notes can’t be recovered and you might lose your important data.</b>
          </div>
        </form>
      </div>
    </div>
  );
}
