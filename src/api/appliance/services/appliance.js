'use strict';

/**
 * appliance service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::appliance.appliance');
