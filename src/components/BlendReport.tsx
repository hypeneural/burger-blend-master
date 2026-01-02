import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';
import { ArrowLeft, ChefHat, Flame, Leaf, Save, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FatIndicator } from '@/components/FatIndicator';
import { IngredientBreakdown } from '@/components/IngredientBreakdown';
import { NutritionSummary } from '@/components/NutritionSummary';
import { getIngredientById } from '@/data/ingredients';
import {
  calculateBaseWeight,
  calculateExtrasWeight,
  calculateFatPercentage,
  calculateNutritionPerBurger,
  formatWeight,
} from '@/lib/blendMath';
import type { BlendIngredient } from '@/data/presets';
import type { BlendExtra } from '@/types/blend';
import { toast } from '@/hooks/use-toast';

interface BlendReportProps {
  name: string;
  description: string;
  ingredients: BlendIngredient[];
  extras: BlendExtra[];
  burgerCount: number;
  burgerWeight: number;
  prepStyle: string;
  prepTips: string[];
  seasonings: string[];
  onBack: () => void;
  onSave: () => void;
}

export function BlendReport({
  name,
  description,
  ingredients,
  extras,
  burgerCount,
  burgerWeight,
  prepStyle,
  prepTips,
  seasonings,
  onBack,
  onSave,
}: BlendReportProps) {
  const reportRef = useRef<HTMLDivElement | null>(null);
  const [exporting, setExporting] = useState(false);

  const baseWeight = calculateBaseWeight(burgerCount, burgerWeight);
  const extrasWeight = calculateExtrasWeight(extras);
  const totalWeight = baseWeight + extrasWeight;
  const fatPercentage = calculateFatPercentage(ingredients, extras, burgerCount, burgerWeight);
  const nutrition = calculateNutritionPerBurger(ingredients, extras, burgerCount, burgerWeight);

  const handleSave = () => {
    onSave();
  };

  const handleShare = () => {
    const ingredientLines = ingredients
      .map((item) => {
        const ing = getIngredientById(item.ingredientId);
        return `- ${ing?.name ?? 'Ingrediente'}: ${item.percentage}%`;
      })
      .join('\n');

    const extrasLines = extras
      .map((extra) => {
        const ing = getIngredientById(extra.ingredientId);
        return `- ${ing?.name ?? 'Extra'}: ${formatWeight(extra.grams)}`;
      })
      .join('\n');

    const extrasBlock = extras.length > 0 ? `\n\nExtras:\n${extrasLines}` : '';

    const shareText = `${name}\n${description}\n\nIngredientes:\n${ingredientLines}${extrasBlock}\n\nGordura: ${fatPercentage}%\nTotal: ${formatWeight(totalWeight)}`;

    if (navigator.share) {
      navigator.share({
        title: name,
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: 'Copiado!',
        description: 'Receita copiada para a area de transferencia.',
      });
    }
  };

  const handleExportPdf = async () => {
    if (!reportRef.current || exporting) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#F7F2E9',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);

      while (position + pageHeight < imgHeight) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
      }

      pdf.save(`${name || 'blend'}.pdf`);
      toast({
        title: 'PDF pronto!',
        description: 'Receita exportada com sucesso.',
      });
    } catch {
      toast({
        title: 'Falha ao exportar',
        description: 'Nao foi possivel gerar o PDF.',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div ref={reportRef} className="space-y-6">
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-grill-orange to-cheese-gold flex items-center justify-center shadow-warm"
          >
            <ChefHat className="w-9 h-9 text-primary-foreground" />
          </motion.div>
          <h1 className="font-display text-2xl font-bold text-foreground">{name}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <span className="text-3xl font-display font-bold text-foreground">{burgerCount}</span>
            <p className="text-sm text-muted-foreground">hamburgueres</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <span className="text-3xl font-display font-bold text-foreground">{burgerWeight}g</span>
            <p className="text-sm text-muted-foreground">cada</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border">
          <FatIndicator percentage={fatPercentage} />
        </div>

        <IngredientBreakdown ingredients={ingredients} baseWeight={baseWeight} extras={extras} />

        <NutritionSummary
          calories={nutrition.calories}
          protein={nutrition.protein}
          fat={nutrition.fat}
          perBurgerWeight={nutrition.perBurgerWeight}
        />

        <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-grill-orange/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-grill-orange" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">Modo de Preparo</h3>
              <p className="text-sm text-muted-foreground">{prepStyle}</p>
            </div>
          </div>

          <ul className="space-y-2">
            {prepTips.map((tip, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-3 text-sm text-foreground"
              >
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary flex-shrink-0">
                  {index + 1}
                </span>
                {tip}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-meat-red/20 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-meat-red" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">Temperos Sugeridos</h3>
              <p className="text-sm text-muted-foreground">Para realcar o sabor</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {seasonings.map((seasoning, index) => (
              <motion.span
                key={seasoning}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="px-3 py-1.5 rounded-full bg-background text-sm text-foreground border border-border"
              >
                {seasoning}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" className="flex-1" onClick={handleSave}>
          <Save className="w-4 h-4" />
          Salvar receita
        </Button>
        <Button variant="warm" className="flex-1" onClick={handleShare}>
          <Share2 className="w-4 h-4" />
          Compartilhar
        </Button>
      </div>

      <Button variant="secondary" className="w-full" onClick={handleExportPdf} disabled={exporting}>
        {exporting ? 'Gerando PDF...' : 'Exportar PDF'}
      </Button>

      <Button variant="ghost" className="w-full" onClick={onBack}>
        <ArrowLeft className="w-4 h-4" />
        Voltar e ajustar
      </Button>
    </motion.div>
  );
}
