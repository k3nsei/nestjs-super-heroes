module.exports = {
  hooks: {
    'commit-msg': '[[ -n $HUSKY_BYPASS ]] || commitlint -E HUSKY_GIT_PARAMS',
    'pre-commit': 'lint-staged',
  },
};
