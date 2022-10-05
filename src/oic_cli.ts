//Compile with  :   TSC
//run with      :   npm start 

import log4js from 'log4js'
import * as common from 'oci-common'
import * as integration from "oci-integration";
// import * as core from "oci-core";
// import * as identity from "oci-identity";
// import * as wr from "oci-workrequests";

const logger = log4js.getLogger()
logger.level = "info"
//get args
const myArgs = process.argv.slice(2);

//init oci instance
// const configurationFilePath = "oci_conf/config.txt";
const configurationFilePath = myArgs[2]
const configProfile = "DEFAULT";
const provider: common.ConfigFileAuthenticationDetailsProvider = new common.ConfigFileAuthenticationDetailsProvider(
  configurationFilePath,
  configProfile
);
//exit events handler
function cleanUpServer(eventType: string) {
  logger.info("End of execution :" + eventType)
}

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
  process.on(eventType, cleanUpServer.bind(null, eventType));
})

const client = new integration.IntegrationInstanceClient({
  authenticationDetailsProvider: provider
});

// }
async function ListInstances() {
  try {
    // Create a request and dependent object(s).
    const listIntegrationInstancesRequest: integration.requests.ListIntegrationInstancesRequest = {
      compartmentId: "xxxxxx"
    };

    // Send request to the Client.
    const listIntegrationInstancesResponse = await client.listIntegrationInstances(
      listIntegrationInstancesRequest
    );
    logger.info(listIntegrationInstancesResponse)
  } catch (error) {
    logger.error("listIntegrationInstances Failed with error  " + error);
  }
}

async function StopInstance(instance:string) {
  try {
    // Create a request and dependent object(s).
    const stopIntegrationInstanceRequest: integration.requests.StopIntegrationInstanceRequest = {
      integrationInstanceId: instance
    };

    // Send request to the Client.
    const stopIntegrationInstanceResponse = await client.stopIntegrationInstance(
      stopIntegrationInstanceRequest
    );
    logger.info(stopIntegrationInstanceResponse)
  } catch (error) {
    logger.error("stopIntegrationInstance Failed with error  " + error);
    process.exit(1)
  }
}

async function StartInstance(instance:string) {
  try {
    // Create a request and dependent object(s).
    const startIntegrationInstanceRequest: integration.requests.StartIntegrationInstanceRequest = {
      integrationInstanceId: instance
    };

    // Send request to the Client.
    const startIntegrationInstanceResponse = await client.startIntegrationInstance(
      startIntegrationInstanceRequest
    );
    logger.info(startIntegrationInstanceResponse)
  } catch (error) {
    logger.error("startIntegrationInstance Failed with error  " + error);
    process.exit(1)
  }
}

// Main
async function main() {
  logger.info("OIC Client")
  //Usage 
  // oic_cli start/stop instanceId
  const instance = myArgs[1]
  const action = myArgs[0]
  if(instance && action){
    if(action.toUpperCase()=='START'){
      logger.info("Starting instance :"+instance)
      StartInstance(instance)
    }else if(action.toUpperCase()=='STOP'){
      logger.info("Stopping instance :"+instance)
      StopInstance(instance)
    }else if(action){
      logger.error('Usage :oic_cli.js [START|STOP] [INSTANCEID] [CONFIG_PATH]')
      process.exit(1)
    }
  }else{
    logger.error('Usage :oic_cli.js [START|STOP] [INSTANCEID] [CONFIG_PATH]')
    process.exit(1)
  }
  // ListInstances()

}

main()
