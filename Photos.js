
var Photos = (function() {

    // private vars
    var currentAlbum, photos, currentThumbnail, pages;


    // main functions

    function displayData(template, albums) {

        let html = createTemplate(template, albums);

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


    function createTemplate(input, albums) {
        let templateStr = $(input).html(); //create string
        let template = Handlebars.compile(templateStr); //create template

        return template({albums:albums}); //return html with injected data
    }


    function pagination(albums) {
        

        let pages = [1];
        let page = 1;
        let perPage = 6;
        let pageCnt = 0;
        let albumsLength = albums.length;


        albums.forEach(function(album) {

            if(pageCnt === perPage) { //reset for next page
                pageCnt = 1;
                page++;
                album.page = page; //set current album to the new page
                pages.push(page);

            } else { //same page
                album.page = page; //put page on the album object. will get injected using handlebars as data-page={{page}}
                pageCnt++;
            }
        })


        // createPages(pages);

        return pages;

        //return pages and then run createPages after the dom injection

    }


    function createPages(input) {

        let pages = document.getElementsByClassName('pages')[0];

        let element;
        let text;

        input.forEach(function(page) {
            element = document.createElement('div');
            element.classList.add('page');
            text = document.createTextNode(page);
            
            element.appendChild(text);
            pages.appendChild(element);
        })

    }


    function orderByAlbum(albums, photos) {

        let newAlbums = [];
        let page;
        let albumCounter = 0;

        for(var x = 0; x < albums.length; x++) { //cycle through albums

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

            newAlbums.push(album);
        }


        //sort the photos by album
        newAlbums.sort(function(a, b){

            var album1=a.title.toLowerCase(), 
                album2=b.title.toLowerCase()

            if (album1 < album2) //sort string ascending
                return -1 
            if (album1 > album2)
                return 1
            return 0 //default return value (no sorting)
        })


        return newAlbums;      
    }


    function clickAlbum(e) {

        e.preventDefault();

        if(e.target.classList.contains('album')) { //only expand if the album DIV is clicked


            if(currentAlbum) { //if there is an expanded album, remove the class and store the current selected album and add class
                currentAlbum.classList.remove(removeCorrectExpandPhotoClass());

                toggleAlbum(e.target, currentAlbum);

                currentAlbum = e.target;
                e.target.classList.add(getCorrectExpandPhotoClass());

            } else { //first time being clicked, store DOM element and add album element
                currentAlbum = e.target;
                e.target.classList.add(getCorrectExpandPhotoClass());
                toggleAlbum(e.target);
            }
        }

        // click control for thumbnails
        if(e.target.classList.contains('thumbnailImg')) {

            e.target.nextElementSibling.classList.remove('hidden'); //span class with X

            if(currentThumbnail) {
                currentThumbnail.classList.remove('expand-album-cover-lg');
                currentThumbnail = e.target.parentNode; //thumbnail element
                currentThumbnail.classList.add('expand-album-cover-lg');
            } else {
               
                currentThumbnail = e.target.parentNode;
                currentThumbnail.classList.add('expand-album-cover-lg')
            }
        }

        // click control for exit on thumbnail
        if(e.target.classList.contains('exit')) {

            e.target.parentNode.classList.add('hidden'); //span element on X icon
            e.target.parentNode.parentNode.classList.remove('expand-album-cover-lg'); //album element
        }
    }


    function toggleAlbum(current, last) {

        if(last) {

            last = Array.from(last.children); 

            last.forEach(function(album) { //hide all thumbnails
                album.classList.add('hidden');
            });
        }

        current = Array.from(current.children);
        current.forEach(function(album) {
            album.classList.remove('hidden'); //unhide all thumbnails for current selected album
        });
    }


    function getCorrectExpandPhotoClass() { //get screen width and return proper class for the screen size

        if( window.innerWidth >= 534 && window.innerWidth < 1117) {
            return 'expandPhoto-mid'
        } else if (screen.width >= 1117) {
            return 'expandPhoto-lg'
        } else if (window.innerWidth < 534) {
           return 'normal-size';
        }
    }


    function removeCorrectExpandPhotoClass() { //return class to be removed
        if(currentAlbum.classList.contains('expandPhoto-mid')) {
            return 'expandPhoto-mid';
        } else if (currentAlbum.classList.contains('expandPhoto-lg')){
            return 'expandPhoto-lg';
        } else {
            return "normal-size";
        }
    }


    function addCoverImg(albums) {
        
        albums = Array.from(albums);

        albums.forEach(function(album) {
            // console.log(photo.getAttribute('data-coverImg'));
            album.style.backgroundImage = `url(${album.getAttribute('data-coverImg')}`;
        })
    }



    Handlebars.registerHelper('albumSongPics', function (context, options) {

        var out = "";
        for (var i = 0, ii = context.length; i < ii; i++) {

            out += `<div class="thumbnail hidden"> <img src="${options.fn(context[i])}" class="thumbnailImg"> 
            <span class="hidden"> <i class="exit fa fa-times"></i></span></div>`;

        }

        return out;
    });



    function displayPage(e) {

        e.preventDefault();


        if(e.target.classList.contains('page')) {

            let page = Number(e.target.innerHTML);

            document.querySelectorAll('.album').forEach(function(album) {

                // console.log(album);
                if (Number(album.getAttribute('data-page')) !== page) {
                    album.style.display = 'none';
                } else {
                    album.style.display = 'flex';
                }
            })

        }     
    }


    function displayPageOne(albums) { //display the first page albums on initial load

        albums = Array.from(albums);

        albums.forEach(function(album) {

            // console.log(album);
            if (Number(album.getAttribute('data-page')) !== 1) {
                album.style.display = 'none';
            };
        })
    }





    // CONFIG FUNCTIONS
    function init() {

        
        let promises = [retrieveData('albums.json'), retrieveData('photos.json')]; //retrieve both data sources

        Promise.all(promises).then(function(data) { //first is albums, second is photos


            // var test = [
            //     data[0][0],
            //     data[0][1],
            //     data[0][2],
            //     data[0][3],
            //     data[0][4],
            //     data[0][5]
            // ] //needs to be wrapped in an array


            let orderedAlbums = orderByAlbum(data[0], data[1]);

            //perform pagination (must do before data injection)
            let pages = pagination(orderedAlbums);

            displayData('#album-template',orderedAlbums);
            createPages(pages); //has to run after handlebars injects html template into DOM since .pages won't be available 

            //cache album dom elements
            let albums = document.getElementsByClassName('album');
            addCoverImg(albums);
            displayPageOne(albums);
            cacheDOM();
            events();

        }); 
    }


    function cacheDOM() {

        photos = document.getElementsByClassName('albums')[0];
        pages = document.getElementsByClassName('pages')[0];

    }


    function events() {

        photos.addEventListener('click', clickAlbum);
        pages.addEventListener('click', displayPage);

    }





    // expose module API methods
    return {
        init
    }

    
})();