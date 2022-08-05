const Twit = require('twit');

var images = require('./images.json');

const path = require('path');

const fs = require('fs');

require('dotenv').config();

const Bot = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});


function tweet(){
    var totalImages = 0;
    var rng = Math.ceil(Math.random()*totalImages);
    var chosenImage = `${images[rng].pic}`;
    message = chosenImage
    console.log(message)
    Bot.post('statuses/update', {status: message}, function(error, tweet, response) {
        if (error) {
            console.log("ih bicho deu erro: ", error.message);
        };
    });
}


function randomFromArray( images ){
    return images[Math.floor( Math.random() * images.length )];
}


function tweetImage(){
    fs.readdir( __dirname + '/images', function( err, files ) {
        if ( err ){
            console.log( 'error:', err );
        }

        else {
            let images = [];
            files.forEach(function( f ){
                images.push( f );
            });
            const imagePath = path.join( __dirname, '/images/' + randomFromArray( images ) ),
                b64content = fs.readFileSync( imagePath, { encoding: 'base64' } );
    
            console.log( 'random image:', imagePath );

            Bot.post( 'media/upload', { media_data: b64content }, function ( err, data, response ) {
                if ( err ){
                console.log( 'error:', err );
                }
                else {
                    const image = data;
                    console.log("Imagem carregada");

                    Bot.post("media/metadata/create", {
                        media_id: image.media_id_string,
                    }, 
                    
                    function( err, data, response ) {
                        console.log('Enviando imagem');
            
                        Bot.post("statuses/update", {
                            media_ids: [image.media_id_string]
                        },

                            function( err, data, response) {
                                if (err){
                                    console.log( 'error:', err );
                                }
                            else {
                                console.log("Imagem postada!");
                            }
                        });
                    });
                }
            });    
        };
    });
}

tweetImage();
