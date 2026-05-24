// Phase 2a : passthrough copy des assets statiques.
// Phase 2b : collections événements + filtres ajoutés.

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/script.js");
  eleventyConfig.addPassthroughCopy("src/image");
  eleventyConfig.addPassthroughCopy("src/uploads");
  eleventyConfig.addPassthroughCopy("src/admin");

  // -- Collections --

  eleventyConfig.addCollection("evenements_a_venir", function (collectionsApi) {
    const aujourd_hui = new Date();
    aujourd_hui.setHours(0, 0, 0, 0);
    return collectionsApi
      .getFilteredByGlob("src/events/*.md")
      .filter(item => {
        if (!item.data.publie) return false;
        const dateEvent = new Date(item.data.date);
        dateEvent.setHours(0, 0, 0, 0);
        return dateEvent >= aujourd_hui;
      })
      .sort((a, b) => new Date(a.data.date) - new Date(b.data.date));
  });

  eleventyConfig.addCollection("evenements_passes", function (collectionsApi) {
    const aujourd_hui = new Date();
    aujourd_hui.setHours(0, 0, 0, 0);
    return collectionsApi
      .getFilteredByGlob("src/events/*.md")
      .filter(item => {
        if (!item.data.publie) return false;
        const dateEvent = new Date(item.data.date);
        dateEvent.setHours(0, 0, 0, 0);
        return dateEvent < aujourd_hui;
      })
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  // -- Filtres --

  eleventyConfig.addFilter("dateLocale", function (date) {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fr-CH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  });

  eleventyConfig.addFilter("youtubeId", function (url) {
    if (!url) return "";
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return match ? match[1] : "";
  });

  eleventyConfig.addFilter("limit", function (tableau, n) {
    return tableau.slice(0, n);
  });

  eleventyConfig.addFilter("estAvenir", function (date) {
    if (!date) return false;
    const aujourd_hui = new Date();
    aujourd_hui.setHours(0, 0, 0, 0);
    const dateEvent = new Date(date);
    dateEvent.setHours(0, 0, 0, 0);
    return dateEvent >= aujourd_hui;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
