import type { Pokemon } from "../types/types";

interface PokemonDetailsProps {
  pokemon: Pokemon;
  onClose: () => void;
  onCatch: (p: Pokemon) => void;
}

export default function PokemonDetails({
  pokemon,
  onClose,
  onCatch,
}: PokemonDetailsProps) {
  return (
    <div>
      <button onClick={onClose}>Close</button>

      <h2 style={{ textTransform: "capitalize" }}>{pokemon.name}</h2>

      <img src={pokemon.sprites.front_default} style={{ width: "120px" }} />

      <p>{pokemon.description}</p>

      <div style={{ marginTop: "10px", display: "flex", gap: "6px" }}>
        {pokemon.types.map((t) => (
          <span
            key={t.name}
            style={{
              background: t.color,
              padding: "4px 10px",
              borderRadius: "14px",
              color: "white",
              textTransform: "capitalize",
            }}
          >
            {t.name}
          </span>
        ))}
      </div>

      <button
        style={{ marginTop: "12px" }}
        onClick={() => onCatch(pokemon)}
      >
        Catch this Pokémon
      </button>
    </div>
  );
}
