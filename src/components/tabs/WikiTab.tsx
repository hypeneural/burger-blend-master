import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { IngredientWikiCard } from "@/components/IngredientWikiCard";
import { Button } from "@/components/ui/button";
import { getCatalogStatus, loadCatalog, precacheCatalogCategories } from "@/lib/contentStorage";
import { useBlendStore } from "@/store/useBlendStore";

const wikiSections = [
  {
    id: "bovine",
    title: "Bovinos",
    description: "Cortes ricos em sabor e textura para blends tradicionais.",
  },
  {
    id: "pork",
    title: "Suinos",
    description: "Suinos trazem docura e gordura equilibrada para misturas.",
  },
  {
    id: "vegan",
    title: "Veganos",
    description: "Bases vegetais com fibras, textura e umami natural.",
  },
  {
    id: "extra",
    title: "Extras",
    description: "Adicoes aromaticas para ajustar sabor e suculencia.",
  },
] as const;

export function WikiTab() {
  const { catalogIngredients, setCatalog } = useBlendStore((state) => ({
    catalogIngredients: state.catalogIngredients,
    setCatalog: state.setCatalog,
  }));
  const [cachedCategories, setCachedCategories] = useState<string[]>([]);

  const groupedIngredients = useMemo(() => {
    return wikiSections.map((section) => ({
      ...section,
      items: catalogIngredients.filter((ingredient) => ingredient.category === section.id),
    }));
  }, [catalogIngredients]);

  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>(() =>
    wikiSections.reduce(
      (acc, section) => ({ ...acc, [section.id]: 6 }),
      {} as Record<string, number>,
    ),
  );

  const handleLoadMore = (sectionId: string) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [sectionId]: (prev[sectionId] ?? 6) + 6,
    }));
  };

  const refreshStatus = async () => {
    const status = await getCatalogStatus();
    setCachedCategories(status.categories);
  };

  const handlePrefetchCategory = async (sectionId: string) => {
    await precacheCatalogCategories([sectionId as typeof wikiSections[number]["id"]]);
    const refreshed = await loadCatalog();
    setCatalog({
      catalogCuts: refreshed.cuts,
      catalogIngredients: refreshed.ingredients,
      catalogPresets: refreshed.presets,
    });
    await refreshStatus();
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  return (
    <motion.section
      key="wiki"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 pt-6"
    >
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold text-foreground">WikiMeat</h1>
        <p className="text-sm text-muted-foreground">
          Guia rapido de ingredientes, perfis de sabor e gordura.
        </p>
      </div>

      {groupedIngredients.map((section) => (
        <div key={section.id} className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">{section.title}</h2>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </div>
            <span className="text-xs text-muted-foreground">{section.items.length} itens</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            <span>
              {cachedCategories.includes(section.id)
                ? "Disponivel offline"
                : "Toque para salvar offline"}
            </span>
            {!cachedCategories.includes(section.id) && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePrefetchCategory(section.id)}
              >
                Baixar categoria
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {section.items.slice(0, visibleCounts[section.id] ?? 6).map((item) => (
              <IngredientWikiCard key={item.id} ingredient={item} />
            ))}
            {section.items.length > (visibleCounts[section.id] ?? 6) && (
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => handleLoadMore(section.id)}
              >
                Carregar mais
              </Button>
            )}
          </div>
        </div>
      ))}
    </motion.section>
  );
}
