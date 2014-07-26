var worddict = {};
var letterdict = {};
var wordlist = [];
var letterlist = [];
var count = 0;
var currtext;

function getworth(word) {
    if(word === null)
        return;
    var total = 0;
    var i = 0;
    var max = word.length;
    while(i < max) {
        total += letterdict[word.charAt(i)][0];
        i++;
    }
    if(max == 7) {
        total += 50;
    }
    return total;
}

function getprob(word) {
    if (word === null)
        return;
    var total = 1;
    var i = 0;
    var max = word.length;
    while(i < max) {
        total *= letterdict[word.charAt(i)][1]/count;
        i++;
    }
    return total;
}

function unival(text, wordlist) {
    var listlength = wordlist.length;
    var textprob = getprob(text);
    var ev = 0;
    var textlength = text.length;
    for (var i = 0; i < listlength; ++i) {
        var word = wordlist[i];
        if(word.length > textlength) 
            ev += getworth(word)*getprob(word)/textprob;
    }
    ev += getworth(text);
    return ev;
}

function search(event) {
    var text = $('.searchform').val().replace(/[^a-zA-Z]/g, '').toLowerCase();
    $('.searchform').val(text);
    if(text.length < 3)
        return;
    sval = '';
    $('#selworth').text('');
    $('#selprob').text('');
    $('#selev').text('');

    currtext = text;
    var searchlist = [];
    var html = [];
    var textdict = {};
    for (var i = 0; i < text.length; ++i)
        if( text.charAt(i) in textdict)
            textdict[text.charAt(i)]++;
        else
            textdict[text.charAt(i)] = 1;
    for (var i = 0; i < wordlist.length; ++i) {
        var word = wordlist[i];
        var worddict = {};
        var wordlength = word.length;
        for (var j = 0; j < wordlength; ++j) {
            if( word.charAt(j) in worddict)
                worddict[word.charAt(j)]++;
            else
                worddict[word.charAt(j)] = 1;
        }
        var acceptable = true;
        Object.keys(textdict).forEach(function(key) { acceptable = acceptable && textdict[key] <= worddict[key]; });
        if(acceptable) {
            searchlist.push(word);
            html.push('<option>', word, '</option>');
        }
    }
    $('#selectwordlist').html(html.join(' '));
    $('#wordprob').text(getprob(text));
    $('#uniev').text(unival(text, searchlist).toFixed(3));
    $('#unisize').text(searchlist.length);
    $('#wordworth').text(getworth(text));

    var randomsample = _.sample(searchlist, 255);
    var randomlist = [];
    for (var i = 0; i < randomsample.length; ++i) {
        randomlist.push({text:randomsample[i], size: getworth(randomsample[i])});
    }
   
    $('#wordcloud').html('');
    cloud.make({
        width: 1170,
        height: 400,
        font: "Helvetica",
        container: "#wordcloud",
        words: randomlist 
    })

}
function processloaded() {
    var i = 0;
    var max = letterlist.length;
    while(i < max) {
        var line = letterlist[i].split(' ');
        if(line.length >= 3) {
            letterdict[line[0]] = [+line[1], +line[2]];
            count+= letterdict[line[0]][1];
        }
        i++;
    }
    i = 0;
    max = wordlist.length;
    while(i < max) {
        var word = wordlist[i];
        worddict[word] = getworth(word);
        i++;
    }
    wordlist.sort();
    $('.searchform').bind("propertychange input paste", search);
    $('#selectwordlist').change(function () {
        var sval = $('#selectwordlist').val();
        $('#selworth').text(getworth(sval));
        $('#selprob').text((getprob(sval)/getprob(currtext)).toFixed(5));
        $('#selev').text((($('#selprob').text()+0)*getworth(sval)).toFixed(5));
    });
}

var loaded = 0;
$.get('data/filtered_words.txt', function(data) {
    loaded++;

    wordlist = data.split('\n');
    if(loaded == 2) {
        processloaded();
    }
});

$.get('data/letters.txt', function(letters) {
    loaded++;
    letterlist = letters.split('\n');
    if(loaded == 2) {
        processloaded();
    }
});


