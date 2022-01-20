import { createSSRApp, defineComponent, h, computed, reactive } from 'vue';
import { renderToString } from 'vue/server-renderer';

const store = {
   // initial state could be hydrated
   state: reactive({ items: null }),

   // pretend to fetch some data from an api
   async fetchData() {
      this.state.items = ['hello', 'world'];
   }
}

const App = defineComponent(async () => {
   const msg = computed(() => store.state.items?.join(' '));

   // If msg value is falsy then we are either in ssr context or on the client
   // and the initial state was not modified/hydrated.
   // In both cases we need to fetch data.
   if (!msg.value)
      await store.fetchData();

   return () => h('div', null, msg.value);
})

const app = createSSRApp(App);

const html = await renderToString(app);

// in real world serve this html and append store state for hydration on client
console.log(html);
