YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Collection",
        "Comment",
        "CommentReport",
        "CommentableMixin",
        "Contributor",
        "DraftRegistration",
        "FetchAllRouteMixin",
        "File",
        "FileCacheBypassMixin",
        "FileItemMixin",
        "FileProvider",
        "FileVersion",
        "GenericDataADapter",
        "InfinityCustomMixin",
        "Institution",
        "Log",
        "Metaschema",
        "Node",
        "NodeActionsMixin",
        "NodeLink",
        "OsfAdapter",
        "OsfCookieAuthenticator",
        "OsfCookieAuthorizer",
        "OsfCookieLoginController",
        "OsfCookieLoginRoute",
        "OsfModel",
        "OsfSerializer",
        "OsfTokenAuthenticator",
        "OsfTokenAuthorizer",
        "OsfTokenLoginControllerMixin",
        "OsfTokenLoginRouteMixin",
        "PaginatedControllerMixin",
        "PaginatedRouteMixin",
        "Registration",
        "RegistrationActionsMixin",
        "TaggableMixin",
        "User",
        "ajax-helpers",
        "auth",
        "comment-detail",
        "comment-form",
        "comment-pane",
        "current-user",
        "dropzone-widget",
        "elem-id",
        "eosf-project-nav",
        "file-browser",
        "file-browser-icon",
        "file-chooser component",
        "file-manager",
        "file-renderer",
        "file-version",
        "file-widget",
        "oauth-popup",
        "osf-copyright",
        "osf-footer",
        "osf-mode-footer",
        "osf-navbar",
        "pagination-control",
        "search-dropdown",
        "sign-up",
        "tags-widget"
    ],
    "modules": [
        "adapters",
        "authenticators",
        "authorizers",
        "components",
        "ember",
        "ember-osf",
        "helpers",
        "mixins",
        "models",
        "serializers",
        "services",
        "utils"
    ],
    "allModules": [
        {
            "displayName": "adapters",
            "name": "adapters",
            "description": "Base adapter class for all OSF APIv2 endpoints"
        },
        {
            "displayName": "authenticators",
            "name": "authenticators",
            "description": "Ember-simple-auth compatible authenticator based on session cookie.\n\nIntended to be used with the authorizer of the same name."
        },
        {
            "displayName": "authorizers",
            "name": "authorizers",
            "description": "Ember-simple-auth compatible authorizer based on session cookie.\n\nIntended to be used with the authenticator of the same name."
        },
        {
            "displayName": "components",
            "name": "components",
            "description": "Display information about an individual comment, including controls to edit, delete, and report.\nThis component is typically used as part of the `comment-pane` component; see that component for further information.\n\nSample usage:\n```handlebars\n{{comment-detail\n  comment=comment\n  editComment=attrs.editComment\n  deleteComment=attrs.deleteComment\n  restoreComment=attrs.restoreComment\n  reportComment=attrs.reportComment}}\n```"
        },
        {
            "displayName": "ember",
            "name": "ember"
        },
        {
            "displayName": "ember-osf",
            "name": "ember-osf",
            "description": "Helper functions for asynchronous behavior"
        },
        {
            "displayName": "helpers",
            "name": "helpers",
            "description": "Generate a unique HTML element ID for this element. Given \"someid\" for component instance 123, returns \"ember123-someid\"\n\nUseful to ensure unique IDs, eg for when component is reused in page."
        },
        {
            "displayName": "mixins",
            "name": "mixins",
            "description": "Controller mixin that implements basic commenting functionality. Uses the base model in the route model hook."
        },
        {
            "displayName": "models",
            "name": "models",
            "description": "Model for OSF APIv2 collections\nFor field and usage information, see:\n* https://api.osf.io/v2/docs/#!/v2/Collection_List_GET"
        },
        {
            "displayName": "serializers",
            "name": "serializers",
            "description": "Base serializer class for all OSF APIv2 endpoints. Provides custom behaviors for embeds, relationships, and pagination."
        },
        {
            "displayName": "services",
            "name": "services",
            "description": "Access information about the currently logged in user"
        },
        {
            "displayName": "utils",
            "name": "utils",
            "description": "Helper functions for asynchronous behavior"
        }
    ],
    "elements": []
} };
});