'use strict';

/**
 * transformer router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::transformer.transformer');
