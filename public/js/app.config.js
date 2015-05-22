angular.module('signal').config([ "$locationProvider", function( $locationProvider) {
    

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

}]);