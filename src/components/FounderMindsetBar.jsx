import React, { useState } from "react";
import { Sparkles, Crown, Zap, TrendingUp, Target } from "lucide-react";

export const FOUNDER_QUOTES = [
  {
    icon: Zap,
    color: "#818cf8",
    tag: "Regla de Oro Krono",
    quote: "El 50% de reinversión hoy es el capital para traer el próximo lote mayorista sin deuda de bolsillo.",
    author: "Disciplina Financiera 50/50",
  },
  {
    icon: Target,
    color: "#10b981",
    tag: "Rumbo a $0 Deuda",
    quote: "A solo 9 relojes de saldar toda la inversión de los lotes y liberar $765.000 de ganancia neta líquida.",
    author: "Meta de Cierre de Inventario",
  },
  {
    icon: Sparkles,
    color: "#06b6d4",
    tag: "Meta 50 Relojes",
    quote: "Llegar a 50 relojes de stock es nuestro punto de libertad: la reinversión se detiene y cada quincena se convierte en sueldo limpio para Elian y Juan.",
    author: "Horizonte KRONO 50",
  },
  {
    icon: Crown,
    color: "#818cf8",
    tag: "Alianza Fundadora",
    quote: "Elian en la precisión financiera y Juan en la potencia de ventas: una sociedad 50/50 imparable.",
    author: "KRONO Timepieces",
  },
  {
    icon: Zap,
    color: "#34d399",
    tag: "Efecto Compuesto",
    quote: "Cada peso reinvertido en el lote de 50 relojes compra independencia. Un catálogo completo vende solo.",
    author: "Mentalidad de Crecimiento",
  },
  {
    icon: Sparkles,
    color: "#38bdf8",
    tag: "Estándar de Excelencia",
    quote: "Cada reloj entregado con empaque de lujo y paño de microfibra convierte a un cliente en embajador de KRONO.",
    author: "Reputación de Marca",
  },
  {
    icon: TrendingUp,
    color: "#10b981",
    tag: "Momentum de Ventas",
    quote: "Aprovechar las quincenas y la temporada alta duplica la rotación de stock y acelera nuestro crecimiento.",
    author: "Visión Comercial",
  },
];

export function FounderMindsetBar() {
  const [index, setIndex] = useState(0);

  const nextQuote = () => {
    setIndex((prev) => (prev + 1) % FOUNDER_QUOTES.length);
  };

  const item = FOUNDER_QUOTES[index];
  const Icon = item.icon;

  return (
    <div className="founder-mindset-bar">
      <div className="fmb-left">
        <div
          className="fmb-icon-box"
          style={{
            background: `${item.color}15`,
            border: `1px solid ${item.color}35`,
            color: item.color,
          }}
        >
          <Icon size={16} />
        </div>
        <div className="fmb-text-wrap">
          <div className="fmb-tag-row">
            <span className="badge badge-indigo">{item.tag}</span>
            <span className="fmb-author-label">{item.author}</span>
          </div>
          <p className="fmb-quote">"{item.quote}"</p>
        </div>
      </div>
      <button
        type="button"
        className="fmb-shuffle-btn"
        onClick={nextQuote}
        title="Ver siguiente mensaje motivador de fundadores"
      >
        <Sparkles size={13} />
        <span>Siguiente Impulso</span>
      </button>
    </div>
  );
}
export default FounderMindsetBar;

