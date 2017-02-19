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

    let currentPage = 0;
    let referenceNodePagination = document.getElementById('pagination-prev');
    
    addEvents();



    function addEvents() {

        btnWebSearch.addEventListener('click', () => {
            containerWebSearch.classList.remove('hidden');
            containerImageSearch.classList.add('hidden');

            btnWebSearch.classList.add('active');
            btnImageSearch.classList.remove('active');      

            searchQuery(false);  
            currentPage = 0;
        });


        btnImageSearch.addEventListener('click', () => {
            containerWebSearch.classList.add('hidden');
            containerImageSearch.classList.remove('hidden');

            btnWebSearch.classList.remove('active');
            btnImageSearch.classList.add('active');

            searchQuery(true);
            currentPage = 0;  
        });

        btnSearch.addEventListener('click', () => {
            let isImg = !containerImageSearch.classList.contains('hidden');
            if (isImg) {
                containerImageSearch.innerHTML = '';
            }

            searchQuery(isImg);
            currentPage = 0;
        });

        document.getElementById('pagination-next').addEventListener('click', () => {
            ++currentPage;
            searchQuery(false);
        });

        document.getElementById('pagination-prev').addEventListener('click', () => {
            --currentPage;
            searchQuery(false);
        });

        document.getElementById('paginator').addEventListener('click', (e) => {
            if (e.target.classList.contains('paginator-page')) {
                currentPage = parseInt(e.target.textContent) - 1;
                searchQuery(false);
            }
        })
    }

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
                                    let lastImage = document.getElementById('last-image');

                                    if (utilsService.isElementInViewport(lastImage)) {
                                        ++currentPage;
                                        lastImage.removeAttribute('id');
                                        searchQuery(true);
                                    } else {
                                        window.addEventListener('scroll',  scrollImages);
                                    }
                                }
                        });
        }
    }

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
