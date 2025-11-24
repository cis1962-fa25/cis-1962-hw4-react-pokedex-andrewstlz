import { useEffect, useState } from "react";
import PokemonAPI from "./api/PokemonAPI";
import type { Pokemon, BoxEntry, InsertBoxEntry, UpdateBoxEntry } from "./types/types";

import PokemonList from "./components/PokemonList";
import PokemonDetails from "./components/PokemonDetails";
import BoxList from "./components/BoxList";
import BoxForm from "./components/BoxForm";
import Modal from "./components/Modal";

const PAGE_SIZE = 10;

function App() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [catchingPokemon, setCatchingPokemon] = useState<Pokemon | null>(null);
  const [editingEntry, setEditingEntry] = useState<BoxEntry | null>(null);

  const [boxEntries, setBoxEntries] = useState<BoxEntry[]>([]);

  const [view, setView] = useState<"pokemon" | "box">("pokemon");

  const [idToPokemon, setIdToPokemon] = useState<Map<number, Pokemon>>(new Map());

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadLookup = async () => {
      try {
        const list = await PokemonAPI.listPokemon(200, 0);
        const map = new Map(list.map((p) => [p.id, p]));
        setIdToPokemon(map);
      } catch {
        console.error("Failed to load Pokémon lookup");
      }
    };
    loadLookup();
  }, []);

  const loadBox = async () => {
    try {
      const ids = await PokemonAPI.listBoxEntries();
      const entries = await Promise.all(ids.map((id) => PokemonAPI.getBoxEntry(id)));
      setBoxEntries(entries);
    } catch (err: any) {
      if (err.message.includes("401")) {
        setError("Authentication failed. Check your token.");
      } else {
        setError("Failed to load Box entries.");
      }
    }
  };

  useEffect(() => {
    PokemonAPI.setToken('eyJhbGciOiJIUzI1NiJ9.eyJwZW5ua2V5IjoiYW5kcmV3engiLCJpYXQiOjE3NTkwOTgyMTgsImlzcyI6ImVkdTp1cGVubjpzZWFzOmNpczE5NjIiLCJhdWQiOiJlZHU6dXBlbm46c2VhczpjaXMxOTYyIiwiZXhwIjoxNzY0MjgyMjE4fQ.Mj4Ijg8x0m_1gBv_EsO2N5bk561u9N6AXH1xt0imIBg');
    loadBox();
  }, []);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      setError(null);

      try {
        const offset = currentPage * PAGE_SIZE;
        const data = await PokemonAPI.listPokemon(PAGE_SIZE, offset);
        setPokemon(data);
      } catch (err: any) {
        if (err.message.includes("500")) setError("Server error.");
        else setError("Failed to load Pokémon.");
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [currentPage]);

  const handleSelectPokemon = async (p: Pokemon) => {
    setLoading(true);
    setError(null);

    try {
      const details = await PokemonAPI.getPokemon(p.name);
      setSelectedPokemon(details);
    } catch (err: any) {
      if (err.message.includes("404")) setError("Pokémon not found.");
      else setError("Failed to load Pokémon details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCatch = (p: Pokemon) => {
    setSelectedPokemon(null);
    setCatchingPokemon(p);
  };

  const submitCatch = async (entry: InsertBoxEntry) => {
    setSubmitting(true);
    try {
      await PokemonAPI.createBoxEntry(entry);
      setCatchingPokemon(null);
      loadBox();
    } catch (err: any) {
      if (err.message.includes("400")) setError("Invalid input data.");
      else if (err.message.includes("401")) setError("Authentication failed.");
      else setError("Failed to save Box entry.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitEdit = async (data: UpdateBoxEntry) => {
    if (!editingEntry) return;

    setSubmitting(true);
    try {
      await PokemonAPI.updateBoxEntry(editingEntry.id, data);
      setEditingEntry(null);
      loadBox();
    } catch (err: any) {
      setError("Failed to update entry.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEntry = async (id: string) => {
    if (!confirm("Delete this entry?")) return;

    try {
      await PokemonAPI.deleteBoxEntry(id);
      loadBox();
    } catch {
      setError("Failed to delete entry.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Pokedex</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setView("pokemon")} disabled={view === "pokemon"}>
          All Pokémon
        </button>
        <button
          onClick={() => setView("box")}
          disabled={view === "box"}
          style={{ marginLeft: 10 }}
        >
          My Box
        </button>
      </div>

      {loading && <p>Loading…</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {view === "pokemon" && !loading && !error && (
        <PokemonList
          pokemons={pokemon}
          page={currentPage}
          onPageChange={setCurrentPage}
          onSelect={handleSelectPokemon}
        />
      )}

      {view === "box" && boxEntries.length === 0 && (
        <p>You haven't caught any Pokémon yet.</p>
      )}

      {view === "box" && boxEntries.length > 0 && (
        <BoxList
          entries={boxEntries}
          pokemonMap={Object.fromEntries(idToPokemon)}
          onEdit={(entry) => setEditingEntry(entry)}
          onDelete={deleteEntry}
        />
      )}

      <Modal open={!!selectedPokemon} onClose={() => setSelectedPokemon(null)}>
        {selectedPokemon && (
          <PokemonDetails
            pokemon={selectedPokemon}
            onClose={() => setSelectedPokemon(null)}
            onCatch={handleCatch}
          />
        )}
      </Modal>

      <Modal open={!!catchingPokemon} onClose={() => setCatchingPokemon(null)}>
        {catchingPokemon && (
          <BoxForm
            pokemonId={catchingPokemon.id}
            onSubmit={submitCatch}
            onCancel={() => setCatchingPokemon(null)}
          />
        )}
      </Modal>

      <Modal open={!!editingEntry} onClose={() => setEditingEntry(null)}>
        {editingEntry && (
          <BoxForm
            pokemonId={editingEntry.pokemonId}
            onSubmit={submitEdit}
            onCancel={() => setEditingEntry(null)}
          />
        )}
      </Modal>
    </div>
  );
}

export default App;
