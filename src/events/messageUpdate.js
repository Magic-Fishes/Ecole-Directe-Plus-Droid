const { handleWebSocket } = require("../utils/webServer");
const { setDroidStatus } = require("../utils/handlers/setDroidStatus");
const { ActivityType, Events } = require("discord.js");

const statisticsMessage = async (
    client,
    oldMessage,
    newMessage,
    targetChannelId
) => {
    // const targetChannelId = "1300721930105786409";
    if (newMessage.channelId !== targetChannelId) return;

    const response = await handleWebSocket();

    const handleVisitorsDate = (obj) => {
        const todayAndYesterday = [];
        for (const [key, value] of Object.entries(obj)) {
            if (todayAndYesterday.length !== 2) {
                todayAndYesterday.push({
                    [key]: value.toLocaleString("fr-FR"),
                });
            } else {
                return todayAndYesterday;
            }
        }
        return todayAndYesterday;
    };

    const buildOSAndNumbersString = (data) => {
        const osData = data.os;
        let result = "Systèmes d'exploitation :\n";

        for (const [osType, osList] of Object.entries(osData)) {
            result += `${osType} :\n`;
            osList.forEach((item) => {
                for (const [os, num] of Object.entries(item)) {
                    result += `- ${os} avec ${num} utilisateurs\n`;
                }
            });
        }

        return result;
    };

    const buildBrowsersString = (data) => {
        const browsersData = data.browsers;
        let result = "Navigateurs :\n";

        for (const [browserType, browserList] of Object.entries(browsersData)) {
            result += `${browserType} :\n`;
            browserList.forEach((item) => {
                for (const [browser, num] of Object.entries(item)) {
                    result += `- ${browser} avec ${num} utilisateurs\n`;
                }
            });
        }

        return result;
    };
    const buildMostUsedBrowserString = (data) => {
        const mostUsedOSData =
            data.mostUsedOS === undefined ? null : data.mostUsedOS;
        if (mostUsedOSData === null) return;
        let result = "\n";

        mostUsedOSData.forEach((item) => {
            result += `- ${item.name} avec ${item.visitors} utilisateurs\n`;
        });

        return result;
    };
    const embed = {
        color: 0x0099ff,
        title: "Statistiques EcoleDirecte Plus",

        description: "Les statisiques du site d'EcoleDirecte Plus",
        fields: [
            {
                name: "**Infos :**",
                value: `
                        Démarrage du log : ${response.general.start_logging_date}
                        Fin du log : ${response.general.end_logging_date}
                        `,
            },

            {
                name: "**Statistiques générales :**",
                value: `Total des requêtes : ${response.general.total_requests.toLocaleString("fr-FR")}
                        Requêtes valides : ${response.general.valid_requests.toLocaleString("fr-FR")}
                        Requêtes invalides : ${response.general.invalid_requests.toLocaleString("fr-FR")}
                        Requêtes non trouvées : ${response.general.not_found_requests.toLocaleString("fr-FR")}
                        Temps de génération : ${response.general.generation_time_ms.toLocaleString("fr-FR")} ms`,
            },

            {
                name: "**Nombre de visiteurs :**",
                value: `
                            Aujourd'hui : ${
                                response.visitors &&
                                handleVisitorsDate(response.visitors)[0]
                                    ? Object.values(
                                          handleVisitorsDate(
                                              response.visitors
                                          )[0]
                                      )
                                    : ""
                            }
                                    Hier : ${
                                        response.visitors &&
                                        handleVisitorsDate(response.visitors)[1]
                                            ? Object.values(
                                                  handleVisitorsDate(
                                                      response.visitors
                                                  )[1]
                                              )
                                            : ""
                                    }`,
                inline: false,
            },

            {
                name: "**Liens les plus visités :**",
                value: `
                ${
                    response.topVisitedRoutes === undefined
                        ? null
                        : response.topVisitedRoutes
                              .map((route) => {
                                  return `- ${route}`;
                              })
                              .join("\n")
                }
                `,
                inline: false,
            },

            {
                name: "**Navigateurs les plus utilisés :**",
                value: `
                ${buildMostUsedBrowserString(response)}`,
                inline: false,
            },
        ],

        timestamp: new Date().toISOString(),
    };

    // console.dir(JSON.stringify(response), { depth: null });
    oldMessage.edit({ embeds: [embed] });
    setDroidStatus(
        client,
        `Visites aujourd'hui : ${
            response.visitors && handleVisitorsDate(response.visitors)[0]
                ? Object.values(handleVisitorsDate(response.visitors)[0])
                : ""
        }`,
        ActivityType.Custom
    );
};

module.exports = {
    name: Events.MessageUpdate,
    async execute(client, oldMessage, newMessage) {
        statisticsMessage(
            client,
            oldMessage,
            newMessage,
            "1324061176325341204"
        );
    },
};

