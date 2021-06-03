const {Telegraf, Markup} = require('telegraf');
const {googleTranslate, yandexTranslate} = require('./translator');
const {veryShortTextEn, shortTextEn, longTextEn, veryLongTextEn, nTextEn, shortTextRus, middleTextRus} = require('./test');

const botToken = '1735233409:AAESYbGc677U9HwUuHKPck1PgLI1jxtl98I';

const bot = new Telegraf(botToken);


const selectLanguages = {
    from: 'en',
    to: 'ru'
};

const flags = {
    'en': '🇬🇧',
    'ru': '🇷🇺',
};

const menuItems = {
    'ru-en': '🇷🇺 ➡ 🇬🇧󠁧󠁢󠁥󠁮󠁧󠁿󠁧󠁢󠁥󠁮󠁧',
    'en-ru': '🇬🇧 ➡ 🇷🇺',
};

let selectedMenu = menuItems["en-ru"];

const TEST = false;

if (TEST) {
    console.log('\n====================================================TEST====================================================\n');
    console.log(middleTextRus.length)
    googleTranslate(middleTextRus, 'ru', 'en')
        .then(res => console.log(res))
        .catch(err => console.log(err.message));
}

// console.clear()

// bot.use(Telegraf.log());

bot.start((ctx) => {
    selectedMenu = menuItems["ru-en"];
    selectLanguage('ru', 'en');
    ctx.deleteMessage();
    ctx.reply(`Здесь можно сравнить переводы из разных сервисов.\n\nGoogle - 5000 символов (max).\n\nЯндекс - 650 символов (max).\n\nСейчас стоит ${flags[selectLanguages.from]} ➡ ${flags[selectLanguages.to]}`,
        getMainMenu());
});

bot.hears('🇷🇺 ➡ 🇬🇧󠁧󠁢󠁥󠁮󠁧󠁿󠁧󠁢󠁥󠁮󠁧', ctx => {
    selectedMenu = menuItems["ru-en"];
    selectLanguage('ru', 'en');
    ctx.reply('Перевод с русского на английский', getMainMenu())
});

bot.hears('🇬🇧 ➡ 🇷🇺', ctx => {
    selectedMenu = menuItems["en-ru"];
    selectLanguage('en', 'ru');
    ctx.reply('Перевод с английского на русский', getMainMenu())
});

bot.on('text', async ctx => {
        const google = await googleTranslate(ctx.message.text, selectLanguages.from, selectLanguages.to)
            .then(res => res)
            .catch(err => err.message);
        const yandex = await yandexTranslate(ctx.message.text, selectLanguages.from, selectLanguages.to)
            .then(res => res)
            .catch(err => err.message);
        await ctx.replyWithMarkdown(`${menuItems[`${selectLanguages.from}-${selectLanguages.to}`]}

${flags[selectLanguages.from]} *Оригинал:* 
\`${ctx.message.text}\`

${flags[selectLanguages.to]} *Google Перевод:* 
\`${google}\`

${flags[selectLanguages.to]} *Яндекс Перевод:* 
\`${yandex}\``);
    }
);

if (!TEST) {
    bot.launch();
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


function selectLanguage(from, to) {
    selectLanguages.from = from;
    selectLanguages.to = to;
}

function getMainMenu() {
    return Markup.keyboard(Object.values(menuItems).map(e => {
        if (e === selectedMenu) {
            e = '✅ ' + e;
        }
        return e;
    })).resize();
}
