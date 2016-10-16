var expect = require("chai").expect;
var request = require("superagent");

describe("BentoBoard account system",function(){
  it("Sign in",function(done){
    request
    .post("http://localhost:3000/signup")
    .send({username: "john.nguyen",password: "pass", firstName: "John", lastName: "Nguyen"})
    .end(function(err,res){
      expect(res.statusCode).to.equal(200);
      done();
    })
  });

  it("Log in",function(done){
    request
    .post("http://localhost:3000/login")
    .send({username: "john.nguyen",password: "pass"})
    .end(function(err,res){
      expect(res.statusCode).to.equal(200);
      done();
    })
  })

  it("Get User Data",function(done){
    request
    .get("http://localhost:3000/getUserData")
    .end(function(err,res){
      expect(res.statusCode).to.equal(200);
      done();
    })
  })
})
 