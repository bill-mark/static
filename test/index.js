
var request = require('supertest');
var serve = require('..');
var koa = require('koa');

describe('serve(root)', function(){
  describe('the path is valid', function(){
    it('should serve the file', function(done){
      var app = koa();
      
      app.use(serve('test/fixtures'));

      request(app.listen())
      .get('/hello.txt')
      .expect(200)
      .expect('world', done);
    })
  })

  describe('.index', function(){
    describe('when present', function(){
      it('should alter the index file supported', function(done){
        var app = koa();
        
        app.use(serve('test/fixtures', { index: 'index.txt' }));

        request(app.listen())
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/plain; charset=UTF-8')
        .expect('text index', done);
      })
    })

    describe('when omitted', function(){
      it('should use index.html', function(done){
        var app = koa();
        
        app.use(serve('test/fixtures'));

        request(app.listen())
        .get('/world/')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=UTF-8')
        .expect('html index', done);
      })
    })
  })

  describe('when path is a directory', function(){
    describe('and an index file is present', function(){
      it('should redirect missing / to -> / when index is found', function(done){
        var app = koa();
        
        app.use(serve('test/fixtures'));

        request(app.listen())
        .get('/world')
        .expect(301)
        .expect('Location', '/world/', done);
      })
    })

    describe('and no index file is present', function(){
      it('should not redirect', function(done){
        var app = koa();
        
        app.use(serve('test/fixtures'));

        request(app.listen())
        .get('/')
        .expect(404, done);
      })
    })
  })
})