import React, { useState, useEffect } from 'react';

// --- STYLES OBJECT ---
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
    boxSizing: 'border-box', 
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
    minHeight: '1.5em', 
    wordWrap: 'break-word', 
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
  },
  btnBase: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    flex: 1,
    fontSize: '1em', 
    fontFamily: 'inherit',
    transition: 'background-color 0.3s ease',
  },
  copyBtn: {
    backgroundColor: '#6c757d',
    color: 'white',
    position: 'relative',
  },
  saveBtn: {
    backgroundColor: '#28a745',
    color: 'white',
  },
  // --- NEW AI STYLES ---
  aiBtn: {
    backgroundColor: '#6f42c1', // A lovely purple for the AI magic
    color: 'white',
  },
  aiBtnLoading: {
    backgroundColor: '#9a7fd1',
    cursor: 'wait',
  },
  aiResultsBox: {
    background: '#e0cffc',
    border: '1px solid #b388ff',
    borderRadius: '6px',
    padding: '1rem',
    marginBottom: '1rem',
    color: '#333',
  },
  aiSubhead: {
    marginTop: 0,
    color: '#4a148c',
    fontSize: '1rem',
    marginBottom: '0.5rem',
    borderBottom: '1px solid #b388ff',
    paddingBottom: '0.25rem'
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
  saveBtnSaving: {
    backgroundColor: '#ffc107', 
    cursor: 'wait',
  },
  saveBtnSuccess: {
    backgroundColor: '#28a745', 
  },
  saveBtnError: {
    backgroundColor: '#dc3545', 
  }
};

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
  const [formData, setFormData] = useState(initialState);
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [showCopied, setShowCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); 
  
  // --- NEW AI STATES ---
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResults, setAiResults] = useState(null);

  // Auto-generate a basic title as they type, unless the AI has provided a custom one
  useEffect(() => {
    // If we already have an AI title, don't overwrite it with the basic one!
    if (aiResults && aiResults.custom_title) return;

    const parts = [
      formData.year,
      formData.brand,
      formData.set_name,
      formData.player_name,
      formData.card_number ? `#${formData.card_number}` : '',
      formData.is_graded ? formData.condition : '', 
    ];

    const title = parts.filter(part => part && part.trim() !== '').join(' ');
    setGeneratedTitle(title);
  }, [formData, aiResults]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // --- NEW AI HANDLER ---
  const handleGenerateAI = async () => {
    // Don't bother if the fields are completely empty
    if (!formData.player_name && !formData.brand) {
      alert("Give Gemini a fighting chance, mate! Enter a player name or brand first.");
      return;
    }

    setIsGenerating(true);
    setAiResults(null); // Clear previous results

    try {
      const response = await fetch('/card-flipper-api/generate_ai.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === 'success' && result.data) {
        setAiResults(result.data);
        // Automatically slap the AI's title into the preview box
        if (result.data.custom_title) {
          setGeneratedTitle(result.data.custom_title);
        }
      } else {
        console.error('API Error:', result.message);
        alert('Gemini threw a wobbly: ' + result.message);
      }
    } catch (error) {
      console.error('Network or Parsing Error:', error);
      alert('Failed to connect to the AI script. Check your XAMPP server!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedTitle || showCopied) return; 

    const textArea = document.createElement('textarea');
    textArea.value = generatedTitle;
    textArea.style.position = 'fixed';  
    textArea.style.opacity = 0; 
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy'); 
      setShowCopied(true); 
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textArea);

    setTimeout(() => {
      setShowCopied(false);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setSaveStatus('saving'); 

    // Include the generated title (either basic or AI) AND the AI description if it exists
    const dataToSend = {
      ...formData,
      generatedTitle: generatedTitle,
      description: aiResults ? aiResults.description : '',
    };
    
    try {
      const response = await fetch('/card-flipper-api/save_card.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSaveStatus('success'); 
        setFormData(initialState); 
        setAiResults(null); // Clear the AI box on success
        setGeneratedTitle('');
      } else {
        console.error('API Error:', result.message);
        setSaveStatus('error'); 
      }

    } catch (error) {
      console.error('Network Error:', error);
      setSaveStatus('error'); 
    }

    setTimeout(() => {
      setSaveStatus('idle');
    }, 3000);
  };
  
  const combineStyles = (...styleObjects) => Object.assign({}, ...styleObjects);

  const getButtonText = () => {
    switch (saveStatus) {
      case 'saving': return 'Saving...';
      case 'success': return 'Saved!';
      case 'error': return 'Error! Try Again.';
      default: return 'Save to Database';
    }
  };

  const getSaveButtonStyle = () => {
    let style = combineStyles(styles.btnBase, styles.saveBtn);
    if (saveStatus === 'saving') style = combineStyles(style, styles.saveBtnSaving);
    if (saveStatus === 'success') style = combineStyles(style, styles.saveBtnSuccess);
    if (saveStatus === 'error') style = combineStyles(style, styles.saveBtnError);
    return style;
  };

  const getAiButtonStyle = () => {
    let style = combineStyles(styles.btnBase, styles.aiBtn);
    if (isGenerating) style = combineStyles(style, styles.aiBtnLoading);
    return style;
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.h2}>New Listing</h2>
      
      <form onSubmit={handleSubmit} style={styles.gridForm} noValidate>
        
        {/* Row 1: Basics */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Year</label>
          <input name="year" type="number" placeholder="1989" value={formData.year} onChange={handleChange} style={styles.input}/>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Brand</label>
          <input name="brand" type="text" placeholder="Upper Deck" value={formData.brand} onChange={handleChange} style={styles.input}/>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Set / Series</label>
          <input name="set_name" type="text" placeholder="Star Rookie" value={formData.set_name} onChange={handleChange} style={styles.input}/>
        </div>

        {/* Row 2: Player Info */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Player Name</label>
          <input name="player_name" type="text" placeholder="Ken Griffey Jr" value={formData.player_name} onChange={handleChange} style={styles.input}/>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Card #</label>
          <input name="card_number" type="text" placeholder="1" value={formData.card_number} onChange={handleChange} style={styles.input}/>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Team</label>
          <input name="team" type="text" placeholder="Mariners" value={formData.team} onChange={handleChange} style={styles.input}/>
        </div>

        {/* Row 3: Condition Logic */}
        <div style={combineStyles(styles.formGroup, styles.fullWidth)}>
          <label style={styles.checkboxLabel}>
            <input name="is_graded" type="checkbox" checked={formData.is_graded} onChange={handleChange} />
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
          <div style={styles.buttonGroup}>
             <button 
              type="button" 
              onClick={handleGenerateAI} 
              style={getAiButtonStyle()}
              disabled={isGenerating}
            >
              {isGenerating ? 'Gemini is thinking...' : '✨ Generate AI Pitch ✨'}
            </button>
          </div>

          {/* AI Results Display */}
          {aiResults && (
            <div style={styles.aiResultsBox}>
              <h3 style={styles.aiSubhead}>Market Estimate</h3>
              <p style={{marginTop: 0, marginBottom: '1rem'}}>{aiResults.market_estimate}</p>
              
              <h3 style={styles.aiSubhead}>Selling Tip</h3>
              <p style={{marginTop: 0, marginBottom: '1rem'}}>{aiResults.selling_tip}</p>

              <h3 style={styles.aiSubhead}>Listing Description</h3>
              <p style={{marginTop: 0, fontSize: '0.9rem', whiteSpace: 'pre-wrap'}}>{aiResults.description}</p>
            </div>
          )}

          <label style={styles.label}>Generated Title (Live Preview)</label>
          <div style={styles.titleDisplay}>
            {generatedTitle || "Start typing to generate title..."}
          </div>
          
          <div style={styles.buttonGroup}>
            <button type="button" onClick={handleCopy} style={combineStyles(styles.btnBase, styles.copyBtn)}>
              Copy Title to Clipboard
              {showCopied && <span style={styles.copiedMessage}>Copied!</span>}
            </button>
            <button type="submit" style={getSaveButtonStyle()} disabled={saveStatus === 'saving'}>
              {getButtonText()}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default CardForm;