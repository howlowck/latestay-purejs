require('es6-promise').polyfill();
require('whatwg-fetch');
require('closest-polyfill');
require('classlist-polyfill');

var Delegate = require('dom-delegate').Delegate;
var listItem = require('application-temp');
var Helper = require('./Helper');

var baseurl = 'http://latestayapp.com/';

if (window.location.host === 'latestayapp.com') {
    baseurl = '/';
}

var url = baseurl + 'applications/';
var req = fetch(url).then(function (res) {return res.json();});

appsContainer = document.querySelector('ul#applications');

req.then(function (json) {
   json.data.forEach(function (item) {
       var id = item.id;
       item.created = Helper.fromNow(new Date(item.created_at));
       var text = listItem(item);
       console.log(text);
       var el = Helper.parseHTML(text);
       appsContainer.appendChild(el);
       el.classList.remove('removed');
   });
});

function approveApplication(evt) {
    var button = this;
    var parent = this.closest('.application');
    var id = parent.getAttribute('data-id');
    var actions = parent.querySelector('.actions');
    
    fetch(url + id + '/approve', {method: 'put'})
     .then(function (res) {
        parent.classList.remove('unprocessed');
        parent.classList.add('approved');
        parent.querySelector('.status').innerText = 'Approved';
        parent.querySelector('.action-bar').removeChild(actions);
     });
}

function denyApplication(evt) {
    var button = this;
    var parent = this.closest('.application');
    var id = parent.getAttribute('data-id');
    var actions = parent.querySelector('.actions');
    
    fetch(url + id + '/deny', {method: 'put'})
     .then(function (res) {
        parent.classList.remove('unprocessed');
        parent.classList.add('denied');
        parent.querySelector('.status').innerText = 'Denied';
        parent.querySelector('.action-bar').removeChild(actions);
     });
}

function deleteApplication(evt) {
    var button = this;
    var parent = this.closest('.application');
    var id = parent.getAttribute('data-id');
    var actions = parent.querySelector('.actions');
    
    fetch(url + id, {method: 'delete'})
     .then(function (res) {
        parent.classList.add('removed');
        setTimeout(function () {
            appsContainer.removeChild(parent);
        }, 500);
     });
}

function addApplication(evt) {
    fetch(baseurl + 'addrandom').then(function (res) {return res.json()})
        .then(function (json) {
            var item = json.data;
            var id = item.id;
            item.created = Helper.fromNow(new Date(item.created_at));
            var el = Helper.parseHTML(listItem(item));
            console.log(el);
            appsContainer.insertBefore(el, appsContainer.firstChild);
            setTimeout(function () {
                el.classList.remove('removed');
            }, 1);
        });
}

var delegateContainer = new Delegate(appsContainer);
delegateContainer.on('click', 'button.approve', approveApplication);
delegateContainer.on('click', 'button.deny', denyApplication);
delegateContainer.on('click', 'button.delete', deleteApplication);
document.querySelector('#add').addEventListener('click', addApplication);