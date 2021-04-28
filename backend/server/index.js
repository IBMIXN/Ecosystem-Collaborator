// https://github.com/IBM/watson-discovery-food-reviews

"use strict";

const {
  handleIndustriesRequest,
  handleSignUp,
  handleDocDelete,
  getDocument,
  handleSearch,
} = require("./lib");
const fs = require("fs");
const path = require("path");

require("dotenv").config({
  silent: true,
});

var cors = require("cors");
const express = require("express");

const DiscoveryConnection = require("../watson_setup/discovery-connection");
const DiscoveryV1 = require("ibm-watson/discovery/v1");
const { IamAuthenticator } = require("ibm-watson/auth");
const app = require("./express");
const { json } = require("express");

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  allowedHeaders: "Content-Type",
  methods: "GET,POST,DELETE",
};

/**
 * Back end server which handles initializing the Watson Discovery
 * service, and setting up route methods to handle client requests.
 */

var discoveryDocs = [];
var arrayOfFiles = fs.readdirSync("./data/");
arrayOfFiles.forEach(function (file) {
  discoveryDocs.push(path.join("./data/", file));
});

var environmentId;
var collectionId;

const DEFAULT_NAME = "ixn-fyp";

var version_date = "2020-11-11";
if (process.env.DISCOVERY_VERSION_DATE !== undefined) {
  // if defined, override with value from .env
  version_date = process.env.DISCOVERY_VERSION_DATE;
}

const api_key = process.env.DISCOVERY_IAM_APIKEY;
const service_url = process.env.DISCOVERY_URL;

const discovery = new DiscoveryV1({
  version: version_date,
  authenticator: new IamAuthenticator({
    apikey: api_key,
  }),
  serviceUrl: service_url,
});

const discoverySetup = new DiscoveryConnection(discovery);
const discoverySetupParams = {
  default_name: DEFAULT_NAME,
  config_name: "ixn-fyp-config", // instead of 'Default Configuration'
};

const WatsonDiscoServer = new Promise((resolve) => {
  discoverySetup.setupDiscovery(discoverySetupParams, (err, data) => {
    if (err) {
      console.log(err);
      discoverySetup.handleSetupError(err);
    } else {
      console.log("Discovery is ready!");
      environmentId = data.environmentId;
      collectionId = data.collectionId;

      var collectionParams = data;

      collectionParams.documents = discoveryDocs;
      console.log(
        "Begin loading " + discoveryDocs.length + " json files into discovery."
      );
      discoverySetup.loadCollectionFiles(collectionParams);
      resolve(createServer());
    }
  });
});

/**
 * createServer - create express server and handle requests
 * from client.
 */
function createServer() {
  const server = require("./express");
  server.use(cors(corsOptions));
  server.use(express.json());

  server.get("/search", (req, res) =>
    handleSearch(req, res, discovery, environmentId, collectionId)
  );

  server.delete("/document/:documentID", (req, res) =>
    handleDocDelete(req, res, discovery, environmentId, collectionId)
  );

  server.get("/document/:offset", (req, res) =>
    getDocument(req, res, discovery, environmentId, collectionId)
  );

  server.post("/signup", (req, res) =>
    handleSignUp(req, res, discovery, environmentId, collectionId)
  );

  server.get("/industries", cors(corsOptions), (req, res) =>
    handleIndustriesRequest(req, res, discovery, environmentId, collectionId)
  );
  return server;
}

module.exports = WatsonDiscoServer;
