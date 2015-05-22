angular.module('signal').controller('elasticCtrl', ['$scope', 'elasticSrvc', '$location', function($scope, elasticSrvc, $location) {

    initChoices = [
      "monitoring",
      "branding",
      "analytics"
  ];
  var randPick = Math.floor(Math.random() * initChoices.length);
 
  $scope.urls = []; 
 
  $scope.searchTerm = $location.search().q || initChoices[randPick];
 
  $scope.search = function() {
    $scope.urls = [];
    $location.search({'q': $scope.searchTerm});
    $scope.loadResults();
  };
 
  $scope.loadResults = function() {
    elasticSrvc.search($scope.searchTerm).then(function(results) {
 
      for (var i = 0; i < results.length; i++) {
        $scope.urls.push(results[i]);
      }
    });
  };
 

  $scope.loadResults();
}])