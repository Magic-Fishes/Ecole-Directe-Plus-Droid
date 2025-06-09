const WebSocket = require("ws");
const logger = require("../helpers/logger");
require("dotenv").config({ path: "../.env" });

/* eslint-disable camelcase */

// utils
const formatDate = (dateStr) => {
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    return `${day}/${month}/${year}`;
};

const sortJSON = async (parsedJSON) => {
    const general = await parsedJSON.general;
    const visitors = await parsedJSON.visitors;
    const requests = await parsedJSON.requests;
    // const staticRequests = parsedJSON.static_requests;
    const notFound = await parsedJSON.not_found;
    // const hosts = parsedJSON.hosts;
    const os = await parsedJSON.os;
    const browsers = await parsedJSON.browsers;
    // const visitTime = await parsedJSON.visit_time;
    const referringSites = await parsedJSON.referring_sites;
    // const statusCodes = await parsedJSON.status_codes;

    const handleGeneral = () => {
        return {
            general: {
                start_logging_date: general.start_date,
                end_logging_date: general.end_date,
                total_requests: general.total_requests,
                valid_requests: general.valid_requests,
                invalid_requests: general.failed_requests,
                generation_time_ms: general.generation_time,
                unique_visitors: general.unique_visitors,
                requested_files: general.unique_files,
                not_found_requests: general.unique_not_found,
            },
        };
    };
    const handleVisitors = () => {
        const data = visitors.data;

        const sortMetadata = {};

        data.map((element) => {
            const date = formatDate(element.data);
            const visitors = element.visitors.count;
            sortMetadata[date] = visitors;
        });

        return {
            visitors: sortMetadata,
        };
    };

    const handleRequests = () => {
        const metadata = requests.metadata;
        const data = requests.data;
        const topVistedRoutes = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].data.startsWith("/app/")) {
                topVistedRoutes.push(data[i].data);
            }
        }

        const sortMetadata = {
            hits: {
                total: metadata.hits.total.value,
                avg: metadata.hits.avg.value,
                max: metadata.hits.max.value,
                min: metadata.hits.min.value,
            },
            top_visited_routes: [
                topVistedRoutes[0],
                topVistedRoutes[1],
                topVistedRoutes[2],
            ],
        };

        return sortMetadata;
    };
    const handleNotFound = () => {
        const metadata = notFound.metadata;
        const data = notFound.data;
        const topNotFoundRoutes = [];

        for (let i = 0; i < 3; i++) {
            topNotFoundRoutes.push(data[i].data);
        }
        const sortMetadata = {
            hits: {
                total: metadata.hits.total.value,
                avg: metadata.hits.avg.value,
                max: metadata.hits.max.value,
                min: metadata.hits.min.value,
            },
            top_not_found_routes: topNotFoundRoutes,
        };
        return sortMetadata;
    };

    const handleOS = () => {
        const data = os.data;
        const mostUsedOS = [];
        const sortMetadata = {};

        data.forEach((system) => {
            sortMetadata[system.data] = system.items
                .slice(0, 3)
                .map((version) => ({
                    [version.data]: version.visitors.count,
                }));

            mostUsedOS.push({
                name: system.data,
                visitors: system.visitors.count,
            });
        });

        mostUsedOS.sort((a, b) => b.visitors - a.visitors);
        const topUsedOS = mostUsedOS.slice(0, 3);

        return {
            os: sortMetadata,
            mostUsedOS: topUsedOS,
        };
    };
    const handleBrowsers = () => {
        const data = browsers.data;
        const mostUsedBrowser = [];
        const sortMetadata = {};

        data.forEach((system) => {
            sortMetadata[system.data] = system.items
                .slice(0, 3)
                .map((version) => ({
                    [version.data]:
                        version.visitors.count.toLocaleString("fr-FR"),
                }));

            mostUsedBrowser.push({
                name: system.data,
                visitors: system.visitors.count.toLocaleString("fr-FR"),
            });
        });

        mostUsedBrowser.sort((a, b) => b.visitors - a.visitors);
        const topUsedBrowser = mostUsedBrowser.slice(0, 3);

        return {
            browsers: sortMetadata,
            mostUsedOS: topUsedBrowser,
        };
    };

    const handleReferringSites = () => {
        const data = referringSites.data;

        const websites = [];

        data.forEach((website) => {
            if (!website.data.includes("ecole-directe.plus")) {
                websites.push({
                    name: website.data,
                    visitors: website.visitors.count,
                });
            }
        });

        websites.sort((a, b) => b.visitors - a.visitors);
        const topWebsites = websites.slice(0, 10);
        const sortMetadata = {};
        topWebsites.forEach((website) => {
            sortMetadata[website.name] = website.visitors;
        });

        return {
            referringSites: sortMetadata,
        };
    };

    return {
        ...(general === undefined ? {} : handleGeneral()),
        ...(visitors === undefined ? {} : handleVisitors()),
        ...(requests === undefined ? {} : handleRequests()),
        ...(notFound === undefined ? {} : handleNotFound()),
        ...(os === undefined ? {} : handleOS()),
        ...(browsers === undefined ? {} : handleBrowsers()),
        ...(referringSites === undefined ? {} : handleReferringSites()),
    };
    // console.dir(handleReferringSites(), { depth: null });
    // console.dir(handleBrowsers(), { depth: null });
    // console.dir(handleOS(), { depth: null });
    // console.log(handleNotFound());
    // console.log(sortRequests());
    // console.log(sortGeneral());
};

const handleWebSocket = (url = process.env.SOCKET_URL) => {
    return new Promise((resolve, reject) => {
        const socket = new WebSocket(url);

        socket.addEventListener("message", async (event) => {
            const rawData = event.data;
            const data = await JSON.parse(rawData);

            const sortedObject = await sortJSON(data);

            resolve(sortedObject);
        });

        socket.addEventListener("close", (event) => {
            logger.error("Connection to socket was aborted");
            reject(new Error("Connection to socket was aborted"));
        });

        socket.addEventListener("error", (error) => {
            logger.error("[!] WebSocket error: ", error);
            // reject(new Error("WebSocket error: " + error.message));
        });
    });
};

module.exports = { handleWebSocket };

