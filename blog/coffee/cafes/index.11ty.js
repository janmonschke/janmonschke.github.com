module.exports = {
  data: {
    layout: "layouts/base.webc",
    title: "Cafe recommendations",
    permalink: "/cafes/",
  },

  render(data) {
    const cities = data.cafes.cities;

    let html = `<h2>Cafe recommendations</h2>\n<ul>\n`;
    for (const [slug, city] of Object.entries(cities)) {
      const count = city.cafes.length;
      const label = count === 1 ? "cafe" : "cafes";
      html += `<li><a href="/cafes/${slug}/">${city.name}</a> (${count} ${label})</li>\n`;
    }
    html += `</ul>`;

    return html;
  },
};
