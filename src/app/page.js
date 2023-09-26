"use client";
import { useState } from "react";

export default function LogParser() {
  const [completedLogs, setCompletedLogs] = useState([]);
  const [frozenLogs, setFrozenLogs] = useState([]);

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    try {
      const startTime = performance.now();

      const fileContent = await readFileAsText(file);
      const logLines = fileContent.split("\n");
      const completed = [];
      const frozen = [];

      for (const line of logLines) {
        if (line.includes("Completed")) {
          completed.push(line);
        } else if (line.includes("Message is frozen")) {
          frozen.push(line);
        }
      }
      const endTime = performance.now();
      const loadingTimeMs = endTime - startTime;
      console.log(loadingTimeMs);
      setCompletedLogs(completed);
      setFrozenLogs(frozen);
    } catch (error) {
      console.error("Error reading the file:", error);
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const content = event.target.result;
        resolve(content);
      };

      reader.onerror = (event) => {
        reject(event.target.error);
      };

      reader.readAsText(file);
    });
  };

  return (
    <div>
      <input type="file" accept=".log" onChange={handleFileInputChange} />
      <div>
        <h2>Completed Logs</h2>
        <ul>
          {/* {completedLogs.map((log, index) => (
            <li key={index}>{log}</li>
          ))} */}
          <li>{completedLogs.length}</li>
        </ul>
      </div>
      <div>
        <h2>Frozen Logs</h2>
        <ul>
          {/* {frozenLogs.map((log, index) => (
            <li key={index}>{log}</li>
          ))} */}
          <li>{frozenLogs.length}</li>
        </ul>
      </div>
    </div>
  );
}
