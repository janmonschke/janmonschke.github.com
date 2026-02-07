window.customElements.define(
  "coffee-map",
  class extends HTMLElement {
    connectedCallback() {
      const container = document.createElement("div");
      container.className = "coffee-map__container";
      this.appendChild(container);

      const cafes = window.__cafes;
      if (!cafes || !cafes.length) return;

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/assets/marker-icon-2x.png",
        iconUrl: "/assets/marker-icon.png",
        shadowUrl: "/assets/marker-shadow.png",
      });

      const map = L.map(container);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const bounds = L.latLngBounds();
      cafes.forEach((cafe) => {
        if (!cafe.coordinates) return;
        const marker = L.marker([cafe.coordinates.lat, cafe.coordinates.lng]);
        const googleMapsLink = cafe.links
          .filter((link) => link.type === "google_maps")
          .pop();
        const linkEnd = googleMapsLink ? "</a>" : "";
        console.log(googleMapsLink);
        const linkStart = googleMapsLink
          ? "<a href='" + googleMapsLink.link + "' target='_blank'>"
          : "";
        marker
          .addTo(map)
          .bindPopup(
            "<strong>" +
              cafe.name +
              "</strong>" +
              linkStart +
              (cafe.address ? "<br>" + cafe.address : "") +
              linkEnd,
          );
        bounds.extend(marker.getLatLng());
      });

      map.fitBounds(bounds, { padding: [20, 20] });
      if (cafes.length === 1) {
        map.setZoom(15);
      }
    }
  },
);
