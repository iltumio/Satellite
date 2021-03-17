interface Mappings {
  default: string;
}
// Useful methods to translate filenames into classes
export default {
  mappings: {
    default: 'fas fa-file',
    md: 'fab fa-markdown',
    'image/': 'fas fa-images',
    'audio/': 'fas fa-file-audio',
    'video/': 'fas fa-file-video',
    'application/': 'fas fa-archive',
    'application/json': 'fas fa-file-code',
    'application/zip': 'fas fa-file-archive',
    'application/x-javascript': 'fab fa-js-square',
    'text/javascript': 'fab fa-js-square',
    'application/java-archive': 'fab fa-java',
    'text/css': 'fab fa-css3-alt'
  },
  /** @function
   * @name translateFiletype
   * @argument filetype string filetype provided from the <File>
   * @argument mappings mapping to check through for translation
   * @returns classname to be used for fontawesome icons describing the filetype
   */
  translateFiletype(filetype: string, mappings: Mappings) {
    let classname = mappings.default;
    // eslint-disable-next-line
    for (const [key] of Object.entries(mappings)) {
      if (filetype.includes(key)) {
        classname = mappings[key];
      }
    }
    return classname;
  }
};
