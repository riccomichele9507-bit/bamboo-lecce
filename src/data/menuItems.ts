import { IMAGES } from '../config/images';

export type Category = 'Da mangiare' | 'Da bere';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;       // prezzi indicativi (demo) — da confermare
  image: string;       // referenzia IMAGES
  category: Category;
  fallback: string;    // gradiente placeholder finché manca la foto
  emoji: string;       // icona placeholder
  isPopular?: boolean;
}

export const menuItems: MenuItem[] = [
  // ---- Da mangiare ----
  { id: 1, name: 'Panini', description: 'Pane fresco, farciture di giornata.', price: 6,
    image: IMAGES.panini, category: 'Da mangiare', fallback: 'linear-gradient(135deg,#3a2a17,#1c140b)', emoji: '🥪' },
  { id: 2, name: 'Olive', description: 'Olive pugliesi, da accompagnare al drink.', price: 4,
    image: IMAGES.olive, category: 'Da mangiare', fallback: 'linear-gradient(135deg,#243a22,#13210f)', emoji: '🫒' },
  { id: 3, name: 'Taralli', description: 'Croccanti, classici del Salento.', price: 3,
    image: IMAGES.taralli, category: 'Da mangiare', fallback: 'linear-gradient(135deg,#3a3117,#1f1a0b)', emoji: '🥨' },
  { id: 4, name: 'Piadina con cotto', description: 'Prosciutto cotto, mozzarella e pomodoro.', price: 6,
    image: IMAGES.piadinaCotto, category: 'Da mangiare', fallback: 'linear-gradient(135deg,#3a2420,#1f1310)', emoji: '🌯' },
  { id: 5, name: 'Piadina con crudo', description: 'Crudo, rucola e scaglie di grana.', price: 7,
    image: IMAGES.piadinaCrudo, category: 'Da mangiare', fallback: 'linear-gradient(135deg,#3a1d22,#1f0f12)', emoji: '🌯', isPopular: true },
  { id: 6, name: 'Panino con salmone', description: 'Salmone, philadelphia e lime.', price: 8,
    image: IMAGES.paninoSalmone, category: 'Da mangiare', fallback: 'linear-gradient(135deg,#3a2a2e,#1f1517)', emoji: '🐟' },

  // ---- Da bere ----
  { id: 7, name: 'Negroni', description: 'Gin, bitter e vermouth rosso. Il classico.', price: 8,
    image: IMAGES.negroni, category: 'Da bere', fallback: 'linear-gradient(135deg,#4a1f1c,#260f0e)', emoji: '🍸', isPopular: true },
  { id: 8, name: 'Gin Tonic', description: 'Gin premium, tonica e botaniche fresche.', price: 8,
    image: IMAGES.ginTonic, category: 'Da bere', fallback: 'linear-gradient(135deg,#1e3a3a,#0f201f)', emoji: '🥃' },
  { id: 9, name: 'Acqua', description: 'Naturale o frizzante.', price: 2,
    image: IMAGES.acqua, category: 'Da bere', fallback: 'linear-gradient(135deg,#1e3140,#0f1a22)', emoji: '💧' },
  { id: 10, name: 'Coca Cola', description: 'Servita ghiacciata.', price: 3,
    image: IMAGES.cocaCola, category: 'Da bere', fallback: 'linear-gradient(135deg,#2a1a14,#160d09)', emoji: '🥤' },
];

export const categories: Category[] = ['Da mangiare', 'Da bere'];
