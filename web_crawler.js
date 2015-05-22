var request = require('request');
var cheerio = require('cheerio');
var events = require('events');
var util = require('util');

function WebCrawler(googleObj) {
    this.skip = ['pdf','doc'];
    events.EventEmitter.call(this)
}

util.inherits(WebCrawler, events.EventEmitter)


WebCrawler.prototype.getDomainLinks = function(googleObj) {
    var self = this
    var links;
    var extension = googleObj.url.slice(googleObj.url.length - 3, googleObj.url.length);
    googleObj.internalLinks = []
    request(googleObj.url, function(error, response, body) {
        
        var $;
       
        if(self.skip.indexOf(extension) == -1) {
            try{
             $ = cheerio.load(body);
             links = $("a");
            } catch(err) {
                console.log('error in getDomainLinks', googleObj.url)
            }
        }

        if(links) cleanLinks(links, googleObj)

        function cleanLinks(lks, object) {
           Array.prototype.forEach.call(lks, function(link) {
                object.internalLinks.push(link.attribs.href)
           })
        }
        self.emit('crawlerDone', googleObj)
    })
   
}


var webCrawler = new WebCrawler()
module.exports = webCrawler;


