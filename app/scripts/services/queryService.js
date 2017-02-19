/**
 * A module to retrieve queries via ajax
 * @module queryServices
 */
define(['./resources'], function(resources)
{
    var queryService = {};

    /**
     * Performs a query to Google API
     * @param {string} query - the query string to search
     * @param {Boolean} isImage - indicates whether the query type is image or not
     * @param {number} page - the page number to calculate the start param
     * @returns {Promise}
     */
    queryService.searchByGoogleAPI = ((query, isImage, page) =>
    {
        return new Promise((resolve, reject) => {
            let xmlHttp = new XMLHttpRequest();
            let queryString = resources.googleAPISearch + query;
            
            /** If page is greater than 0 the start record for the query is calculate 
            *   Since the free api is limited to 100 records the values for start will be 11,21...91
            */
            if (page) {
                queryString = queryString.concat('&start=' + (page*10 + 1));
            }
            
            /** Adds search type image if applies */
            if (isImage) {
                queryString = queryString.concat('&searchType=image');
            }
            
            xmlHttp.open('GET', queryString);
            xmlHttp.onload = (() => {
                if (xmlHttp.status === 200) {
                    resolve(xmlHttp.response);
                } else {
                    reject(new Error(xmlHttp.statusText));
                }
            });

            xmlHttp.onerror = () => {
                reject(new Error('A network error occurred'));
            }
            

            xmlHttp.send();
        });
        

    });
    return queryService;

});
