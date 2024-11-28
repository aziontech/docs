import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import InstantSearch from 'vue-instantsearch/vue3/es';

export default (app) => {
	app.use(PrimeVue, {
		ripple: false
	});
	app.use(InstantSearch);
	app.directive('tooltip', Tooltip);
}
