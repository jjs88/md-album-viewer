
(function(global) {


    $.ajax('photos.json',{


        success:function(data, status) {


            var nums = generateRandomNums();
            var photos = getPhotos(nums, data);
            console.log(photos);
            let html = createTemplate('#photo-template', photos);

            $(document.body).append(html);

            events(); //bind events after the template injection to the DOM

        }
    });

    Handlebars.registerPartial('photo', photoPartial());



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



    function photoPartial() {

        let partial = `
            <div class="photo">
                <img src="{{thumbnailUrl}}">
                <h3 class="title"> {{title}}</h3>
            </div>
        `

        partial = partial.trim();
        
        return partial;
    }


    function createTemplate(input, data) {
        let templateStr = $(input).html(); //create string
        let template = Handlebars.compile(templateStr); //create template

        return template({data:data}); //return html with injected data
    }


    var currentPic;
    
    function events() {

        var photos = document.getElementsByClassName('photos')[0];
        console.log(photos);
    
        photos.addEventListener('click', function(e) {
            e.preventDefault();

            if(e.target.classList.contains('photo')) { //only expand if the photo DIV is clicked

                if(currentPic) { //if there is an expanded pic, remove the class and store the current selected pic and add class
                    currentPic.classList.remove('expandPhoto');
    
                    currentPic = e.target;
                    e.target.classList.add('expandPhoto');
    
                } else { //first time being clicked, store DOM element and add photo class
                    currentPic = e.target;
                    e.target.classList.add('expandPhoto');
                }
            }
        })
    }











})(window);