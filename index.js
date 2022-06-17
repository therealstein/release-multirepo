const { Octokit, App } = require('octokit');

async function getCommits(octokit, owner, repository) {
  const allowedComments = [
    'build:',
    'ci:',
    'docs:',
    'feat:',
    'func:',
    'fix:',
    'perf:',
    'style:',
    'refactor:',
    'test:',
  ];

  const commits = await octokit.rest.repos.listCommits({
    owner: owner,
    repo: repository,
    per_page: 100,
  });

  return commits.data
    .map(
      ({
        commit: {
          message,
          committer: { date },
        },
      }) => ({
        message,
        date,
      })
    )
    .filter((msg) =>
      allowedComments.some((allowed) => msg.message.startsWith(allowed))
    );
}

async function run() {
  require('dotenv').config();
  myToken = process.env.GITHUB_TOKEN;
  const octokit = new Octokit({ auth: myToken });

  // login with personal access token
  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();
  console.log('Hello, %s', login);

  const smallCommits = await getCommits(
    octokit,
    'therealstein',
    'release-multirepo'
  );

  console.log(JSON.stringify(smallCommits, null, 2));
}

run();
