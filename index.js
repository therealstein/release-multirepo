const core = require('@actions/core');
const github = require('@actions/github');
async function run() {
  // This should be a token with access to your repository scoped in as a secret.
  // The YML workflow will need to set myToken with the GitHub Secret Token
  // myToken: ${{ secrets.GITHUB_TOKEN }}
  // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
  let myToken = core.getInput('myToken');
  if (myToken) {
    console.log(myToken);
  } else {
    require('dotenv').config();
    console.log(process.env.GITHUB_ACTION);
    myToken = {
      type: 'token',
      token: process.env.GITHUB_ACTION,
      tokenType: 'oauth',
    };
  }

  const octokit = github.getOctokit(myToken);
  console.log(myToken);
  const { data: pullRequest } = await octokit.rest.pulls.get({
    owner: 'therealstein',
    repo: 'release-multirepo',
    pull_number: 13,
    mediaType: {
      format: 'diff',
    },
  });
  console.log(pullRequest);

  // You can also pass in additional options as a second parameter to getOctokit
  // const octokit = github.getOctokit(myToken, {userAgent: "MyActionVersion1"});
}

run();
