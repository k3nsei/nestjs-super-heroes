module.exports = {
  '{src,apps,libs,test}/**/*.{js,ts}': function runEslint(fileNames) {
    return Array.isArray(fileNames) && fileNames.length > 10
      ? `eslint "{src,apps,libs,test}/**/*.ts"`
      : `eslint ${filenames.join(' ')}`;
  },
  '**/*.{js,ts,json,md}': ['prettier --write'],
};
