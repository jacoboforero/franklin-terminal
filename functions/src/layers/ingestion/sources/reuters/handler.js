/**
 * Reuters API Handler
 *
 * Handles data retrieval from Reuters API.
 * Reuters provides structured JSON data with comprehensive news coverage.
 */

const { transformToStandardFormat } = require("../data-schema");

class ReutersHandler {
  /**
   * SKELETON METHOD
   * Fetch raw data from Reuters API or RSS.
   *
   * TODO: Implement Reuters API or RSS fetch logic here.
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
   * Transform raw Reuters data to standardized format.
   *
   * TODO: Map Reuters fields to standardized format using transformToStandardFormat.
   *       See data-schema.js for required fields.
   *
   * @param {Object} rawArticle - Raw Reuters article
   * @returns {Object} Standardized article
   */
  transform(rawArticle) {
    // SKELETON: No field mapping yet. This is a template call.
    return transformToStandardFormat(rawArticle, "Reuters");
  }
}

module.exports = ReutersHandler;
