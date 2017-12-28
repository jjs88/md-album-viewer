
var Photos = (function() {

    // private vars
    var currentPic, photos, albums, currentThumbnail;


    // main functions

    function displayData(template, photos) {

        let html = createTemplate(template, photos);

        $(document.body).append(html);
             
    }


    function retrieveData(url) {

        let promise = new Promise(function(resolve, reject) {
            $.ajax(url, {

                success: function(data, status) {
                    resolve(data);
                }
            })
        })

        return promise;
    }



    function generateRandomNums() {

        let numbers = [];

        for(var x=0; x < 20; x++) {
            numbers.push(Math.floor(Math.random() * 500) * 1);
        }

        return numbers;
    }


    function getPhotos(randomNums, pics) {

        let photos = [];

        randomNums.forEach(function(num) {
            photos.push(pics[num]);
        })

        return photos;
    }


    function orderByAlbum(albums, photos) {

        let newPhotos = [];

        // console.log("length", albums.length);

        for(var x = 0; x < albums.length; x++) { //cycle through albums

            // console.log(albums[x]);

            let counter = 0;
            let coverUsed = true;
            let album = {};

            album.photos = [];
            album.coverImg;
            album.title = albums[x].title;

            for(var y = 0; y < photos.length; y++) { //cycle through photos

                
                if(albums[x].id === photos[y].albumId) {

                    // console.log("photos", photos[y]);
                    // console.log("album", albums[x].id)
        
                    
                    // use first img as the cover img for the album
                    if(coverUsed) {
                        album.coverImg = photos[y].url;
                        coverUsed = false;
                    } else {

                        let arr = [];
                        arr["thumb"] = photos[y].thumbnailUrl;
                        arr["url"] = photos[y].url;
                        // album.photos.push([photos[y].thumbnailUrl, photos[y].url]);
                        album.photos.push(arr);
                    }

                    if(counter === 12) {
                        break;
                    }

                    counter++;
                    
                }
            }

            newPhotos.push(album);
        }


        //sort the photos by album
        newPhotos.sort(function(a, b){

            var album1=a.title.toLowerCase(), 
                album2=b.title.toLowerCase()

            if (album1 < album2) //sort string ascending
                return -1 
            if (album1 > album2)
                return 1
            return 0 //default return value (no sorting)
        })


        return newPhotos;      
    }


    function clickAlbum(e) {

        e.preventDefault();

        if(e.target.classList.contains('album')) { //only expand if the photo DIV is clicked


            if(currentPic) { //if there is an expanded pic, remove the class and store the current selected pic and add class
                currentPic.classList.remove(removeCorrectExpandPhotoClass());

                toggleThumbnails(e.target, currentPic);

                currentPic = e.target;
                e.target.classList.add(getCorrectExpandPhotoClass());

            } else { //first time being clicked, store DOM element and add photo class
                currentPic = e.target;
                e.target.classList.add(getCorrectExpandPhotoClass());
                toggleThumbnails(e.target);
            }
        }

        // click control for thumbnails
        if(e.target.classList.contains('thumbnailImg')) {
            // console.log("clicks", e.target);

            e.target.nextElementSibling.classList.remove('hidden');

            if(currentThumbnail) {
                currentThumbnail.classList.remove('expand-album-cover-lg');
                currentThumbnail = e.target.parentNode;
                currentThumbnail.classList.add('expand-album-cover-lg');
            } else {
                console.log('works');
                currentThumbnail = e.target.parentNode;
                currentThumbnail.classList.add('expand-album-cover-lg')
            }
        }

        // click control for exit on thumbnail
        if(e.target.classList.contains('exit')) {

            e.target.classList.add('hidden');
            e.target.parentNode.classList.remove('expand-album-cover-lg');
        }
    }

    function exitThumbnail(e) {
        
    }



    function toggleThumbnails(current, last) {

        if(last) {
            last = Array.from(last.children);
            last.forEach(function(thumbnail) {
                thumbnail.classList.add('hidden');
            });
        }

        current = Array.from(current.children);
        current.forEach(function(thumbnail) {
            thumbnail.classList.remove('hidden');
        });
    }


    function getCorrectExpandPhotoClass() {

        // console.log(window.innerWidth)
        if( window.innerWidth >= 534 && window.innerWidth < 1117) {
            return 'expandPhoto-mid'
        } else if (screen.width >= 1117) {
            return 'expandPhoto-lg'
        } else {
           return 'normal';
        }
    }


    function removeCorrectExpandPhotoClass() {
        if(currentPic.classList.contains('expandPhoto-mid')) {
            return 'expandPhoto-mid';
        } else if (currentPic.classList.contains('expandPhoto-lg')){
            return 'expandPhoto-lg';
        } else {
            return "normal";
        }
    }


    function addCoverImg(photos) {

        // console.log(photos)
        
        photos = Array.from(photos);

        // console.log(photos);

        photos.forEach(function(photo) {
            // console.log(photo.getAttribute('data-coverImg'));
            photo.style.backgroundImage = `url(${photo.getAttribute('data-coverImg')}`;
        })
    }



    Handlebars.registerHelper('albumSongPics', function (context, options) {

        var out = "";
        for (var i = 0, ii = context.length; i < ii; i++) {


            out += `<div class="thumbnail hidden"> <img src="${options.fn(context[i])}" class="thumbnailImg"> <span class="exit hidden">X</span></div>`;

            // out += `<img src="${options.fn(context[i])}" class="thumbnail thumbnail-hidden"  <span class="exit">X</span>`;
        }

        return out;

    });



    function createTemplate(input, albums) {
        let templateStr = $(input).html(); //create string
        let template = Handlebars.compile(templateStr); //create template

        return template({albums:albums}); //return html with injected data
    }









    // CONFIG FUNCTIONS
    function init() {

        
        let promises = [retrieveData('albums.json'), retrieveData('photos.json')]; //retrieve both data sources

        Promise.all(promises).then(function(data) { //first is albums, second is photos

            let nums = generateRandomNums();
            let photos = getPhotos(nums, data[1]);

            // console.log(data[0]);
            // console.log(photos);
            // console.log(data[1]);
            // console.log(data[0][1])


            var test = [
                data[0][0],
                data[0][1],
                data[0][2],
                data[0][3],
                data[0][4],
                data[0][5]
            ] //needs to be wrapped in an array


            let orderedPhotos = orderByAlbum(data[0], data[1]);

            // console.log(orderedPhotos[0].photos[0].thumb);
            // console.log(orderedPhotos);

        

            displayData('#album-template',orderedPhotos);
            addCoverImg(document.getElementsByClassName('album'));
            cacheDOM();
            events();
        })    
    }


    function cacheDOM() {

        photos = document.getElementsByClassName('albums')[0];

    }


    function events() {

        photos.addEventListener('click', clickAlbum);

    }





    // expose module API methods
    return {
        init
    }

})();