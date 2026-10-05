export const CARD_TYPES = [
  { name: 'React', logo: './assets/logos/react.svg', color: '#edf7fa' },
  { name: 'Vue', logo: './assets/logos/vue.svg', color: '#e6f4eb' },
  { name: 'Angular', logo: './assets/logos/angular.svg', color: '#f9e8ec' },
  { name: 'Svelte', logo: './assets/logos/svelte.svg', color: '#fff0e8' },
  { name: 'Next.js', logo: './assets/logos/next.svg', color: '#edf0f4' },
  { name: 'Nuxt', logo: './assets/logos/nuxt.svg', color: '#e8f5eb' },
  { name: 'Astro', logo: './assets/logos/astro.svg', color: '#f0eafa' },
  { name: 'Remix', logo: './assets/logos/remix.svg', color: '#f1e9f5' },
];

export const shuffle = (items) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
};
