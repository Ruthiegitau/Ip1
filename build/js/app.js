(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.apiKey="9cbe9b3e76518295ba3fde8eb04241e2";

},{}],2:[function(require,module,exports){
var apiKey = require('./../.env').apiKey;

function Github() {
}

Github.prototype.getUser = function(username, displayFunction) {
  var info = [];
  var repoInfo = [];
  // get request to get user info
  $.get('https://api.github.com/users/' + username + '?access_token=' + apiKey).then(function(response) {
    // console.log(response);
      var user = response.login;
      var name = response.name;
      var location = response.location;
      var image = response.avatar_url;
      info.push(user, name, location, image);

    // second get request to get user repos
    $.get('https://api.github.com/users/' + username + '/repos?access_token=' + apiKey).then(function(result) {
      var repos = result;
      repos.forEach(function(repo) {
        var repoName = repo.name;
        var description = repo.description;
        var language = repo.language;
        repoInfo.push([repoName, description, language]);
      });
      displayFunction(info, repoInfo);
    });
  }).fail(function(error){
    $('#error').empty();
    $('#user-info').empty();
    $('#user-repos').empty();
    $('h2').hide();
    $('#error').append("Sorry, there is no GitHub account with that username");
  });
};

exports.githubModule = Github;

},{"./../.env":1}],3:[function(require,module,exports){

var Github = require('./../js/api.js').githubModule;

var displayUser = function(info, repos) {
  $('h2').show();
  $('#error').empty();
  $('#user-info').empty();
  $('#user-repos').empty();
  var img = info[3];
  var username = info[0];
  var name = info[1];
  var location = info[2];
  if(name !== null && location !== null){
    $('#user-info').append("<img src='" + img + "'><h3>" + username + "</h3><p>" + name + "<br>" + location +  "</p>");
  } else {
    $('#user-info').append("<img src='" + img + "'>" + "<h3>" + username + "</h3>");
  }

  for (var i = 0; i < repos.length; i++) {
    var title = repos[i][0];
    var description = repos[i][1];
    var language = repos[i][2];
    if(description === null){
      description = "";
    }
    $('#user-repos').append("<br><div class='col-md-11 well'><h4>" + title + "</h4><h5 class='bold'>Language: "+ language + "</h5><h5>" + description + "</h5></div>");
  }
};

$(document).ready(function() {
  var newGithub = new Github();
  $('#form').submit(function(event) {
    event.preventDefault();
    var username = $('#username').val();
    newGithub.getUser(username, displayUser);
  });
});

},{"./../js/api.js":2}]},{},[3]);
