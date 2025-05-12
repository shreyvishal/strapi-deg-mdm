'use strict';

/**
 * der service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::der.der');
