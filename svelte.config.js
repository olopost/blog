import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

const config = {
  gotenberg: {
    endpoint: "https://pdf.meyn.fr",
  },
  kit: {
    adapter: adapter()
  },
  preprocess: vitePreprocess()
};

export default config;