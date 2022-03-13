// Imports
importScripts('js/sw-utils.js');

// Creamos unas constantes con los tipos de cache que vamos a manejar
const STATIC_CACHE    = 'static-v2';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

// Creamos nuestros arreglos con la información que queremos guardar en el cache static y el inmutable
const APP_SHELL = [
    // Ajustamos el / ya que no va a servir en producción
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    //'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

// Agregamos los elementos a nuestro cache static e inmutable cuando se realice la instalación del SW
self.addEventListener('install', e => {

    const cacheStatic = caches.open( STATIC_CACHE ).then(cache => 
        cache.addAll( APP_SHELL ));

    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => 
        cache.addAll( APP_SHELL_INMUTABLE ));

    // Espereramos y obligamos a que las promesas se ejecuten
    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]) );

});

// Creamos un evento para que cada vez que yo cambie el SW me borre los caches anteriores
self.addEventListener('activate', e => {

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );

});

self.addEventListener('fetch', e => {

    const respuesta = caches.match( e.request ).then( res =>{

        if( res ){
            return res;
        }
        else{
            
            // Implementamos la estrategia de dynaic cache (network fallback)
            return fetch( e.request ).then( newRes =>{

                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );

            });

        }

    });

    e.respondWith( respuesta );

});