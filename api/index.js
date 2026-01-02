// api/index.js - Point d'entrée Vercel
import app from '../src/app.js';

// Vercel n'utilise pas app.listen(), donc on exporte juste l'app
export default app;