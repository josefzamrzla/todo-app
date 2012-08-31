(function(angular) {
    var module = angular.module('task', ['ngResource']);

    // default service configuration
    module.value('taskConfig', {
        scheme: 'http',
        host: 'localhost',
        port: 9200,
        path: 'todos/todo/'
    });

    module.factory('Task', function($resource, $http, taskConfig) {
        /**
         * Public module
         * @type {Object}
         */
        var $module = {};
        /**
         * Private module
         * @type {Object}
         */
        var $this = {};

        $this.config = taskConfig;

        /**
         * Build URL from config
         * @return {String}
         */
        $this.buildUrl = function() {
            return $this.config.scheme + '://' + $this.config.host + ':' + $this.config.port +
                   '/' + $this.config.path;
        };

        /**
         * Get all tasks
         * @param successCallback
         * @param errorCallback
         */
        $module.getAll = function(successCallback, errorCallback) {

            $module.get('_search', successCallback, errorCallback);
        };

        /**
         * Get task by ID
         * @param taskId
         * @param successCallback
         * @param errorCallback
         */
        $module.get = function(taskId, successCallback, errorCallback) {

            var r = $resource($this.buildUrl().replace(':' + $this.config.port, '::port') + ':id',
                {port: $this.config.port, id: taskId},
                {get:{method:'GET'}});

            r.get({}, successCallback, errorCallback);
        };

        /**
         * Create or update (if already exists) task
         * @param data
         * @param successCallback
         * @param errorCallback
         */
        $module.save = function(data, successCallback, errorCallback) {

            $http.post($this.buildUrl() + (data.id ? data.id : ''),
                data || {},
                {headers:{'Content-Type':'application/x-www-form-urlencoded'}}).
                success(successCallback).error(errorCallback);
        };

        /**
         * Delete task by ID
         * @param taskId
         * @param successCallback
         * @param errorCallback
         */
        $module.delete = function(taskId, successCallback, errorCallback) {

            if (taskId) {
                $http.delete($this.buildUrl() + taskId,
                    {headers:{'Content-Type':'text/plain'}, data: {}}).
                    success(successCallback).error(errorCallback);
            } else {
                if (errorCallback) {
                    errorCallback('Cannot delete task - unknown ID');
                }
            }
        };

        return $module;
    });
})(angular);