// Este es un archivo auxiliar del SW que nos va a permitir
// pasar o trasladar cierta lógica acá.

// Función para guardar en el cache dinamico
function actualizaCacheDinamico( dynamicCache, req, res ) {

    if ( res.ok ){

        return caches.open( dynamicCache ).then( cache => {

            // Almacenamos la request
            cache.put( req, res.clone() );
            return res.clone();

        });

    }
    else{

        return res;

    }

}