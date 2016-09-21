var app = angular.module('primeiroEnemAdmin', []);

app.controller('AdminController', function($scope, $http, $window) {

    $scope.total = 0;
    $scope.contatos = [];
    $scope.mostrarTotal = false;
    $scope.mostrarLista = false;
    $scope.user = "";
    $scope.password = "";
    $scope.error = "";

    $scope.listarContatos = function() {

        $http({
            url: "/api/token", 
            method: "GET",
            params: {user: $scope.user, password: $scope.password}
        })
        .success(function(data) {
            // gravação do token de acesso
            $window.sessionStorage.token = data.token;
            $scope.error = "";

            $http.get('/api/restrito/contatos/total')
            .then(function (response) {
                $scope.total = response.data;
                $scope.mostrarTotal = true;
            });

            $http.get('/api/restrito/contatos')
            .then(function (response) {
                $scope.contatos = response.data;
                $scope.mostrarLista = true;
            });
        })
        .error(function(err) {
            $scope.total = 0;
            $scope.contatos = [];
            $scope.mostrarTotal = false;
            $scope.mostrarLista = false;
            $scope.error = err;
            delete $window.sessionStorage.token;
        });

        
    }
    
});

app.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});