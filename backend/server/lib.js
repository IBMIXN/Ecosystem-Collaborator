var nconf = require("nconf");
var fs = require("fs");

nconf.use("file", { file: "./config.json" });
nconf.load();

// Used to validate the request body when a sign up request is made
const validateBody = (body) => {
  const attributes = [
    "companyName",
    "primarySpecifications",
    "secondarySpecifications",
    "PrimaryIndustries",
    "SecondaryIndustries",
    "companyDescription",
    "industryDescriptions",
    "industryLinks",
    "companyURL",
    "companyEmail",
  ];

  const missing = attributes.filter(
    (attribute) => body[attribute] === undefined
  );

  if (missing.length > 0) {
    var error = "Missing properties: ";
    missing.forEach((value, index) => {
      error =
        error +
        (index !== missing.length - 1
          ? `'${value}', `
          : `'${value}' from body.`);
    });
    return error;
  }
};

function handleIndustriesRequest(
  req,
  res,
  discovery,
  environmentId,
  collectionId
) {
  const queryParams = {
    environmentId: environmentId,
    collectionId: collectionId,
    passages: false,
    count: 0,
    aggregation:
      "[term(PrimaryIndustries,count:999),term(SecondaryIndustries,count:999)]",
  };

  const terms = new Set();
  discovery
    .query(queryParams)
    .then((queryResponse) => {
      queryResponse.result.aggregations.forEach((item) => {
        item.results.forEach((term) => {
          if (!(term.key === "" || term.key === "Any")) {
            terms.add(term.key);
          }
        });
      });
      res.json(Array.from(terms));
    })
    .catch((err) => {
      console.log("error:", err);
      res.status(500).send({ error: err });
    });
}

function handleSignUp(req, res, discovery, environmentId, collectionId) {
  const error = validateBody(req.body);
  var fileNumber = nconf.get("fileNumber");

  if (error) {
    res.status(400).send(error);
  } else {
    const queryParams = {
      environmentId: environmentId,
      collectionId: collectionId,
      file: Buffer.from(JSON.stringify(req.body)),
      filename: fileNumber,
      fileContentType: "application/json",
    };
    discovery
      .addDocument(queryParams)
      .then((documentAccepted) => {
        fs.writeFile(
          `data/company${fileNumber}.json`,
          JSON.stringify(req.body),
          function (err) {
            if (err) {
              console.log(err);
            }
          }
        );
        fileNumber = fileNumber + 1;
        nconf.set("fileNumber", fileNumber);
        nconf.save(function (err) {
          if (err) {
            console.error(err.message);
          }
        });
        res.send("Success");
      })
      .catch((err) => {
        res.status(500).send({ error: "Failed to upload file." });
        console.log("error:", err);
      });
  }
}

function handleDocDelete(req, res, discovery, environmentId, collectionId) {
  const docID = req.params.documentID;
  const queryParams = {
    environmentId: environmentId,
    collectionId: collectionId,
    documentId: docID,
  };

  discovery
    .deleteDocument(queryParams)
    .then((deleteDocumentResponse) => {
      res.send("Success");
    })
    .catch((err) => {
      res.status(500).send({ error: err });
    });
}

// get the documentID and company name for delete doc page.
function getDocument(req, res, discovery, environmentId, collectionId) {
  const offset = req.params.offset;
  const queryParams = {
    environmentId: environmentId,
    collectionId: collectionId,
    _return: "id,companyName",
    count: 10,
    offset: offset,
  };

  discovery
    .query(queryParams)
    .then((queryResponse) => {
      res.json(queryResponse.result);
    })
    .catch((err) => {
      console.log("error:", err);
      es.status(500).send({ error: err });
    });
}

function handleSearch(req, res, discovery, environmentId, collectionId) {
  const queryString = req.query.query;
  const querySpecifications =
    "'" + req.query.specifications.split(",").join("'|'") + "'";

  const specificationFilter =
    "((primarySpecifications:" +
    querySpecifications +
    ")|(secondarySpecifications:" +
    querySpecifications +
    "))";

  const limit = parseInt(req.query.limit);
  const offset = parseInt(req.query.offset);

  var queryParams = {
    environmentId: environmentId,
    collectionId: collectionId,
    naturalLanguageQuery: queryString,
    _return: "id",
  };

  const queryIndustries = req.query.industries;
  var industryFilter;

  if (queryIndustries === "Other") {
    industryFilter = '(SecondaryIndustries::"Any")';
    queryParams._return =
      "id,companyName,companyDescription,companyURL,primarySpecifications,secondarySpecifications,PrimaryIndustries,SecondaryIndustries,industryDescriptions,industryLinks";
    queryParams.count = limit;
    queryParams.offset = offset;
    queryParams.filter = specificationFilter + "," + industryFilter;

    discovery
      .query(queryParams)
      .then((queryResponse) => {
        const data = queryResponse.result.results;
        data.forEach((company) => {
          company.tier = 3;
        });
        const response = {
          data: data,
          matching_results: queryResponse.result.matching_results,
        };
        res.json(response);
      })
      .catch((err) => {
        res.status(500).send({ error: err });
      });
  } else {
    const formattedQueryIndustries =
      "'" + queryIndustries.split(",").join("'|'") + "'";
    industryFilter =
      "(PrimaryIndustries:" +
      formattedQueryIndustries +
      "|SecondaryIndustries:" +
      formattedQueryIndustries +
      '|SecondaryIndustries::"Any"' +
      ")";

    queryParams._return =
      "id,companyName,companyDescription,companyURL,primarySpecifications,secondarySpecifications,PrimaryIndustries,SecondaryIndustries,industryDescriptions,industryLinks";
    queryParams.count = limit;
    queryParams.offset = offset;
    queryParams.filter = specificationFilter + "," + industryFilter;

    discovery
      .query(queryParams)
      .then((queryResponse) => {
        const data = queryResponse.result.results;
        const queryIndustriesArray = queryIndustries.split(",");

        data.forEach((company) => {
          if (
            company.PrimaryIndustries.filter((item) =>
              queryIndustriesArray.includes(item)
            ).length > 0
          ) {
            company.tier = 1;
          } else if (
            company.SecondaryIndustries.filter((item) =>
              queryIndustriesArray.includes(item)
            ).length > 0
          ) {
            company.tier = 2;
          } else {
            company.tier = 3;
          }
        });

        const response = {
          data: data,
          matching_results: queryResponse.result.matching_results,
        };
        res.json(response);
      })
      .catch((err) => {
        res.status(500).send({ error: err });
      });
  }
}

module.exports = {
  handleIndustriesRequest,
  handleSignUp,
  handleDocDelete,
  getDocument,
  handleSearch,
};
