"use strict";
require("dotenv").config({
  silent: true,
});

const fs = require("fs");

function DiscoveryConnection(discoveryClient) {
  this.discoveryClient = discoveryClient;
}

/**
 * Get the assigned Discovery configuration for this collection.
 * @param {Object} params - Discovery params so far. Should include a configuration_id value.
 * @return {Promise} Promise with resolve({enhanced discovery params}) or reject(err).
 */
DiscoveryConnection.prototype.getDiscoveryConfig = function (params) {
  return new Promise((resolve, reject) => {
    this.discoveryClient
      .getConfiguration(params)
      .then((data) => {
        // see if it is valid
        const configuration = data.result;
        console.log(
          "Found existing configuration - name: " + configuration.name
        );
        params.configurationId = null;
        params.default_configuration = configuration;
        return resolve(params);
      })
      .catch((err) => {
        return reject(
          new Error("Failed to get default Discovery configuration.")
        );
      });
  });
};

/**
 * Get the default Discovery configuration for use as a template to create new one.
 * @param {Object} params - Discovery params so far. Enough to get configurations.
 * @return {Promise} Promise with resolve({enhanced discovery params}) or reject(err).
 */
DiscoveryConnection.prototype.getDefaultDiscoveryConfig = function (params) {
  return new Promise((resolve, reject) => {
    // no need to continue if we already found our keyword extraction config
    if (params.configurationId) {
      return resolve(params);
    }

    // use default one as a base to update
    params.configurationId = params.default_config_id;
    this.discoveryClient.getConfiguration(params, (err, data) => {
      if (err) {
        console.error(err);
        return reject(
          new Error("Failed to get default Discovery configuration.")
        );
      } else {
        // unset configuration_id so we know that we still need to create one
        params.configurationId = null;
        // save off configuration so we can use it as a template for new one
        params.default_configuration = data;
        return resolve(params);
      }
    });
  });
};

/**
 * Find the Discovery environment specified by DISCOVERY_ENVIRONMENT_ID
 * and validate it or error out.
 * @return {Promise} Promise with resolve({environment}) or reject(err).
 */
DiscoveryConnection.prototype.findDiscoveryEnvironment = function (params) {
  return new Promise((resolve, reject) => {
    this.discoveryClient
      .listEnvironments(params)
      .then((listEnvironmentsResponse) => {
        const environments = listEnvironmentsResponse.result.environments;
        const requiredEnvId = process.env.DISCOVERY_ENVIRONMENT_ID;

        for (let i = 0, size = environments.length; i < size; i++) {
          const environment = environments[i];
          if (requiredEnvId === environment.environment_id) {
            console.log("Found Discovery environment.");
            params.environmentId = environment.environment_id;
            return resolve(params);
          }
        }
        return reject(
          new Error(
            "Configured DISCOVERY_ENVIRONMENT_ID=" + validateID + " not found."
          )
        );
      })
      .catch((err) => {
        console.log(err);
        return reject(new Error("Failed to get Discovery environments."));
      });
  });
};

/**
 * Find the Discovery collection specified by DISCOVERY_COLLECTION_ID
 * and validate it or error out.
 * @param {Object} params - Object discribing the existing environment.
 * @return {Promise} Promise with resolve({discovery params}) or reject(err).
 */
DiscoveryConnection.prototype.findDiscoveryCollection = function (params) {
  return new Promise((resolve, reject) => {
    this.discoveryClient
      .listCollections(params)
      .then((data) => {
        const requiredCollectionId = process.env.DISCOVERY_COLLECTION_ID;
        const collections = data.result.collections;
        for (let i = 0, size = collections.length; i < size; i++) {
          const collection = collections[i];
          if (requiredCollectionId === collection.collection_id) {
            console.log("Found Discovery collection.");
            console.log(collection);
            params.collection_name = collection.name;
            params.collectionId = collection.collection_id;
            params.configurationId = collection.configuration_id;
            return resolve(params);
          }
        }
        return reject(
          new Error(
            "Configured DISCOVERY_COLLECTION_ID=" +
              requiredCollectionId +
              " not found."
          )
        );
      })
      .catch((err) => {
        return reject(new Error("Failed to get Discovery collections."));
      });
  });
};

