var cheerio = require('cheerio');
var events = require('events');
var keywords = require('./keywords')
var util = require('util');
var request = require('request');

function GoogleSearch(keywords) {
    this.urls = keywords.urls
    events.EventEmitter.call(this)
}

util.inherits(GoogleSearch, events.EventEmitter)


GoogleSearch.prototype.request = function(searchUrl) {
    var self = this;
    request(searchUrl, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            var links = $(".r a");
            Array.prototype.forEach.call(links, function(link,index) {

                var url = $(link).attr("href");
                
                url = url.replace("/url?q=", "").split("&")[0];
                if (url.charAt(0) !== "/") {
                    self.emit('url', { url : url, rankpage: index + 1, keywords: searchUrl.slice(31, searchUrl.length - 8)})
                }

            })
            
          }
    })
}

var googleSearch = new GoogleSearch(keywords);
module.exports = googleSearch;



