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
  ORDER BY articles.created_at DESC
  LIMIT 10
`;

const createSectionPath = result => {
  const { sections: section, issues: issue } = result;

  return path
    .join(
      __dirname,
      `content`,
      issue.year.toString(),
      issue.month.toString(),
      section.permalink
    )
    .toLowerCase();
};

const createArticlePath = result => {
  const sectionPath = createSectionPath(result);
  const { articles: article } = result;
  const fileName = `${article.permalink}.html`;

  return path.join(sectionPath, fileName).toLowerCase();
};

const getFrontmatter = article => {
  const title = striptags(article.title);
  return yaml.dump({
    title
  });
};

const handleResult = result => {
  const { articles: article } = result;
  const articlePath = createArticlePath(result);
  console.log(articlePath);
  const frontmatter = getFrontmatter(article);

  const fileContent = `---
${frontmatter}---

${article.body}
`;

  const sectionPath = createSectionPath(result);
  fs.mkdir(sectionPath, { recursive: true })
    .then(() => {
      return fs.writeFile(articlePath, fileContent);
    })
    .catch(err => {
      throw err;
    });
};

connection.query({ sql, nestTables: true }, (error, results) => {
  if (error) throw error;

  results.forEach(handleResult);
  connection.end();
});