/**
 * Load the Discovery collection if it is not already loaded.
 * The collection should already be created/validated.
 * Currently using lazy loading of docs and only logging problems.
 * @param {Object} params - All the params needed to use Discovery.
 * @return {Promise}
 */
DiscoveryConnection.prototype.loadDiscoveryCollection = function (params) {
  return new Promise((resolve, reject) => {
    console.log("Get collection to check its status.");
    this.discoveryClient.getCollection(params).then((res) => {
      if (res.status !== 200) {
        console.log(res.statusText);
        return reject(err);
      } else {
        var data = res.result;
        console.log(
          "Checking status of Discovery collection:",
          data.document_counts
        );
        const numDocsLoaded =
          data.document_counts.available +
          data.document_counts.processing +
          data.document_counts.failed;

        if (typeof params.checkedForExistingDocs === "undefined") {
          // first time through settings
          params.checkedForExistingDocs = false;
          params.docsAlreadyLoaded = false;
          params.numDocs = params.documents.length;
        }
        params.docsUploaded = 0;

        if (!params.checkedForExistingDocs && numDocsLoaded > 0) {
          params.docsAlreadyLoaded = true;
          params.checkedForExistingDocs = true;
          console.log("Collection is already loaded with docs.");
          resolve(params);
        } else {
          // process the current chunk of documents
          const endIdx = params.numDocs;
          params.checkedForExistingDocs = true;

          console.log("Loading documents into Discovery collection.");
          for (let i = 0; i < endIdx; i++) {
            const doc = params.documents[i];
            console.log("doc[" + i + "]: " + doc);
            var file = fs.readFileSync(doc);

            this.discoveryClient
              .addDocument({
                environmentId: params.environmentId,
                collectionId: params.collectionId,
                file: file,
                filename: doc,
              })
              .then((res) => {
                params.docsUploaded += 1;
                if (res.status !== 202) {
                  // we got an error on this one doc, but keep loading the rest
                  console.log("Add document error:");
                  console.error(res.statusText);
                } else {
                  console.log(
                    "[" +
                      (i + 1) +
                      "] Added document: " +
                      res.result.document_id
                  );
                }
                if (params.docsUploaded === params.numDocs) {
                  console.log("All documents uploaded to Discovery.");
                }
              });
          }
        }
      }
    });
  });
};

/**
 * Validate and setup the Discovery service.
 */
DiscoveryConnection.prototype.setupDiscovery = function (
  setupParams,
  callback
) {
  this.findDiscoveryEnvironment(setupParams)
    .then((environment) => this.findDiscoveryCollection(environment))
    .then((params) => this.getDiscoveryConfig(params))
    .then((params) => callback(null, params))
    .catch(callback);
};

DiscoveryConnection.prototype.loadDiscoveryData = function (
  collectionParams,
  callback
) {
  this.loadDiscoveryCollection(collectionParams)
    .then((params) => callback(null, params))
    .catch(callback);
};

/**
 * Manage the flow of files being added to the Discovery collection.
 */
DiscoveryConnection.prototype.loadCollectionFiles = function (params) {
  return new Promise((resolve, reject) => {
    this.loadDiscoveryData(params, (err, data) => {
      if (err) {
        this.handleSetupError(err);
        console.log(err);
        return reject(err);
      } else {
        var collectionParams = data;
        if (
          !collectionParams.docsAlreadyLoaded &&
          collectionParams.docCurrentIdx < collectionParams.numDocs
        ) {
          this.loadCollectionFiles(collectionParams);
        } else {
          console.log("Discovery collection loading has completed!");
          resolve(params);
        }
      }
    });
  });
};

/**
 * Handle setup errors by logging and exiting.
 * @param {String} reason - The error message for the setup error.
 */
DiscoveryConnection.prototype.handleSetupError = function (reason) {
  console.error("The app failed to initialise properly. " + reason);
  // Abort on a setup error allowing IBM Cloud to restart it.
  console.error("\nAborting due to setup error!");
  process.exit(1);
};

module.exports = DiscoveryConnection;
