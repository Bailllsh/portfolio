// Public assets must resolve under a GitHub Pages repository subdirectory too.
export const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
