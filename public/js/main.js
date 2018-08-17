'use strict';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('../service-worker.js').then(function (registration) {
      return console.log('Service Worker Registered');
    }).catch(function (err) {
      return console.log('Service worker faild:', err);
    });
  });
}
var hej = 'zuuuup';