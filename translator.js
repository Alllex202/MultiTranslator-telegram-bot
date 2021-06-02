const fetch = require('node-fetch');

function googleTranslate(input, from, to) {
    return fetch(`https://translate.google.com/_/TranslateWebserverUi/data/batchexecute`, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: `f.req=[[[\"MkEWBc\",\"[[\\\"${encodeURI(input)}\\\",\\\"${from}\\\",\\\"${to}\\\",true],[null]]\",null,\"generic\"]]]`,
    })
        .then(res => res.text())
        .then(data => {
            // console.log(data);
            return ('[\\"' + data.split(',[[\\"')[1]).split('\\n]\\n]\\n]\\n,')[0].split('[\\"')
                .filter((el, ind) => ind % 2 === 1)
                .map(el => el.replace('\\",', ''))
                .join(' ');
        })
        .catch(err => {
            throw new Error('Error')
        });
}

function yandexTranslate(input, from, to) {
    return fetch(`https://translate.yandex.net/api/v1/tr.json/translate?id=f766bd09.60b79478.9e9746e4.74722d74657874-0-0&srv=tr-text&lang=${from}-${to}&reason=paste&format=text`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `text=${encodeURI(input)}`,
    })
        .then(res => res.json())
        .then(data => data.text[0])
        .catch(error => {
            throw new Error('Error')
        });
}

module.exports = {googleTranslate, yandexTranslate};
// module.exports.languages = languages;
