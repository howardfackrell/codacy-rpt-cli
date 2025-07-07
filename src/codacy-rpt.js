const fs = require('fs');
const axios = require("axios");

const CODACY_API_URL = 'https://api.codacy.com/api/v3';
const PROVIDER = 'gh';

function readJsonFile(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return JSON.parse(data);
}

function headers(repoToken) {
    return {
        "headers": {
            'Accept': "application/json",
            "Content-Type": "application/json",
            "api-token": repoToken
        }
    };
}

async function getCoverage(repo) {
    const repoInfo = await getRepoInfo(repo);
    const badgeUrl = repoInfo.data.badges.coverage;
    try {
        const response = await axios.get(badgeUrl);
        const coverage = [...response.data.match(/(\d+%)/g)][0];
        return coverage;
    } catch (error) {
        console.error(`Error fetching coverage for ${repo.name}:`, error.response ? error.response.data : error.message);
    }
}

async function getRepoInfo(repo) {
    const url = `${CODACY_API_URL}/organizations/${PROVIDER}/${repo.organization}/repositories/${repo.name}`;
    try {
        const response = await axios.get(url, headers(process.env.CODACY_API_TOKEN));
        return response.data;
    } catch (error) {
        console.error(`Error fetching coverage for ${repo.name}:`, error.response ? error.response.data : error.message);
    }
}

async function getIssueSeverityCounts(repo) {
    const url = `${CODACY_API_URL}/analysis/organizations/${PROVIDER}/${repo.organization}/repositories/${repo.name}/issues/search?limit=2000`;
    try {
        const response = await axios.post(url, {}, headers(process.env.CODACY_API_TOKEN));
        let severities = response.data.data.map(issue => issue.patternInfo.severityLevel)
        return (frequencies(severities));
    } catch (error) {
        console.error(`Error getIssueSeverityCounts for ${repo.name}:`, error.response ? error.response.data : error.message);
    }
}

async function main() {
    console.log('Excpected Use:');
    console.log('CODACY_API_TOKEN=sometoken npm start repos.json');
    const repos = readJsonFile(process.argv[2]);
    console.log(process.argv[2]);
    let repoSummaries = [];
    for (const repo of repos) {
        console.log (`Fetching info for ${repo.name}`)
        let summary = Object.assign(
            {},
            {"name": repo.name},
            {coverage: await getCoverage(repo)},
            await getIssueSeverityCounts(repo)
        );
        repoSummaries.push(summary);
    }

    console.log("Generated on " + new Date());
    console.table(repoSummaries, ['name', 'coverage', 'Error', 'Warning', 'Info']);
}

function frequencies(list) {
    let result = {};
    for (const l of list) {
        if (result[l]) {
            result[l]++;
        } else {
            result[l] = 1;
        }
    }
    return result;
}


main();