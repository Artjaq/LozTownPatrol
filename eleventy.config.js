// Phase 2 : ajouter les passthrough copy pour styles.css, scripts.js,
// images/, uploads/ et admin/ une fois les templates portés.

export default function (eleventyConfig) {
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
