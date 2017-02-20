define([
    './services/queryService',
    './services/renderer',
    './services/resources',
    './services/utilsService'
], function(queryService, renderer, resources, utilsService)
{

    let btnWebSearch = document.getElementById('btn-web-search');
    let btnImageSearch = document.getElementById('btn-image-search');

    let queryStringInput = document.getElementById('query-string');
    let btnSearch = document.getElementById('btn-search');

    let containerWebSearch = document.getElementById('web-search-container');
    let containerWebSeachList = document.getElementById('web-search-container-list');
    
    let containerImageSearch = document.getElementById('images-search-container');

    let referenceNodePagination = document.getElementById('pagination-prev');
    
    /**
    * integer which represents the value of the current page being zero-based.
    */
    let currentPage = 0;
  
    addEvents();


     /**
     * Add events to HTML elements and change some classes to interact with the user
     */
    function addEvents() {
        /**
        * Performs a web query search and nitializes the current page. Also updates styles
        */
        btnWebSearch.addEventListener('click', () => {
            containerWebSearch.classList.remove('hidden');
            containerImageSearch.classList.add('hidden');

            btnWebSearch.classList.add('active');
            btnImageSearch.classList.remove('active');      

            searchQuery(false);  
            currentPage = 0;
        });

        /**
        * Performs a images query search and nitializes the current page. Also updates styles
        */
        btnImageSearch.addEventListener('click', () => {
            containerWebSearch.classList.add('hidden');
            containerImageSearch.classList.remove('hidden');

            btnWebSearch.classList.remove('active');
            btnImageSearch.classList.add('active');

            searchQuery(true);
            currentPage = 0;  
        });
      
        /**
        * Performs a wheter a web or image query search depending on which button is active
        */
        btnSearch.addEventListener('click', () => {
            let isImg = !containerImageSearch.classList.contains('hidden');
            if (isImg) {
                containerImageSearch.innerHTML = '';
            }

            searchQuery(isImg);
            currentPage = 0;
        });

        /**
        * Add event to next button to go to next page on web results
        */
        document.getElementById('pagination-next').addEventListener('click', () => {
            ++currentPage;
            searchQuery(false);
        });

        /**
        * Add event to prev button to go to previous page on web results
        */
        document.getElementById('pagination-prev').addEventListener('click', () => {
            --currentPage;
            searchQuery(false);
        });
        
        /**
        * Add event to a number button to go to numbered page of the web results
        */
        document.getElementById('paginator').addEventListener('click', (e) => {
            if (e.target.classList.contains('paginator-page')) {
                currentPage = parseInt(e.target.textContent) - 1;
                searchQuery(false);
            }
        })
    }

    /**
    * Performs a query if the query has a value and the page does not exceed the max of page allowed by free Google API
    */
    function searchQuery(isImg) {

        if (queryStringInput.value && (currentPage < resources.maxNumberPages)) {
          queryService.searchByGoogleAPI(queryStringInput.value, isImg, currentPage)
                        .then((r) => JSON.parse(r))
                        .then(function(response) {
                                console.log('resultado   ', response);
                                if (!isImg) {
                                    renderer.renderWebResults(response.items, containerWebSeachList);
                                    renderer.renderPaginator(currentPage, referenceNodePagination);
                                } else {
                                  
                                    renderer.renderImageResults(response.items, containerImageSearch);
                                    /**
                                    * To dynamically load images on scroll the last image will contain an id.
                                    * If this image is visible in the viewport the next 10 images are requested
                                    */
                                    let lastImage = document.getElementById('last-image');

                                    if (utilsService.isElementInViewport(lastImage)) {
                                        ++currentPage;
                                        lastImage.removeAttribute('id');
                                        searchQuery(true);
                                    } else {
                                      /**
                                      * If the las image is not visible the scroll event is added 
                                      */
                                        window.addEventListener('scroll',  scrollImages);
                                    }
                                }
                        });
        }
    }
  
    /**
    * On scrolling check if the last image is visible.
    * When this occurs the next few images are requested and the scroll event  removed
    */
    function scrollImages() {
        let lastImage = document.getElementById('last-image');
        if (lastImage && isElementInViewport(lastImage)) {
            ++currentPage;
            window.removeEventListener('scroll',  scrollImages);
            lastImage.removeAttribute('id');
            searchQuery(true);    
        }
    }

});
