(function(angular) {
    var app = angular.module('todoApp', ['task']);

    // default config overloading
    app.run(function(taskConfig) {
        taskConfig.scheme = 'http';
        taskConfig.host = 'localhost';
        taskConfig.port = 9200;
        taskConfig.path = 'todoss/tododo/';
    });

    app.controller('IndexCtrl', function($scope, Task) {

        $scope.tasks = {};

        /**
         * Load all tasks
         */
        $scope.load = function() {
            $scope.tasks = {};

            Task.getAll(
                function(data) {
                    if (data.hits && data.hits.hits) {
                        angular.forEach(data.hits.hits, function(task) {
                            $scope.tasks[task._id] = (angular.extend(task._source, {id: task._id}));
                        });
                    }
                }
            );
        };

        /**
         * Add new task
         */
        $scope.add = function() {
            if ($scope.newTask) {
                var task = {text: $scope.newTask, done: false};
                Task.save(task, function(data) {
                    if (data._id) {
                        $scope.tasks[data._id] = (angular.extend(task, {id: data._id}));
                    }
                    $scope.newTask = '';
                });
            }
        };

        /**
         * Mark task done
         * @param id
         */
        $scope.done = function(id) {
            Task.save($scope.tasks[id], function() {});
        };

        /**
         * Delete task
         * @param id
         */
        $scope.delete = function(id) {
            if (confirm('Delete this task?')) {
                Task.delete(id, function() {
                    var tasks = {};
                    angular.forEach($scope.tasks, function(task, taskId){
                        if (taskId != id) {
                            tasks[taskId] = task;
                        }
                        $scope.tasks = tasks;
                    });
                });
            }
        };

        /**
         * Calc number of unfinished tasks
         * @return {Number}
         */
        $scope.remaining = function() {
            var count = 0;
            angular.forEach($scope.tasks, function(task) {
                count += task.done ? 0 : 1;
            });

            return count;
        };

        // initial load
        $scope.load();

    });
})(angular);