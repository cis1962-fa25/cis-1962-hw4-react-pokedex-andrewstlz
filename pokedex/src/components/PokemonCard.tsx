import type { Pokemon } from "../types/types";

export interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

export default function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const mainTypeColor = pokemon.types[0]?.color ?? "#e63946";

  return (
    <div
      onClick={onClick}
      className="pokemon-card"
      style={{
        border: `3px solid ${mainTypeColor}`,
        padding: "12px",
        borderRadius: "10px",
        cursor: "pointer",
        background: "rgba(255, 255, 255, 0.15)",
        transition: "transform 0.15s ease, box-shadow 0.2s ease",
      }}
    >
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        style={{ width: "80px" }}
      />

      <h3
        style={{
          textTransform: "capitalize",
          color: mainTypeColor,
          marginTop: "8px",
          marginBottom: "4px",
        }}
      >
        {pokemon.name}
      </h3>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {pokemon.types.map((t) => (
          <span
            key={t.name}
            style={{
              background: t.color,
              padding: "2px 8px",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "0.75rem",
            }}
          >
            {t.name}
          </span>
        ))}
      </div>
    </div>
  );
}
