const faker = require('faker');
const TurndownService = require('turndown');

const models = require('./models');

const owner = '5f6901adf3d20c383c345c03';

module.exports = () => {
    models.Post.remove().then(() => {
        Array.from({length: 10}).forEach(() => {
            const turndownService = new TurndownService();
            models.Post.create({
                title: faker.lorem.words(10),
                body: turndownService.turndown(faker.lorem.words(100)),
                owner
            }).then(console.log).catch(console.log);
        })
    }).catch(console.log)
}
