// inspired by the "style-loader" loader

const path = require("path");


module.exports = function(content){
  return content;
}

module.exports.pitch = function (req) {
	const modulePath = `"${stringifyRequest(this.context, `!!${req}`)}"`;
	return `
		import styles from ${modulePath};
		import content from "${stringifyRequest(this.context, __dirname + "/runtime.js")}";
		content.load(styles.toString());
		export default styles.locals || {};
	`;
}

function isAbsolutePath(str) {
  return path.posix.isAbsolute(str) || path.win32.isAbsolute(str);
}

function stringifyRequest(loaderContext, request) {
  
  const splitted = request.split("!");
  const { context } = loaderContext;

  return (
    splitted
      .map((part) => {
        // First, separate singlePath from query, because the query might contain paths again
        const splittedPart = part.match(/^(.*?)(\?.*)/);
        const query = splittedPart ? splittedPart[2] : "";
        let singlePath = splittedPart ? splittedPart[1] : part;

        if (isAbsolutePath(singlePath) && context) {
          singlePath = path.relative(context, singlePath);

          if (isAbsolutePath(singlePath)) {
            // If singlePath still matches an absolute path, singlePath was on a different drive than context.
            // In this case, we leave the path platform-specific without replacing any separators.
            // @see https://github.com/webpack/loader-utils/pull/14
            return singlePath + query;
          }

          if (isRelativePath(singlePath) === false) {
            // Ensure that the relative path starts at least with ./ otherwise it would be a request into the modules directory (like node_modules).
            singlePath = `./${singlePath}`;
          }
        }

        return singlePath.replace(/\\/g, "/") + query;
      })
      .join("!")
  );
}
