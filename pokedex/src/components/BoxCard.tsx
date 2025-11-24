import type { BoxEntry, Pokemon } from "../types/types";

interface BoxCardProps {
  entry: BoxEntry;
  pokemon: Pokemon;
  onEdit: (entry: BoxEntry) => void;
  onDelete: (id: string) => void;
}

export default function BoxCard({
  entry,
  pokemon,
  onEdit,
  onDelete,
}: BoxCardProps) {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this entry?")) {
      onDelete(entry.id);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "10px",
      }}
    >
      <h3>{pokemon.name}</h3>
      <img
        src={pokemon.sprites.front_default}
        style={{ width: "70px", marginBottom: "10px" }}
      />

      <p><strong>Location:</strong> {entry.location}</p>
      <p><strong>Level:</strong> {entry.level}</p>
      <p><strong>Caught:</strong> {new Date(entry.createdAt).toLocaleString()}</p>

      {entry.notes && <p><strong>Notes:</strong> {entry.notes}</p>}

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button onClick={() => onEdit(entry)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}
