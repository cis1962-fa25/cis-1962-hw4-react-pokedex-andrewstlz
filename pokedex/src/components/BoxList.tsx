import type { BoxEntry, Pokemon } from "../types/types";
import BoxCard from "./BoxCard";

export interface BoxListProps {
  entries: BoxEntry[];
  pokemonMap: Record<number, Pokemon>;
  onEdit: (entry: BoxEntry) => void;
  onDelete: (id: string) => void;
}

export default function BoxList({
  entries,
  pokemonMap,
  onEdit,
  onDelete
}: BoxListProps) {
  return (
    <div>
      {entries.map((entry) => (
        <BoxCard
          key={entry.id}
          entry={entry}
          pokemon={pokemonMap[entry.pokemonId]}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
