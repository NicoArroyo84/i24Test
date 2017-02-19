/**
 * A module for commmons utilities
 * @module utilsService
 */
define([], function()
{

    var utilsService = {};
    /**
     * Checks if a HTMLElement is visible un the viewport
     * @param {HTMLElement} el - the element to check if it is visible
     * @returns {Boolean} 
     */
    utilsService.isElementInViewport = ((el) => {
        let rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    });
  
    return utilsService;

});