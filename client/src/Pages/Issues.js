import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Issues.css";

const Issues = () => {
  const [issue, setIssue] = useState({ id: "", title: "", description: "" });
  const [issues, setIssues] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    readIssues();
  }, []);

  const readIssues = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/issues");
      if (response && response.data) {
        console.log("Read Issues:", response.data);
        setIssues(response.data);
      } else {
        console.error("Error reading issues");
      }
    } catch (error) {
      console.error("Error reading issues:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await handleUpdate(issue.id, issue);
      setIssue({ id: "", title: "", description: "" });
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/issues",
          issue
        );
        if (response && response.data) {
          console.log("Created Issue:", response.data);
          setIssue({ id: "", title: "", description: "" });
          readIssues();
        } else {
          console.error("Error creating issue");
        }
      } catch (error) {
        console.error("Error creating issue:", error.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIssue({ ...issue, [name]: value });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/issues/${id}`
      );
      if (response && response.data) {
        console.log("Deleted Issue:", response.data);
        readIssues();
      } else {
        console.error("Error deleting issue");
      }
    } catch (error) {
      console.error("Error deleting issue:", error.message);
    }
  };

  const handleUpdate = async (id, updatedIssue) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/issues/${id}`,
        updatedIssue
      );
      if (response && response.data) {
        console.log("Updated Issue:", response.data);
        setEditMode(false);
        readIssues();
      } else {
        console.error("Error updating issue");
      }
    } catch (error) {
      console.error("Error updating issue:", error.message);
    }
  };

  const handleEdit = (id, title, description) => {
    const issueToEdit = issues.find((issue) => issue.id === id);
    setIssue({
      id: issueToEdit.id,
      title: issueToEdit.title,
      description: issueToEdit.description,
    });
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setIssue({ id: "", title: "", description: "" });
    setEditMode(false);
  };

  return (
    <div className="mainDiv">
      <h2>{editMode ? "Edit Issue" : "Create Issue"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          ID:
          <input
            type="text"
            name="id"
            value={issue.id}
            onChange={handleChange}
            disabled={editMode}
          />
        </label>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={issue.title}
            onChange={handleChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={issue.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">{editMode ? "Update" : "Create"}</button>
        {editMode && (
          <button type="button" onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
      </form>

      <h2>Issues</h2>
      <ul>
        {issues.map((issue) => (
          <li key={issue.id}>
            <div>ID: {issue.id}</div>
            <div>Title: {issue.title}</div>
            <div>Description: {issue.description}</div>
            <button onClick={() => handleDelete(issue.id)}>Delete</button>
            <button
              onClick={() =>
                handleEdit(issue.id, issue.title, issue.description)
              }
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Issues;
