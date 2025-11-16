import React, { useState, useEffect } from 'react';

// --- STYLES OBJECT (from previous fix) ---
// We moved all the CSS module styles into this object to fix compiler issues.
const styles = {
  formContainer: {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    margin: '0 auto',
    color: '#333', 
  },
  h2: {
    marginTop: 0,
    color: '#333',
    borderBottom: '2px solid #eee',
    paddingBottom: '1rem',
    marginBottom: '1.5rem',
  },
  gridForm: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr', 
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#666',
    marginBottom: '0.5rem',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box', // Fixes potential sizing issues
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: 'white', 
    color: '#333', 
  },
  checkboxLabel: {
    display: 'flex', 
    flexDirection: 'row',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    color: '#666', 
  },
  previewSection: {
    gridColumn: '1 / -1', 
    background: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '6px',
    border: '1px solid #e9ecef',
    marginTop: '1rem',
  },
  titleDisplay: {
    background: 'white',
    padding: '1rem',
    fontFamily: 'monospace',
    fontSize: '1.2rem',
    border: '1px solid #ccc',
    marginBottom: '1rem',
    color: '#333',
    minHeight: '1.5em', // Ensures it doesn't collapse
    wordWrap: 'break-word', // Prevents long titles from overflowing
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
  },
  copyBtn: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    flex: 1,
    position: 'relative', // For notification
    backgroundColor: '#6c757d',
    color: 'white',
    fontSize: '1em', // Inherit font settings
    fontFamily: 'inherit', // Inherit font settings
  },
  saveBtn: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    flex: 1,
    position: 'relative',
    backgroundColor: '#28a745',
    color: 'white',
    fontSize: '1em', 
    fontFamily: 'inherit',
    transition: 'background-color 0.3s ease', // Smooth color change
  },
  copiedMessage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#28a745',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  // --- NEW STYLES FOR SAVE BUTTON STATES ---
  saveBtnSaving: {
    backgroundColor: '#ffc107', // Yellow for "Saving..."
    cursor: 'wait',
  },
  saveBtnSuccess: {
    backgroundColor: '#28a745', // Green for "Saved!"
  },
  saveBtnError: {
    backgroundColor: '#dc3545', // Red for "Error!"
  }
};
// --- END STYLES OBJECT ---


// Define the initial state for the form so we can reset it
const initialState = {
  year: '',
  brand: '',
  set_name: '',
  player_name: '',
  card_number: '',
  team: '',
  is_graded: false,
  condition: 'Raw',
  platform: 'eBay',
};

