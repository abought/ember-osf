import Ember from 'ember';
import {
    moduleFor
} from 'ember-qunit';
import test from 'dummy/tests/ember-sinon-qunit/test';
import FactoryGuy, {
    manualSetup
} from 'ember-data-factory-guy';

import DS from 'ember-data';
import OsfAdapter from 'ember-osf/adapters/osf-adapter';

moduleFor('adapter:osf-adapter', 'Unit | Adapter | osf adapter', {
    needs: [
        'model:user', 'model:node', 'model:institution', 'model:registration', 'model:log', 'model:comment', 'model:contributor', 'model:file-provider', 'model:node-link', 'model:draft-registration',
        'adapter:osf-adapter', 'adapter:node', 'adapter:user',
        'serializer:node',
        'service:session',
        'transform:links', 'transform:embed'
    ],
    beforeEach() {
        manualSetup(this.container);
    }
});

test('#buildURL appends a trailing slash if missing', function(assert) {
    var url = 'https://api.osf.io/v2/users/me';
    this.stub(
        DS.JSONAPIAdapter.prototype,
        'buildURL',
        function() {
            return url;
        }
    );
    let adapter = this.subject();
    let user = FactoryGuy.make('user');
    let result = adapter.buildURL(
        'user',
        'me',
        user._internalModel.createSnapshot(),
        'findRecord'
    );
    assert.notEqual(url, result);
    assert.equal(result.slice(-1), '/');
});

test('#buildURL uses relationship links if available for delete, update, and find', function(assert) {
    let url = 'https://api.osf.io/v2/users/me/rel/';
    let adapter = this.subject();
    let user = FactoryGuy.make('user', {
        links: {
            self: url
        }
    });
    ['delete', 'update', 'find'].forEach(verb => {
        let result = adapter.buildURL(
            'user',
            'me',
            user._internalModel.createSnapshot(),
            `${verb}Record`
        );
        assert.equal(url, result);
    });
});

test('#buildURL uses snapshot.adapterOptions.url if available', function(assert) {
    let url = 'https://api.osf.io/v2/users/me/rel/';
    let adapter = this.subject();
    let user = FactoryGuy.make('user', {
        links: null
    });

    let result = adapter.buildURL(
        'user',
        'me',
        user._internalModel.createSnapshot({
            adapterOptions: {
                url: url
            }
        }),
        'createRecord'
    );
    assert.equal(url, result);
});

test('#_buildRelationshipURL uses relationshipLinks', function(assert) {
    let url = 'https://api.osf.io/v2/users/me/nodes/';
    let adapter = this.subject();
    let user = FactoryGuy.make('user', {
        links: {
            relationships: {
                nodes: {
                    links: {
                        related: {
                            href: url
                        }
                    }
                }
            }
        }
    });

    let result = adapter._buildRelationshipURL(
        user._internalModel.createSnapshot({
            adapterOptions: {
                url: url
            }
        }),
        'nodes'
    );
    assert.equal(url, result);
});

test('#_createRelated maps over each createdSnapshots and adds records to the parent\'s canonical state', function(assert) {
    this.inject.service('store');
    let store = this.store;

    let node = FactoryGuy.make('node');
    Ember.run.begin();
    let contributors = [
        store.createRecord('contributor', {
            title: 'Foo'
        }),
        store.createRecord('contributor', {
            title: 'Bar'
        })
    ];
    Ember.run.end();
    node.get('contributors').pushObjects(contributors);
    let saveStubs = contributors.map(c => this.stub(c, 'save', () => {
        return new Ember.RSVP.Promise((resolve) => resolve());
    }));

    var addCanonicalStub = this.stub();
    this.stub(node, 'resolveRelationship', () => {
        return {
            addCanonicalRecord: addCanonicalStub
        };
    });

    Ember.run(() => {
        node.save().then(() => {
            saveStubs.forEach(s => assert.ok(s.called));
            assert.ok(addCanonicalStub.calledTwice);
            // Can't use calledWith because sinon's deepEqual creates
            // infinite recursive calls when comparing the Ember DS.Models
            assert.equal(addCanonicalStub.args[0][0], contributors[0]);
            assert.equal(addCanonicalStub.args[1][0], contributors[1]);
        }, () => {
            // Fail
            assert.ok(false);
        });
    });
});

test('#_addRelated defers to _doRelatedRequest and adds records to the parent\'s canonical state', function(assert) {
    let node = FactoryGuy.make('node');
    let institution = FactoryGuy.make('institution');
    node.get('affiliatedInstitutions').pushObject(institution);

    var doRelatedStub = this.stub(OsfAdapter.prototype, '_doRelatedRequest', () => {
        return new Ember.RSVP.Promise(resolve => resolve());
    });
    var relation = node.resolveRelationship('affiliatedInstitutions');
    relation.hasLoaded = true;
    var addCanonicalStub = this.stub(relation, 'addCanonicalRecord');

    Ember.run(() => {
        node.save().then(() => {
            assert.ok(doRelatedStub.called);
            assert.ok(addCanonicalStub.calledOnce);
            assert.ok(addCanonicalStub.calledWith(institution));
        }, () => {
            // Fail
            assert.ok(false);
        });
    });
});

test('#_updateRelated defers to _doRelatedRequest, pushes the update response into the store, and updates the parent\'s canonicalState', function(assert) {
    this.inject.service('store');
    let store = this.store;

    let node = FactoryGuy.make('node', 'hasContributors');
    var contribs = node.get('contributors');
    var contrib = contribs.objectAt(1);

    contrib.set('bibliographic', true);

    var doRelatedStub = this.stub(OsfAdapter.prototype, '_doRelatedRequest', () => {
        return new Ember.RSVP.Promise(resolve => resolve({
            data: [
                // A slight hack-- ingore the value returned from _doRelatedRequest
                true
            ]
        }));
    });
    var addCanonicalStub = this.stub();
    this.stub(node, 'resolveRelationship', () => {
        return {
            addCanonicalRecord: addCanonicalStub
        };
    });
    var pushStub = this.stub(store, 'push', () => contrib);
    var normalizeStub = this.stub(store, 'normalize');

    Ember.run(() => {
        node.save().then(() => {
            assert.ok(doRelatedStub.calledOnce);
            assert.ok(addCanonicalStub.calledOnce);
            assert.ok(pushStub.calledOnce);
            assert.ok(normalizeStub.calledOnce);
        }, () => {
            // Fail
            assert.ok(false);
        });
    });
});


test('#_removeRelated defers to _doRelatedRequest, and removes the records from the parent\'s canonicalState', function(assert) {
    let node = FactoryGuy.make('node', 'hasInstitution');
    var inst = node.get('affiliatedInstitutions').objectAt(0);
    node.get('affiliatedInstitutions').removeObject(inst);

    var doRelatedStub = this.stub(OsfAdapter.prototype, '_doRelatedRequest', () => {
        return new Ember.RSVP.Promise(resolve => resolve());
    });

    var rel = node.resolveRelationship('affiliatedInstitutions');
    var removeCanonicalStub = this.stub(rel, 'removeCanonicalRecord', removeCanonicalStub);
    rel.hasLoaded = true;

    Ember.run(() => {
        node.save().then(() => {
            assert.ok(doRelatedStub.calledOnce);
            assert.ok(removeCanonicalStub.calledOnce);
	    assert.ok(removeCanonicalStub.calledWith(inst));
        }, () => {
            // Fail
            assert.ok(false);
        });
    });
});
