nock = require 'nock'

options =
    allowUnmocked: true

#nock.recorder.rec()

weboob = nock('http://localhost:9101', options)
    .persist()
    .log(console.log)
    .defaultReplyHeaders({'content-type': 'application/json; charset=utf-8'})
    .filteringPath(/bank\/[a-z]+\//g, 'bank/societegenerale/')
    .filteringRequestBody((path) -> return {"login":"12345","password":"54321"})
    .post('/connectors/bank/societegenerale/', {"login":"12345","password":"54321"})
    .reply(200, require('./fixtures/weboob/accounts'))

nock('http://localhost:9101', options)
    .persist()
    .log(console.log)
    .defaultReplyHeaders({'content-type': 'application/json; charset=utf-8'})
    .filteringPath(/bank\/[a-z]+\//g, 'bank/societegenerale/')
    .filteringRequestBody((path) -> return {"login":"12345","password":"54321"})
    .post('/connectors/bank/societegenerale/history', {"login":"12345","password":"54321"})
    .reply(200, require('./fixtures/weboob/operations'))
