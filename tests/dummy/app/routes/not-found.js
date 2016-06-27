import Ember from 'ember';

/**
 * A demonstration route. If ember is asked to visit an unfamiliar route, it will make a note.
 * TODO: For now this is here for monitoring purposes- to indicate that the unresolved route went through ember rather than the OSF.
 * If we find this route is being triggered, we can optionally force the browser to hit the OSF server in the future.
 */
export default Ember.Route.extend({
    redirect() {
        console.log('WARNING: GENERIC 404 ROUTE TRIGGERED');
        console.log('Ember thinks it is on this route: ', window.location.href);
    }
});
