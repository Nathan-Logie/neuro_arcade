const axios = require('axios');
/**
 * This file contains functions that request or upload data from/to the backend
 */

/**
 * Requests the data associated with a game.
 *
 * @param {string} gameName
 *
 * @return response data
 *
 * @throws Error when the request is rejected.
 */
export function requestGame(gameName) {
    let url = '/games/' + gameName + '/data/'
    axios.get(url)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(error);
            throw error;
        })
}

/**
 * Requests a list of all available GameTags.
 *
 * @throws Error when the request is rejected.
 */
export function requestGameTags() {
    const url = '/tags/';
    axios.get(url)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(error);
            throw error;
        })
}

/**
 * Requests a sorted list of games.
 *
 * @param query instance of Reacts URLSearchParams, which you should get from useSearchParams()
 */
export function requestGamesSorted(query) {
    const url = '/tags/';
    axios.get(url)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(error);
            throw error;
        })
}

/**
 * Posts a Score table row for a specific game.
 * Example scoreData: {"player":7,"Points":355,"Time":120}
 * for a Game with Points and Time Score headers.
 *
 * @param gameName - name of the game.
 * @param scoreData - scores to upload to the server. Also needs to have a player field
 *
 * @throws Error when the request is rejected.
 */
export function postGameScore(gameName, scoreData) {
    let url = '/games/' + gameName + '/data/'
    axios.post(url, scoreData)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
            throw error;
        });
}
