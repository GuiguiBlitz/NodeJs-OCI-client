import log4js from 'log4js';
import * as common from 'oci-common';
import * as integration from "oci-integration";
const logger = log4js.getLogger();
logger.level = "info";
const myArgs = process.argv.slice(2);
const configurationFilePath = myArgs[2];
const configProfile = "DEFAULT";
const provider = new common.ConfigFileAuthenticationDetailsProvider(configurationFilePath, configProfile);
function cleanUpServer(eventType) {
    logger.info("End of execution :" + eventType);
}
[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, cleanUpServer.bind(null, eventType));
});
const client = new integration.IntegrationInstanceClient({
    authenticationDetailsProvider: provider
});
async function ListInstances() {
    try {
        const listIntegrationInstancesRequest = {
            compartmentId: "ocid1.compartment.oc1..aaaaaaaai4i5miitjbpqtowsk5473g74s67lphm3gm2vgx5xelnywpnze5oa"
        };
        const listIntegrationInstancesResponse = await client.listIntegrationInstances(listIntegrationInstancesRequest);
        logger.info(listIntegrationInstancesResponse);
    }
    catch (error) {
        logger.error("listIntegrationInstances Failed with error  " + error);
    }
}
async function StopInstance(instance) {
    try {
        const stopIntegrationInstanceRequest = {
            integrationInstanceId: instance
        };
        const stopIntegrationInstanceResponse = await client.stopIntegrationInstance(stopIntegrationInstanceRequest);
        logger.info(stopIntegrationInstanceResponse);
    }
    catch (error) {
        logger.error("stopIntegrationInstance Failed with error  " + error);
        process.exit(1);
    }
}
async function StartInstance(instance) {
    try {
        const startIntegrationInstanceRequest = {
            integrationInstanceId: instance
        };
        const startIntegrationInstanceResponse = await client.startIntegrationInstance(startIntegrationInstanceRequest);
        logger.info(startIntegrationInstanceResponse);
    }
    catch (error) {
        logger.error("startIntegrationInstance Failed with error  " + error);
        process.exit(1);
    }
}
async function main() {
    logger.info("OIC Client");
    const instance = myArgs[1];
    const action = myArgs[0];
    if (instance && action) {
        if (action.toUpperCase() == 'START') {
            logger.info("Starting instance :" + instance);
            StartInstance(instance);
        }
        else if (action.toUpperCase() == 'STOP') {
            logger.info("Stopping instance :" + instance);
            StopInstance(instance);
        }
        else if (action) {
            logger.error('Usage :oic_cli.js [START|STOP] [INSTANCEID] [CONFIG_PATH]');
            process.exit(1);
        }
    }
    else {
        logger.error('Usage :oic_cli.js [START|STOP] [INSTANCEID] [CONFIG_PATH]');
        process.exit(1);
    }
}
main();
//# sourceMappingURL=oic_cli.js.map