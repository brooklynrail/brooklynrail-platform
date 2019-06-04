const fs = require(`fs`).promises;
const mysql = require(`mysql`);
const path = require(`path`);
const striptags = require(`striptags`);
const yaml = require(`js-yaml`);

const connection = mysql.createConnection({
  host: `localhost`,
  port: 3307,
  user: `brooklynrail`,
  password: `devpass`,
  database: `brooklynrail`
});

const sql = `
  SELECT * FROM articles
  INNER JOIN issues
  ON articles.issue_id = issues.id
  INNER JOIN sections
  ON articles.section_id = sections.id
  WHERE issues.published = 1
`;

const createIssuePath = issue => {
  // two-digit
  const month = issue.month.toString().padStart(2, `0`);

  return path
    .join(__dirname, `content`, issue.year.toString(), month)
    .toLowerCase();
};

const createSectionPath = result => {
  const { issues: issue, sections: section } = result;
  const issuePath = createIssuePath(issue);

  return path.join(issuePath, section.permalink).toLowerCase();
};

const createArticlePath = result => {
  const sectionPath = createSectionPath(result);
  const { articles: article } = result;
  const fileName = `${article.permalink}.html`;

  return path.join(sectionPath, fileName).toLowerCase();
};

const getFrontmatter = article => {
  const date = article.created_at;
  const title = striptags(article.title);
  const summary = striptags(article.excerpt);
  return yaml.dump({
    date,
    title,
    summary
  });
};

const createArticle = result => {
  const { articles: article } = result;
  const frontmatter = getFrontmatter(article);

  const fileContent = `---
${frontmatter}---

${article.body}
`;

  const articlePath = createArticlePath(result);
  console.log(articlePath);

  return fs.writeFile(articlePath, fileContent);
};

const handleResult = result => {
  const sectionPath = createSectionPath(result);
  fs.mkdir(sectionPath, { recursive: true })
    .then(() => createArticle(result))
    .catch(err => {
      throw err;
    });
};

connection.query({ sql, nestTables: true }, (error, results) => {
  if (error) throw error;

  results.forEach(handleResult);
  connection.end();
});
