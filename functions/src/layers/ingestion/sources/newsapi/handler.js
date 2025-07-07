/**
 * NewsAPI Handler
 *
 * Handles data retrieval from NewsAPI.
 * NewsAPI provides easy integration with good categorization.
 */

const { transformToStandardFormat } = require("../data-schema");

class NewsAPIHandler {
  /**
   * SKELETON METHOD
   * Fetch raw data from NewsAPI.
   *
   * TODO: Implement NewsAPI fetch logic here.
   *       Return an array of raw article objects.
   *
   * @returns {Promise<Array<Object>>} Array of raw articles
   */
  async fetchRawArticles() {
    // SKELETON: No implementation yet.
    return [];
  }

  /**
   * SKELETON METHOD
   * Transform raw NewsAPI data to standardized format.
   *
   * TODO: Map NewsAPI fields to standardized format using transformToStandardFormat.
   *       See data-schema.js for required fields.
   *
   * @param {Object} rawArticle - Raw NewsAPI article
   * @returns {Object} Standardized article
   */
  transform(rawArticle) {
    // SKELETON: No field mapping yet. This is a template call.
    return transformToStandardFormat(rawArticle, "NewsAPI");
  }
}

module.exports = NewsAPIHandler;
