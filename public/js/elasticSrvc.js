
angular.module('signal').factory('elasticSrvc', ['$q', '$location', 'esFactory', function($q, $location, elasticsearch) {

    var client = elasticsearch({
      host: $location.host() + ':9200'
    });
 
  var search = function(term) {
    var deferred = $q.defer();
    var query = {
      match: {
        _all: term
      }
    };
 
    client.search({
      index: 'urls',
      type: 'url',
      body: {
        size: 100,
        from: 0,
        query: query
      }
    }).then(function(result) {
      var hits_in;
      var hits_out = [];
 
      hits_in = (result.hits || {}).hits || [];
 
      for(var ii = 0; ii < hits_in.length; ii++) {
        hits_out.push(hits_in[ii]._source);
      }
 
      deferred.resolve(hits_out);
    }, deferred.reject);
 
    return deferred.promise;
  };
 
  return {
    search: search
  };
}])


