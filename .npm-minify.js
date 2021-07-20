module.exports = {
  "filter": [
    "**/*.json",
    "!package.json", // this will still get copied; just avoiding errors about the file already existing
    "!node_modules/**",
    "!dist/**",
  ]
}