import React, { useState, useEffect } from 'react';
import styles from './CardForm.module.css';

const CardForm = () => {
  // 1. The "Source of Truth" for our form data
  const [formData, setFormData] = useState({
    year: '',
    brand: '',
    set_name: '',
    player_name: '',
    card_number: '',
    team: '',
    is_graded: false,
    condition: 'Raw', // Default
    platform: 'eBay',
  });

  // 2. The "Derived State" - This calculates automatically!
  const [generatedTitle, setGeneratedTitle] = useState('');

  // 3. The "Magic" Effect - Regenerate title whenever data changes
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

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedTitle);
    alert("Title copied to clipboard! Ready for eBay.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sending to DB:", { ...formData, generatedTitle });
    // We will hook this up to the PHP API in the next step!
  };

  return (
    <div className={styles.formContainer}>
      <h2>New Listing</h2>
      
      <form onSubmit={handleSubmit} className={styles.gridForm}>
        
        {/* Row 1: Basics */}
        <div className={styles.formGroup}>
          <label>Year</label>
          <input 
            name="year" 
            type="number" 
            placeholder="1989" 
            value={formData.year} 
            onChange={handleChange} 
          />
        </div>

        <div className={styles.formGroup}>
          <label>Brand</label>
          <input 
            name="brand" 
            type="text" 
            placeholder="Upper Deck" 
            value={formData.brand} 
            onChange={handleChange} 
          />
        </div>

        <div className={styles.formGroup}>
          <label>Set / Series</label>
          <input 
            name="set_name" 
            type="text" 
            placeholder="Star Rookie" 
            value={formData.set_name} 
            onChange={handleChange} 
          />
        </div>

        {/* Row 2: Player Info */}
        <div className={styles.formGroup}>
          <label>Player Name</label>
          <input 
            name="player_name" 
            type="text" 
            placeholder="Ken Griffey Jr" 
            value={formData.player_name} 
            onChange={handleChange} 
          />
        </div>

        <div className={styles.formGroup}>
          <label>Card #</label>
          <input 
            name="card_number" 
            type="text" 
            placeholder="1" 
            value={formData.card_number} 
            onChange={handleChange} 
          />
        </div>

        <div className={styles.formGroup}>
          <label>Team</label>
          <input 
            name="team" 
            type="text" 
            placeholder="Mariners" 
            value={formData.team} 
            onChange={handleChange} 
          />
        </div>

        {/* Row 3: Condition Logic */}
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label className={styles.checkboxLabel}>
            <input 
              name="is_graded" 
              type="checkbox" 
              checked={formData.is_graded} 
              onChange={handleChange} 
            />
            Is this card graded (Slabbed)?
          </label>
        </div>

        <div className={styles.formGroup}>
          <label>Condition / Grade</label>
          {formData.is_graded ? (
            <select name="condition" value={formData.condition} onChange={handleChange}>
              <option value="PSA 10">PSA 10</option>
              <option value="PSA 9">PSA 9</option>
              <option value="BGS 9.5">BGS 9.5</option>
              <option value="SGC 10">SGC 10</option>
              <option value="CGC 10">CGC 10</option>
            </select>
          ) : (
            <select name="condition" value={formData.condition} onChange={handleChange}>
              <option value="Raw">Raw (Ungraded)</option>
              <option value="Near Mint">Near Mint</option>
              <option value="Excellent">Excellent</option>
              <option value="Played">Played</option>
            </select>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Platform</label>
          <select name="platform" value={formData.platform} onChange={handleChange}>
            <option value="eBay">eBay</option>
            <option value="Facebook">Facebook Marketplace</option>
            <option value="Mercari">Mercari</option>
            <option value="Personal Collection">Personal Collection</option>
          </select>
        </div>

        {/* THE MAGIC GENERATOR SECTION */}
        <div className={styles.previewSection}>
          <label>Generated Title (Live Preview)</label>
          <div className={styles.titleDisplay}>
            {generatedTitle || "Start typing to generate title..."}
          </div>
          <div className={styles.buttonGroup}>
            <button type="button" onClick={handleCopy} className={styles.copyBtn}>
              Copy to Clipboard
            </button>
            <button type="submit" className={styles.saveBtn}>
              Save to Database
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default CardForm;