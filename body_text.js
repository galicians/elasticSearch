var cheerio = require('cheerio');
var events = require('events');
var util = require('util');
var request = require('request');


function BodyText() {
    events.EventEmitter.call(this)
    this.skip = ['pdf','doc'];
}

util.inherits(BodyText, events.EventEmitter)

BodyText.prototype.getText = function(domainObject) {
    var self = this
    var extension;
    var dictionary = {}

    extension = domainObject.url.slice(domainObject.url.length - 3, domainObject.url.length);
    
    request(domainObject.url, function(error, response, body) {
            
        if(self.skip.indexOf(extension) == -1) {
            try {
                var $page = cheerio.load(body),
                text = $page("body").text();
            } catch(err) {
                console.log('error in bodyText', domainObject.url)
            }
        }
            
        if(text) {
            text = text.replace(/\s+/g, " ")
             .replace(/[^a-zA-Z ]/g, "")
             .toLowerCase();

            text.split(" ").forEach(function (word) {

                if (word.length > 15 || word.length < 4) {
                    return;
                }
                            
                if (dictionary[word]) {
                    dictionary[word]++;
                } else {
                    dictionary[word] = 1;
                }
            });

            
        countWords()

    }

        function countWords () {
            
            var words = [];
            
            for (string in dictionary) {
                words.push({
                    word: string,
                    count: dictionary[string]
                });
            }
            
            words.sort(function (a, b) {
                return b.count - a.count;
            });
            
            domainObject.words = words.slice(0, 20)
            self.emit('textDone', domainObject )
        }

    }) // end request

}   // end BodyText


var bodyText = new BodyText()
module.exports = bodyText;


