define([
    './services/queryService',
    './services/renderer',
    './services/resources',
    './services/utilsService'
], function(queryService, renderer, resources, utilsService)
{
    const btnWebSearch = document.getElementById('btn-web-search');
    const btnImageSearch = document.getElementById('btn-image-search');

    const queryStringInput = document.getElementById('query-string');
    const btnSearch = document.getElementById('btn-search');

    const containerWebSearch = document.getElementById('web-search-container');
    const containerWebSeachList = document.getElementById('web-search-container-list');
    
    const containerImageSearch = document.getElementById('images-search-container');

    const referenceNodePagination = document.getElementById('pagination-prev');
    const paginationPrevButton = document.getElementById('pagination-prev');
    const paginationNextButton = document.getElementById('pagination-next');
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
        * If enter key is pressed trigger the search
        */
        queryStringInput.addEventListener('keyup', (e) => {
            if (e.keyCode === 13) {
                triggerSearch();
            }
        });

        /**
        * Performs a wheter a web or image query search depending on which button is active
        */
        btnSearch.addEventListener('click', () => {
            triggerSearch();
        });

        /**
        * Performs a web query search and initializes the current page. Also updates styles
        */
        btnWebSearch.addEventListener('click', () => {
            containerWebSearch.classList.remove('hidden');
            containerImageSearch.classList.add('hidden');

            btnWebSearch.classList.add('active');
            btnImageSearch.classList.remove('active');      
            currentPage = 0;
            searchQuery(false);  
            
        });

        /**
        * Performs a images query search and nitializes the current page. Also updates styles
        */
        btnImageSearch.addEventListener('click', () => {
            containerWebSearch.classList.add('hidden');
            containerImageSearch.classList.remove('hidden');

            btnWebSearch.classList.remove('active');
            btnImageSearch.classList.add('active');
            currentPage = 0; 
            searchQuery(true);
             
        });

        /**
        * Add event to next button to go to next page on web results
        */
        paginationNextButton.addEventListener('click', (e) => {
            e.preventDefault();
            //only 10 page due free API restrictions
            if (currentPage < 9) {
                ++currentPage;
                searchQuery(false);
            }
        });

        /**
        * Add event to prev button to go to previous page on web results
        */
        paginationPrevButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage && containerWebSearch.innerHTML.length) {
                --currentPage;
                searchQuery(false);
            }
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
    * Performs a new query 
    */
    function triggerSearch() {
            let isImg = !containerImageSearch.classList.contains('hidden');
            
            //when requesting a new image search empty its container
            if (isImg) {
                containerImageSearch.innerHTML = '';
            }
            currentPage = 0;
            searchQuery(isImg);
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
                        }).catch(function(error) {
                            /**
                             * Error handling
                             */
                            let errorMessage = error.message;

                            if (!errorMessage) {
                                errorMessage = 'An error occurred, please try again later';
                            }

                            if (isImg) {
                                renderer.renderError(containerImageSearch, errorMessage);
                            } else {
                                renderer.renderError(containerWebSeachList, errorMessage);
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
        if (lastImage && utilsService.isElementInViewport(lastImage)) {
            ++currentPage;
            window.removeEventListener('scroll',  scrollImages);
            lastImage.removeAttribute('id');
            searchQuery(true);    
        }
    }

});
