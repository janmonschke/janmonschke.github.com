// Based on https://sebastiandedeyne.com/webmentions-on-a-static-site-with-github-actions/

const https = require("https");
const fs = require("fs");
const { getSlugFromPathName, getFileName } = require("../utils/webmentions");
const { WEBMENTIONS_IO_TOKEN } = process.env;

function fetchMentions() {
  // const since = new Date();
  // since.setDate(since.getDate() - 7);

  // const url =
  //   `https://webmention.io/api/mentions.jf2?domain=janmonschke.com&token=${token}&since=${since.toISOString()}&per-page=999`;
  const url = `https://webmention.io/api/mentions.jf2?domain=janmonschke.com&token=${WEBMENTIONS_IO_TOKEN}&per-page=999`;

  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = "";
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  }).then((response) => {
    if (!("children" in response)) {
      throw new Error("Invalid webmention.io response.");
    }
    return response.children;
  });
}

console.log("Syncing webmentions");
fetchMentions().then((webmentions) => {
  console.log(`Fetched ${webmentions.length} webmentions`);
  webmentions.forEach((webmention) => {
    const slug = getSlugFromPathName(new URL(webmention["wm-target"]).pathname);
    const filename = getFileName(__dirname, slug);

    // this is the first mention, create the source file
    if (!fs.existsSync(filename)) {
      console.log("Creating a new webmentions cache file for", filename);
      fs.writeFileSync(filename, JSON.stringify([webmention], null, 2));
      return;
    }

    // there is already a source file for this target
    // therefore we are parsing that file, adding the mention to the source
    // and then we're writing that file to disk again
    const entries = JSON.parse(fs.readFileSync(filename));
    const newEntries = entries
      .filter((wm) => wm["wm-id"] !== webmention["wm-id"])
      .concat([webmention]);
    newEntries.sort((a, b) => a["wm-id"] - b["wm-id"]);
    fs.writeFileSync(filename, JSON.stringify(newEntries, null, 2));
    if (entries.length !== newEntries.length) {
      console.log("Wrote new mention to disk for", filename);
    }
  });
  console.log("Done syncing webmentions");
});
