# Explore Microsoft Capstone Project

Final project prototype built on Azure for the Explore Microsoft internship at Microsoft Canada during 2022 summer. Key features include the ability to search through a database of bike parts by uploading pictures of serial numbers or similar bike parts, and a custom chat bot that can answer FAQ questions.

# Getting Started

## 1. Creating resources on Azure

You must first create the following resources on Azure in order to obtain the API keys needed:

-   Optical Character Recognition
-   Custom Vision
-   QnA Maker

More information can be found on the Azure Portal

## 2. Setup environmental variables

Once you have created the above Azure resources, create a .env file in the root of the project and populate it with the following variables

More information on how to get the keys here:

-   [OCR](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/5d986960601faab4bf452005)
-   [Custom Vision](https://docs.microsoft.com/en-us/rest/api/custom-vision/)
-   [QnA Maker](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)

```
REACT_APP_OCR_ENDPOINT=
REACT_APP_OCR_SUBSCRIPTION_KEY=

REACT_APP_CV_ENDPOINT=
REACT_APP_CV_PREDICTION_KEY=

REACT_APP_QNA_MAKER_ENDPOINT=
REACT_APP_QNA_MAKER_KEY=
```

## 3. Testing locally

```
docker-compose -f docker-compose-dev.yml up --build
```

Then navigate to localhost:8080

## 4. Production using Azure App Services

Deploy using Azure App Services with the following configuration:

-   Publish: Docker Container
-   Options: Docker Compose
-   Image Source: Docker Hub
-   Configuration File: [docker-compose.yml](/docker-compose.yml)

Alternatively, deploy using the [Azure ARM Template](/azure_arm_template.json)
