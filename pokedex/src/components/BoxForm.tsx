import { useState } from "react";
import type { InsertBoxEntry, UpdateBoxEntry, BoxEntry } from "../types/types";

interface BoxFormProps {
  pokemonId: number;
  initialEntry?: BoxEntry;
  onSubmit: (data: InsertBoxEntry | UpdateBoxEntry) => void;
  onCancel: () => void;
}

export default function BoxForm({
  pokemonId,
  initialEntry,
  onSubmit,
  onCancel,
}: BoxFormProps) {
  const isEditing = Boolean(initialEntry);

  const [location, setLocation] = useState(initialEntry?.location ?? "");
  const [level, setLevel] = useState(initialEntry?.level ?? 1);
  const [notes, setNotes] = useState(initialEntry?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!location.trim()) {
      setError("Location cannot be empty.");
      return;
    }
    if (level < 1 || level > 100) {
      setError("Level must be between 1 and 100.");
      return;
    }

    setSubmitting(true);

    if (isEditing) {
      const data: UpdateBoxEntry = {
        location: location.trim(),
        level,
        notes: notes.trim() || undefined,
      };
      onSubmit(data);
    } else {
      const data: InsertBoxEntry = {
        pokemonId,
        location: location.trim(),
        level,
        notes: notes.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{isEditing ? "Edit Entry" : "Catch Pokémon"}</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>
        Location
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>

      <label>
        Level
        <input
          type="number"
          min={1}
          max={100}
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
        />
      </label>

      <label>
        Notes (optional)
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : isEditing ? "Save Changes" : "Save"}
        </button>
      </div>
    </form>
  );
}