const CardForm = () => {
  // 1. The "Source of Truth" for our form data
  const [formData, setFormData] = useState(initialState);

  // 2. The "Derived State" - This calculates automatically!
  const [generatedTitle, setGeneratedTitle] = useState('');

  // 3. State for our "Copied!" notification
  const [showCopied, setShowCopied] = useState(false);

  // 4. NEW: State for our "Save" button
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'success', 'error'

  // 5. The "Magic" Effect - Regenerate title whenever data changes
  useEffect(() => {
    // Logic: Year + Brand + Set + Player + Card Number + (Grade if applicable)
    const parts = [
      formData.year,
      formData.brand,
      formData.set_name,
      formData.player_name,
      formData.card_number ? `#${formData.card_number}` : '',
      formData.is_graded ? formData.condition : '', // Only show condition in title if graded (e.g. PSA 10)
    ];

    // Filter out empty strings and join with spaces
    const title = parts.filter(part => part && part.trim() !== '').join(' ');
    setGeneratedTitle(title);
  }, [formData]);

  // Generic handler for text inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 6. The Copy Handler (using execCommand for iframe compatibility)
  const handleCopy = () => {
    if (!generatedTitle || showCopied) return; 

    // Create a temporary textarea to hold the text
    const textArea = document.createElement('textarea');
    textArea.value = generatedTitle;
    textArea.style.position = 'fixed';  // Prevent it from scrolling page
    textArea.style.opacity = 0; // Make it invisible
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy'); // This is the key part
      setShowCopied(true); // Trigger visual feedback
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    // Clean up the temporary element
    document.body.removeChild(textArea);

    // Reset the "Copied!" message after 2 seconds
    setTimeout(() => {
      setShowCopied(false);
    }, 2000);
  };

  // 7. --- UPDATED: The Submit Handler ---
  const handleSubmit = async (e) => {
    console.log("HANDLE SUBMIT CALLED!"); // <-- Our debug line!
    e.preventDefault(); // Stop the form from reloading the page
    setSaveStatus('saving'); // Set button to "Saving..."

    // Combine all data to be sent
    const dataToSend = {
      ...formData,
      generatedTitle: generatedTitle
    };
    
    // This is the log you were seeing, which is great!
    console.log("Sending to DB:", dataToSend);

    try {
      // !! THIS IS THE API REQUEST !!
      // It sends our data to the /api/save_card.php URL
      // The Vite proxy will intercept this and send it to http://localhost/api/save_card.php
      const response = await fetch('/card-flipper-api/save_card.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      // Wait for the server's response and try to parse it as JSON
      const result = await response.json();

      if (result.status === 'success') {
        // IT WORKED!
        console.log('Success:', result);
        setSaveStatus('success'); // Set button to "Saved!"
        setFormData(initialState); // Reset the form
      } else {
        // The PHP script ran but sent back an error (e.g., "Connection failed")
        console.error('API Error:', result.message);
        setSaveStatus('error'); // Set button to "Error!"
      }

    } catch (error) {
      // This catches:
      // 1. Network errors (Vite proxy fails, XAMPP is off)
      // 2. JSON parsing errors (PHP script had a fatal error and sent HTML back)
      console.error('Network or Parsing Error:', error);
      setSaveStatus('error'); // Set button to "Error!"
    }

    // Reset button state after 3 seconds, regardless of outcome
    setTimeout(() => {
      setSaveStatus('idle');
    }, 3000);
  };
  
  // 8. Helper for combining styles (since we can't use classnames)
  const combineStyles = (...styleObjects) => Object.assign({}, ...styleObjects);

  // 9. Helper to get dynamic button text
  const getButtonText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'success':
        return 'Saved!';
      case 'error':
        return 'Error! Try Again.';
      default:
        return 'Save to Database';
    }
  };

  // 10. Helper to get dynamic button style
  const getSaveButtonStyle = () => {
    let style = styles.saveBtn;
    if (saveStatus === 'saving') {
      style = combineStyles(style, styles.saveBtnSaving);
    } else if (saveStatus === 'success') {
      style = combineStyles(style, styles.saveBtnSuccess);
    } else if (saveStatus === 'error') {
      style = combineStyles(style, styles.saveBtnError);
    }
    return style;
  };


  return (
    <div style={styles.formContainer}>
      <h2 style={styles.h2}>New Listing</h2>
      
      {/* We added noValidate to stop the browser from blocking our onSubmit */}
      <form onSubmit={handleSubmit} style={styles.gridForm} noValidate>
        
        {/* Row 1: Basics */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Year</label>
          <input 
            name="year" 
            type="number" 
            placeholder="1989" 
            value={formData.year} 
            onChange={handleChange} 
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Brand</label>
          <input 
            name="brand" 
            type="text" 
            placeholder="Upper Deck" 
            value={formData.brand} 
            onChange={handleChange} 
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Set / Series</label>
          <input 
            name="set_name" 
            type="text" 
            placeholder="Star Rookie" 
            value={formData.set_name} 
            onChange={handleChange} 
            style={styles.input}
          />
        </div>

        {/* Row 2: Player Info */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Player Name</label>
          <input 
            name="player_name" 
            type="text" 
            placeholder="Ken Griffey Jr" 
            value={formData.player_name} 
            onChange={handleChange} 
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Card #</label>
          <input 
            name="card_number" 
            type="text" 
            placeholder="1" 
            value={formData.card_number} 
            onChange={handleChange} 
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Team</label>
          <input 
            name="team" 
            type="text" 
            placeholder="Mariners" 
            value={formData.team} 
            onChange={handleChange} 
            style={styles.input}
          />
        </div>

        {/* Row 3: Condition Logic */}
        <div style={combineStyles(styles.formGroup, styles.fullWidth)}>
          <label style={styles.checkboxLabel}>
            <input 
              name="is_graded" 
              type="checkbox" 
              checked={formData.is_graded} 
              onChange={handleChange} 
            />
            Is this card graded (Slabbed)?
          </label>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Condition / Grade</label>
          {formData.is_graded ? (
            <select name="condition" value={formData.condition} onChange={handleChange} style={styles.select}>
              <option value="PSA 10">PSA 10</option>
              <option value="PSA 9">PSA 9</option>
              <option value="BGS 9.5">BGS 9.5</option>
              <option value="SGC 10">SGC 10</option>
              <option value="CGC 10">CGC 10</option> 
              {/* Feel free to add more grades */}
            </select>
          ) : (
            <select name="condition" value={formData.condition} onChange={handleChange} style={styles.select}>
              <option value="Raw">Raw (Ungraded)</option>
              <option value="Near Mint">Near Mint</option>
              <option value="Excellent">Excellent</option>
              <option value="Played">Played</option>
            </select>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Platform</label>
          <select name="platform" value={formData.platform} onChange={handleChange} style={styles.select}>
            <option value="eBay">eBay</option>
            <option value="Facebook">Facebook Marketplace</option>
            <option value="Mercari">Mercari</option>
            <option value="Personal Collection">Personal Collection</option>
          </select>
        </div>

        {/* THE MAGIC GENERATOR SECTION */}
        <div style={styles.previewSection}>
          <label style={styles.label}>Generated Title (Live Preview)</label>
          <div style={styles.titleDisplay}>
            {generatedTitle || "Start typing to generate title..."}
          </div>
          <div style={styles.buttonGroup}>
            <button 
              type="button" 
              onClick={handleCopy} 
              style={styles.copyBtn}
            >
              Copy to Clipboard
              {/* Show "Copied!" message when showCopied is true */}
              {showCopied && <span style={styles.copiedMessage}>Copied!</span>}
            </button>
            <button 
              type="submit" 
              style={getSaveButtonStyle()}
              disabled={saveStatus === 'saving'} // Disable button while saving
            >
              {getButtonText()}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default CardForm;