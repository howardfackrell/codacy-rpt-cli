# codacy-rpt-cli
--
collects codacy data across repos


Calls the codacy API to get some stats, shows repo coverage & issues in 1 convenient place. Intended to help 
track status toward compliance accross a group of repos

# Pre-reqs and dependencies
- Recent versions of Node should work. 
- There aren't many dependencies, they can be installed w/ NPM
```shell
npm install
```
# Data needed to run
- You'll need to define an environment variable w/ the name **CODACY_API_TOKEN**. You can get the api token from Codacy
- You'll need to define an environment variable w/ the name **GITHUB_API_TOKEN**.  
  You can get the api token from Github. It needs to be fine grained, it needs to have Admin READ access so it can 
  read https://api.github.com/repos/${repo.organization}/${repo.name}/branches/${repo.branch}/protection/required_status_checks
- You'll need to create a Json file w/ a structure that looks like this. Suggest naming it **something-repos.json**:
```json
[
  {
    "name": "my-repo-1",
    "organization": "johndoe",
    "branch": "master"
  },
  {
    "name": "my-repo-2",
    "organization": "johndoe",
    "branch": "main"
  }
  // ... as many repos as you need
]
```

## Running
```shell
CODACY_API_TOKEN=codacy-token GITHUB_API_TOKEN=fine-grained-gh-token npm start ./something-repos.json
```
And the results should look like this
```shell
┌─────────┬─────────────────────────────┬───────────┬───────┬─────────┬──────┬──────────────────────┬───────────────────────────┬─────────────────────────────┐
│ (index) │ name                        │ coverage  │ Error │ Warning │ Info │ Codacy Diff Coverage │ Codacy Coverage Variation │ Codacy Static Code Analysis │
├─────────┼─────────────────────────────┼───────────┼───────┼─────────┼──────┼──────────────────────┼───────────────────────────┼─────────────────────────────┤
│ 0       │ 'my-repo-1'      '          │ '84%'     │ 3     │ 65      │ 162  │ ''                   │ ''                        │ 'required'                  │
│ 1       │ 'my-repo-2'                 │ '10%'     │ 1     │ 4       │ 109  │ ''                   │ ''                        │ ''                          │
└─────────┴─────────────────────────────┴───────────┴───────┴─────────┴──────┴──────────────────────┴───────────────────────────┴─────────────────────────────┘
```
