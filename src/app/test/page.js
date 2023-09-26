"use client";
import React, { useState } from "react";

export default function page() {
  const [file, setFile] = useState(null);
  const [logLevels, setLogLevels] = useState({
    completed: [],
    frozen: [],
    emails: [],
    senderEmail: [],
    receivedEmail: [],
    ip: [],
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const startTime = performance.now();
      const data = reader.result;

      const lines = data.split("\n");
      const levels = {
        completed: [],
        frozen: [],
        emails: [],
        senderEmail: [],
        receivedEmail: [],
        ip: [],
      };
      lines.forEach((line) => {
        if (line.includes("Completed")) {
          levels.completed.push(line);
        } else if (line.includes("Message is frozen")) {
          levels.frozen.push(line);
        }
        const emailMatches = line.match(
          /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g
        );
        if (emailMatches) {
          levels.emails.push(...emailMatches);
        }

        const sEmailMatch = line.match(
          /S=([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/
        );
        if (sEmailMatch) {
          levels.senderEmail.push(sEmailMatch[1]);
        }

        if (/\breceived\b/i.test(line)) {
          const forIndex = line.indexOf("for");
          if (forIndex !== -1) {
            const substring = line.slice(forIndex + 4); // +4 to skip 'for' and space
            const emailMatch = substring.match(
              /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g
            );
            if (emailMatch) {
              levels.receivedEmail.push(...emailMatch);
            }
          }
          const ipAddressMatch = line.match(/\[([^\]]+)\]/);
          if (ipAddressMatch) {
            levels.ip.push(ipAddressMatch[1]);
          }
        }
      });

      setLogLevels(levels);

      const endTime = performance.now();
      const loadingTimeMs = endTime - startTime;
      console.log(loadingTimeMs);

      reader.onerror = () => {
        console.log("file error", reader.error);
      };
    };
  };
  return (
    <div className="text-white">
      <form action="" onSubmit={handleSubmit}>
        <input
          type="file"
          required
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        <button type="submit">SUBMIT</button>
      </form>
      <>
        <div>
          <h2>completed {logLevels.completed.length} </h2>
          {/* <ul>
            {logLevels.completed.map((com, index) => {
              return <li key={index}>{com}</li>;
            })}
          </ul> */}
        </div>
        <div>
          <h2>frozen {logLevels.frozen.length}</h2>
          {/* <ul>
            {logLevels.frozen.map((fro, index) => {
              return <li key={index}>{fro}</li>;
            })}
          </ul> */}
        </div>
        <div>
          <h2>email {logLevels.emails.length}</h2>
          {/* <ul>
            {logLevels.emails.map((mail, index) => {
              return <li key={index}>{mail}</li>;
            })}
          </ul> */}
        </div>
        <div>
          <h2>sender emails {logLevels.senderEmail.length}</h2>
          {/* <ul>
            {logLevels.senderEmail.map((mail, index) => {
              return <li key={index}>{mail}</li>;
            })}
          </ul> */}
        </div>
        <div>
          <h2>received emails {logLevels.receivedEmail.length}</h2>
          {/* <ul>
            {logLevels.receivedEmail.map((mail, index) => {
              return <li key={index}>{mail}</li>;
            })}
          </ul> */}
        </div>
        <div>
          <h2>IP address {logLevels.ip.length}</h2>
          <ul>
            {logLevels.ip.map((mail, index) => {
              return <li key={index}>{mail}</li>;
            })}
          </ul>
        </div>
      </>
    </div>
  );
}
