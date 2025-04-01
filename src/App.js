import React, { useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || '';

function App() {
  const [recipients, setRecipients] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [subject, setSubject] = useState('');

  const handleGenerate = async () => {
    console.log('[FRONTEND] Submitting prompt to:', `${API_BASE}/api/generate`);
    try {
      if (!prompt) {
        alert("Please provide a prompt.");
        return;
      }

      const response = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      console.log('[FRONTEND] Generation response:', data);

      if (data.error) {
        alert(data.error);
      } else {
        setGeneratedEmail(data.emailContent);
      }

    } catch (error) {
      console.error('[FRONTEND] Error fetching /api/generate:', error);
      alert('Error generating email content.');
    }
  };

  const handleSend = async () => {
    console.log('[FRONTEND] Sending email to:', recipients);
    try {
      if (!recipients || !generatedEmail) {
        alert("Recipient(s) and email content are required to send.");
        return;
      }

      const response = await fetch(`${API_BASE}/api/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipients,
          subject: subject || 'AI-Generated Email',
          emailBody: generatedEmail
        })
      });

      const data = await response.json();
      console.log('[FRONTEND] Send response:', data);

      if (data.error) {
        alert(data.error);
      } else {
        alert('Email sent successfully!');
      }

    } catch (error) {
      console.error('[FRONTEND] Error sending email:', error);
      alert('Error sending email.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h1>Email Generation App</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Recipients (comma-separated):</label>
        <input
          type="text"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          placeholder="e.g. test1@gmail.com, test2@gmail.com"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Prompt:</label>
        <textarea
          rows="4"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the email context..."
        />
      </div>

      <button onClick={handleGenerate}>Generate Email</button>

      {generatedEmail && (
        <div style={{ marginTop: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label>Subject (optional):</label>
            <input
              type="text"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Optional Subject"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Generated Email:</label>
            <textarea
              rows="8"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              value={generatedEmail}
              onChange={(e) => setGeneratedEmail(e.target.value)}
            />
          </div>

          <button onClick={handleSend}>Send Email</button>
        </div>
      )}
    </div>
  );
}

export default App;
