const mockNotification = require('./mocks/mockNotification');
const mockConfig = require('../conf/config.test');
const mockStats = require('./mocks/mockStats');
const mockStore = require('./mocks/mockStore');
const proxyquire = require('proxyquire').noCallThru();
const expect = require('chai').expect;

describe('#kleinanzeigen testsuite()', () => {

    it('should test kleinanzeigen provider', async () => {

        const kleinanzeigen = proxyquire('../lib/provider/kleinanzeigen', {
            '../../conf/config.json': mockConfig,
            '../lib/fredy': proxyquire('../lib/fredy', {
                './services/store': mockStore,
                './notification/notify': mockNotification
            })
        });

        return await new Promise(resolve => {
            kleinanzeigen.run(mockStats).then(() => {
                const kleinanzeigenDbContent = kleinanzeigen._getStore()._db;
                expect(kleinanzeigenDbContent.kleinanzeigen).to.be.a('array');

                const notificationObj = mockNotification.get();
                expect(notificationObj).to.be.a('object');
                expect(notificationObj.serviceName).to.equal('kleinanzeigen');

                notificationObj.payload.forEach((notify, idx) => {

                    /** check the actual structure **/
                    expect(notify.id).to.be.a('number');
                    expect(notify.price).to.be.a('string');
                    expect(notify.size).to.be.a('string');
                    expect(notify.title).to.be.a('string');
                    expect(notify.link).to.be.a('string');
                    expect(notify.address).to.be.a('string');

                    /** check the values if possible **/
                    expect(notify.id).to.equal(
                        kleinanzeigenDbContent.kleinanzeigen[idx]
                    );
                    expect(notify.size).that.does.include('m²');
                    expect(notify.title).to.be.not.empty;
                    expect(notify.link).that.does.include('https://www.ebay-kleinanzeigen.de');
                    expect(notify.address).to.be.not.empty;
                });
                resolve();
            });
        });
    });
});
