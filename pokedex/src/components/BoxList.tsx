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
      {entries.map((entry) => {
        const pokemon = pokemonMap[entry.pokemonId];

        if (!pokemon) {
          return (
            <div key={entry.id} style={{ marginBottom: "10px", color: "red" }}>
              Unable to load Pokémon data for #{entry.pokemonId}.
            </div>
          );
        }

        return (
          <BoxCard
            key={entry.id}
            entry={entry}
            pokemon={pokemon}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}
