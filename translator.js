const fetch = require('node-fetch');

function googleTranslate(input, from, to) {
    if (input.length > 5000) {
        return new Promise((resolve, reject) => {
            reject();
        }).catch(err => {
            throw new Error('🟡ERROR: Very long string (max 5000 symbols)');
        })
    }
    return fetch(`https://translate.google.com/_/TranslateWebserverUi/data/batchexecute`, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: `f.req=[[["MkEWBc","[[\\"${encodeURI(input.slice(0, 3000).replace(/\n/g, ` `).replace(/"/g, '\''))}\\",\\"${from}\\",\\"${to}\\",true],[null]]",null,"generic"]]]`,
    })
        .then(res => res.text())
        .then(data => {
            // console.log(data);
            const result = ('[\\"' + data.split(',[[\\"')[1])
                .split('\\n]\\n]\\n]\\n,')[0]
                .split('[\\"')
                .filter((el, ind) => ind % 2 === 1)
                .map(el => el.replace('\\",', ''))
                .join(' ');
            return input.length > 1000 ? result.slice(0, -3) : result;
        })
        .catch(err => {
            throw new Error('🟡ERROR: Что-то пошло не так 🙁');
        });
}

function yandexTranslate(input, from, to) {
    if (input.length > 650) {
        return new Promise((resolve, reject) => {
            reject();
        }).catch(err => {
            throw new Error('🟡ERROR: Very long string (max 650 symbols)');
        })
    }
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
            throw new Error('🟡ERROR: Что-то пошло не так 🙁');
        });
}

module.exports = {googleTranslate, yandexTranslate};
// module.exports.languages = languages;
