module.exports = {
  data: {
    layout: "layouts/base.webc",
    title: "Cafe recommendations",
    permalink: "/cafes/",
  },

  render(data) {
    let html = `<h2>Cafe recommendations</h2>\n<ul>\n`;
    const cafeData = data.cafes;
    for (const country in cafeData.countries) {
      const cities = cafeData.countries[country].cities;
      html += `<h3>${country}</h3>`;
      for (const [slug, city] of Object.entries(cities)) {
        const count = city.cafes.length;
        const label = count === 1 ? "cafe" : "cafes";
        html += `<li><a href="/cafes/${slug}/">${city.name}</a> (${count} ${label})</li>\n`;
      }
      html += `</ul>`;
    }

    return html;
  },
};
