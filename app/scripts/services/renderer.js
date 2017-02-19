/**
 * A module to render the queries in to the DOM
 * @module renderer
 */
define([], function()
{
    var renderer = {};

    /**
     * Renders web results from a query
     * @param {Object[]} results - the results from the query performed
     * @param {HTMLElement} containerWebSearch - the container where the results are displayed
     */
    renderer.renderWebResults = ((results, containerWebSearch) => {
        let resultsList = document.createElement('ul');
        let resultElement, paragraphElement, anchorElement, commentElement;
        
        /** Empty the container  */
        containerWebSearch.innerHTML = '';

        /** Create all results elements and append them in to the container */
        for (let result of results) {
            resultElement = document.createElement('li');
            
            //add title
            anchorElement = document.createElement('a');
            anchorElement.setAttribute('href', result.link);
            anchorElement.textContent = result.title;
            resultElement.appendChild(anchorElement);
           
            //add link
            paragraphElement = document.createElement('p');
            paragraphElement.textContent = result.link;
            resultElement.appendChild(paragraphElement);

            //add comment
            commentElement = document.createElement('div');
            commentElement.innerHTML = result.snippet;
            resultElement.appendChild(commentElement);

            resultsList.appendChild(resultElement);
        }
        /** Append the results to the container  */
        containerWebSearch.appendChild(resultsList);
    });
    
    /**
     * Renders the paginator used to navigate through the web results
     * @param {number} currentPage - the current page number to calculate the paginator bits needed
     * @param {HTMLElement} referenceNode - the node used as reference to insert the new paginator number nodes 
     */
    renderer.renderPaginator = ((currentPage, referenceNode) => {
        
        /** an array which represents the paginator values from 1 to 10  */
        let arrayPages = _.range(10).map(e => e+1);

        /** initialPage represent the first paginator number */
        let initialPage,
             pageNumberElement,liElement;

        /** Due free google API limitations the last page will be 10
         * so that the greatest first number will be 5
        */
        if (currentPage > 5) {
            initialPage = 5;
        } else if (currentPage < 3) {
                initialPage = 0;
        } else {
            initialPage = currentPage - 2;
        }

        /** the paginator has 5 numbers, so the array which represents it */
        arrayPages = arrayPages.splice(initialPage, 5);
        /** Reverse array to ease the insertion to the dom as the will be appended before the next page button */
        arrayPages = _.reverse(arrayPages);

        /** Remove all the old paginator numbers */
        let nodesToRemove = document.getElementsByClassName('paginator-page');   
        while (nodesToRemove[0]) {
                nodesToRemove[0].parentNode.removeChild(nodesToRemove[0]);
        }
        
        /** Create all numbers elements and insert them in to the paginator container before the next button */
        for (let page of arrayPages) {
            pageNumberElement = document.createElement('a');
            pageNumberElement.setAttribute('href', '#');
            pageNumberElement.classList.add('paginator-page');
            pageNumberElement.textContent = page;

            /** To avoid to scroll all the way to the top when clicking by preventing the default behaviour */
            pageNumberElement.addEventListener('click', (e) => {
                e.preventDefault();
            });

            liElement = document.createElement('li');
            liElement.appendChild(pageNumberElement);

            /** Add active class to the current page */
            if (currentPage === page -1) {
                liElement.classList.add('active');
            }

            /** Insert before the next button */
            referenceNode.parentNode.insertBefore(liElement,referenceNode.nextSibling);
        }
    });


    /**
     * Renders image results from a query
     * @param {Object[]} results - the results from the query performed
     * @param {HTMLElement} containerWebSearch - the container where the results are displayed
     */
    renderer.renderImageResults = ((results, containerImageSearch) => {
        let resultElement, figureElement, figcaptionElement, imgElement;
        
        for (let result of results) {
            resultElement = document.createElement('a');
            resultElement.setAttribute('href', result.link);
            resultElement.setAttribute('target', '_blank');
            figureElement = document.createElement('figure');

            figcaptionElement = document.createElement('figcaption');
            figcaptionElement.textContent = result.title;

            imgElement = document.createElement('img');
            imgElement.setAttribute('src', result.image.thumbnailLink);

            figureElement.appendChild(imgElement);
            figureElement.appendChild(figcaptionElement);

            resultElement.appendChild(figureElement);
            containerImageSearch.appendChild(resultElement);
        }
        /** Add id value to the last img element to control the dynamic loading of images when scrolling */
        resultElement.setAttribute('id', 'last-image');
    });
    

    return renderer;

});