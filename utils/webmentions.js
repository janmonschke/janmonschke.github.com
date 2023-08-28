const atMentionUrlRegex = /<a href="([http].+?)".+?class=\"u-url\">(.*?)<\/a>/g;
const urlRegex = /(https|http):\/\/\S+/g;
const atMentionRegex = /(@\w+)/g;

module.exports = {
  /**
   * Given a post's path name, return the data file slug
   */
  getSlugFromPathName(pathName) {
    const slug = pathName
      .replace(/\/$/, "")
      .replace(/^\//, "")
      .replaceAll("/", "__");

    return slug;
  },

  /**
   * Given a directory and a post's slug, return the webmentions data file path
   */
  getFileName(dirname, slug) {
    return `${dirname}/data/${slug}.json`;
  },

  /**
   * While webmentions.io comes with a HTML version of the mention, it does not
   * feel secure to embed HTML from a 3rd party directly.
   * Therefore we are parsing the text content and the HTML content for the bits
   * and pieces that we do want to create custom HTML for: @mentions and links.
   * We also want to make sure, since these links are all user-generated, that
   * crawlers don't follow (rel=nofollow) these and don't associate them with
   * this site (rel=ugc).
   *
   * Example for content:
   * "@janmon That would be great 🎉🎊
   * Check out this link as well: https://social.lol/tags/bcruhr2"
   *
   * Example for HTML:
   * <p>
   *  <span class=\"h-card\">
   *    <a href=\"https://social.lol/@janmon\" class=\"u-url\">
   *      @<span>janmon</span></a>
   *  </span>
   *  That would be great 🎉🎊
   *  Check out this link as well:
   *  <a href=\"https://social.lol/tags/bcruhr2\">
   *    #<span>bcruhr2</span>
   *  </a>
   * </p>
   *
   * @param {{text: string, html: string}} content
   * @returns A "safe" rich text version of the webmention's content
   */
  replaceUrlsAndAtMentions({ text, html }) {
    // Create a lookup for @mention links e.g.:
    // { "@janmon": "https://social.lol/janmon" }
    const atMentionsUrls = [...html.matchAll(atMentionUrlRegex)].reduce(
      (_atMentions, [_, userUrl, userAtMention]) => {
        _atMentions[
          userAtMention.replace("<span>", "").replace("</span>", "")
        ] = userUrl;
        return _atMentions;
      },
      {}
    );

    return (
      text
        // Replace all urls in the text with nofollow + ugc links
        .replace(urlRegex, (url) => {
          return `<a href="${url}" rel="nofollow ugc" target="_blank">${url}</a>`;
        })
        // Replace all @mentions with links nofollow + ugc links that were parsed before
        .replace(atMentionRegex, (atMention) => {
          return `<a href="${atMentionsUrls[atMention]}" rel="nofollow ugc" target="_blank">${atMention}</a>`;
        })
    );
  },
};
