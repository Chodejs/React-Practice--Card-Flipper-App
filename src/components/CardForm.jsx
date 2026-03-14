import React, { useState, useEffect } from 'react';
import styles from './CardForm.module.css';

const initialState = {
  year: '', brand: '', set_name: '', player_name: '', card_number: '', team: '', is_graded: false, condition: 'Excellent', platform: 'Facebook',
};

const CardForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [showCopied, setShowCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResults, setAiResults] = useState(null);

  useEffect(() => {
    if (aiResults && aiResults.custom_title) return;
    const parts = [ formData.year, formData.brand, formData.set_name, formData.player_name, formData.card_number ? `#${formData.card_number}` : '', formData.is_graded ? formData.condition : '' ];
    setGeneratedTitle(parts.filter(part => part && part.trim() !== '').join(' '));
  }, [formData, aiResults]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleGenerateAI = async () => {
    if (!formData.player_name && !formData.brand) {
      alert("Enter a player name or brand first.");
      return;
    }
    setIsGenerating(true);
    setAiResults(null);
    try {
      const response = await fetch('/card-flipper-api/generate_ai.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.status === 'success' && result.data) {
        setAiResults(result.data);
        if (result.data.custom_title) setGeneratedTitle(result.data.custom_title);
      } else {
        alert('Gemini threw a wobbly: ' + result.message);
      }
    } catch (error) {
      alert('Failed to connect to the AI script. Check your XAMPP server!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedTitle || showCopied) return; 
    navigator.clipboard.writeText(generatedTitle).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setSaveStatus('saving'); 
    const dataToSend = { ...formData, generatedTitle, description: aiResults ? aiResults.description : '' };
    
    try {
      const response = await fetch('/card-flipper-api/save_card.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataToSend),
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSaveStatus('success'); 
        setFormData(initialState); 
        setAiResults(null); 
        setGeneratedTitle('');
      } else {
        setSaveStatus('error'); 
      }
    } catch (error) {
      setSaveStatus('error'); 
    }
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  return (
    <div className={styles.formContainer}>
      <h2>New Listing</h2>
      <form onSubmit={handleSubmit} className={styles.gridForm} noValidate>
        <div className={styles.formGroup}>
          <label className={styles.label}>Year</label>
          <input name="year" type="number" placeholder="1989" value={formData.year} onChange={handleChange} className={styles.input}/>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Brand</label>
          <input name="brand" type="text" placeholder="Upper Deck" value={formData.brand} onChange={handleChange} className={styles.input}/>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Set / Series</label>
          <input name="set_name" type="text" placeholder="Star Rookie" value={formData.set_name} onChange={handleChange} className={styles.input}/>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Player Name</label>
          <input name="player_name" type="text" placeholder="Ken Griffey Jr" value={formData.player_name} onChange={handleChange} className={styles.input}/>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Card #</label>
          <input name="card_number" type="text" placeholder="1" value={formData.card_number} onChange={handleChange} className={styles.input}/>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Team</label>
          <input name="team" type="text" placeholder="Mariners" value={formData.team} onChange={handleChange} className={styles.input}/>
        </div>
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label className={styles.checkboxLabel}>
            <input name="is_graded" type="checkbox" checked={formData.is_graded} onChange={handleChange} />
            Is this card graded (Slabbed)?
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Condition / Grade</label>
          <select name="condition" value={formData.condition} onChange={handleChange} className={styles.select}>
            {formData.is_graded ? (
              <>
                <option value="PSA 10">PSA 10</option><option value="PSA 9">PSA 9</option>
                <option value="BGS 9.5">BGS 9.5</option><option value="SGC 10">SGC 10</option>
              </>
            ) : (
              <>
                <option value="Raw">Raw (Ungraded)</option><option value="Near Mint">Near Mint</option>
                <option value="Excellent">Excellent</option><option value="Played">Played</option>
              </>
            )}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Platform</label>
          <select name="platform" value={formData.platform} onChange={handleChange} className={styles.select}>
            <option value="eBay">eBay</option><option value="Facebook">Facebook Marketplace</option>
            <option value="Mercari">Mercari</option><option value="Personal Collection">Personal Collection</option>
          </select>
        </div>

        <div className={styles.previewSection}>
          <div className={styles.buttonGroup}>
             <button type="button" onClick={handleGenerateAI} className={`${styles.btnBase} ${isGenerating ? styles.aiBtnLoading : styles.aiBtn}`} disabled={isGenerating}>
              {isGenerating ? 'Gemini is thinking...' : '✨ Generate AI Pitch ✨'}
            </button>
          </div>
          {aiResults && (
            <div className={styles.aiResultsBox}>
              <h3 className={styles.aiSubhead}>Market Estimate</h3>
              <p style={{marginTop: 0, marginBottom: '1rem'}}>{aiResults.market_estimate}</p>
              <h3 className={styles.aiSubhead}>Selling Tip</h3>
              <p style={{marginTop: 0, marginBottom: '1rem'}}>{aiResults.selling_tip}</p>
              <h3 className={styles.aiSubhead}>Listing Description</h3>
              <p style={{marginTop: 0, fontSize: '0.9rem', whiteSpace: 'pre-wrap'}}>{aiResults.description}</p>
            </div>
          )}
          <label className={styles.label}>Generated Title (Live Preview)</label>
          <div className={styles.titleDisplay}>{generatedTitle || "Start typing to generate title..."}</div>
          <div className={styles.buttonGroup}>
            <button type="button" onClick={handleCopy} className={`${styles.btnBase} ${styles.copyBtn}`}>
              Copy Title to Clipboard
              {showCopied && <span className={styles.copiedMessage}>Copied!</span>}
            </button>
            <button type="submit" className={`${styles.btnBase} ${saveStatus === 'saving' ? styles.saveBtnSaving : saveStatus === 'success' ? styles.saveBtnSuccess : saveStatus === 'error' ? styles.saveBtnError : styles.saveBtn}`} disabled={saveStatus === 'saving'}>
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : saveStatus === 'error' ? 'Error!' : 'Save to Database'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CardForm;