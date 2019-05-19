const mysql = require(`mysql`);
const path = require(`path`);

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

connection.query({ sql, nestTables: true }, (error, results) => {
  if (error) throw error;

  results.forEach(result => {
    const { articles: article, sections: section, issues: issue } = result;
    const fileName = `${article.permalink}.md`;
    const articlePath = path.join(
      __dirname,
      `content`,
      issue.year.toString(),
      issue.month.toString(),
      section.permalink,
      fileName
    );
    console.log(articlePath);
  });

  connection.end();
});
