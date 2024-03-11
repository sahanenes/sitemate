const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let issues = [];

app.post("/api/issues", (req, res) => {
  const { id, title, description } = req.body;
  const issue = { id, title, description };
  issues.push(issue);
  res.json(issue);
});

app.get("/api/issues", (req, res) => {
  res.json(issues);
});

app.put("/api/issues/:id", (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  const index = issues.findIndex((issue) => issue.id === id);
  if (index !== -1) {
    issues[index].title = title;
    issues[index].description = description;
    res.json(issues[index]);
  } else {
    res.status(404).json({ error: "Issue not found" });
  }
});

app.delete("/api/issues/:id", (req, res) => {
  const id = req.params.id;
  const index = issues.findIndex((issue) => issue.id === id);
  if (index !== -1) {
    const deletedIssue = issues.splice(index, 1)[0];
    console.log("Deleted Issue:", deletedIssue);
    res.json(deletedIssue);
  } else {
    res.status(404).json({ error: "Issue not found" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
