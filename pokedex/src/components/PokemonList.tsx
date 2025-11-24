import type { Pokemon } from "../types/types";
import PokemonCard from "./PokemonCard";

interface PokemonListProps {
  pokemons: Pokemon[];
  page: number;
  onPageChange: (n: number) => void;
  onSelect: (p: Pokemon) => void;
  pageSize?: number;
}

export default function PokemonList({
  pokemons,
  page,
  onPageChange,
  onSelect,
  pageSize = 10
}: PokemonListProps) {
  const disablePrev = page === 0;
  const disableNext = pokemons.length < pageSize;

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "12px",
        }}
      >
        {pokemons.map((p) => (
          <PokemonCard key={p.id} pokemon={p} onClick={() => onSelect(p)} />
        ))}
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button disabled={disablePrev} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>

        <span>Page {page + 1}</span>

        <button disabled={disableNext} onClick={() => onPageChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
