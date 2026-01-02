import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { shallow } from "zustand/shallow";
import { Button } from "@/components/ui/button";
import { SavedBlendCard } from "@/components/SavedBlendCard";
import { toast } from "@/hooks/use-toast";
import { deleteSavedBlend, loadSavedBlends } from "@/lib/blendStorage";
import { useBlendStore } from "@/store/useBlendStore";
import type { SavedBlend } from "@/types/blend";

const formatDate = (value: string) => new Date(value).toLocaleDateString("pt-BR");

export function GrillTab() {
  const {
    savedBlends,
    historyEntries,
    startCustomBlend,
    loadSavedBlend,
    setSavedBlends,
  } = useBlendStore(
    (state) => ({
      savedBlends: state.savedBlends,
      historyEntries: state.historyEntries,
      startCustomBlend: state.startCustomBlend,
      loadSavedBlend: state.loadSavedBlend,
      setSavedBlends: state.setSavedBlends,
    }),
    shallow,
  );

  const handleCustomBlend = () => {
    startCustomBlend();
  };

  const handleLoadSavedBlend = (blend: SavedBlend) => {
    loadSavedBlend(blend);
  };

  const handleDeleteBlend = async (blend: SavedBlend) => {
    if (!window.confirm("Excluir blend salvo?")) return;
    await deleteSavedBlend(blend.id);
    const blends = await loadSavedBlends();
    setSavedBlends(blends);
    toast({
      title: "Blend removido",
      description: "O blend foi removido da sua lista.",
    });
  };

  return (
    <motion.section
      key="grill"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 pt-6"
    >
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold text-foreground">Minha Grelha</h1>
        <p className="text-sm text-muted-foreground">
          Seus blends favoritos, historico e conquistas.
        </p>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-primary" />
            Blends salvos
          </h2>
          <Button variant="secondary" size="sm" onClick={handleCustomBlend}>
            Novo blend
          </Button>
        </div>

        {savedBlends.length === 0 ? (
          <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Voce ainda nao salvou nenhum blend.
            </p>
            <Button variant="warm" className="w-full" onClick={handleCustomBlend}>
              Criar meu primeiro blend
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {savedBlends.map((blend) => (
              <SavedBlendCard
                key={blend.id}
                blend={blend}
                onLoad={() => handleLoadSavedBlend(blend)}
                onDelete={() => handleDeleteBlend(blend)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-foreground">Historico</h2>
        {historyEntries.length === 0 ? (
          <div className="p-4 rounded-2xl bg-card border border-border text-sm text-muted-foreground">
            Nenhum preparo registrado ainda.
          </div>
        ) : (
          <div className="space-y-2">
            {historyEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.snapshot.burgerCount}x {entry.snapshot.burgerWeight}g - {entry.snapshot.fatPercentage}% gordura
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </motion.section>
  );
}
