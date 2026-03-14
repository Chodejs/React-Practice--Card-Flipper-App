import React, { useState, useEffect } from 'react';
import Paginator from './Paginator';
import './CardList.css';

export default function CardList() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  const fetchCards = async () => {
    try {
      const res = await fetch('/card-flipper-api/get_cards.php');
      const data = await res.json();
      if (data.status === 'success') {
        setCards(data.cards);
      }
    } catch (error) {
      console.error("Failed to fetch inventory", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch('/card-flipper-api/update_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      fetchCards();
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  // --- Pagination Maths ---
  const indexOfLastCard = currentPage * itemsPerPage;
  const indexOfFirstCard = indexOfLastCard - itemsPerPage;
  const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading inventory...</p>;

  return (
    <div className="card-list-container">
      <ul className='card-grid' id='card-grid'>
        {currentCards.length > 0 ? (
          currentCards.map(card => (
            <li key={card.id} className="card-item-container">
              <div className='card-wrapper'>
                <h4 className='card-title'>{card.generated_title || `${card.player_name} ${card.brand}`}</h4>
                <p className='card-description'><strong>Description: </strong>{card.description}</p>

                <div className='details-wrapper'>
                  <span className='card-detail'><strong>Card #: </strong>{card.card_number}</span>
                  <span className='card-detail'><strong>Set: </strong>{card.set_name}</span>
                  <span className='card-detail'><strong>List Price: </strong>{card.list_price}</span>
                  <span className='card-detail'><strong>Sold Price: </strong>{card.sold_price}</span>
                  <span className='card-detail'><strong>Date Listed: </strong>{card.created_at}</span>
                  <span className='card-detail'><strong>Platform: </strong>{card.platform}</span>
                  <span className='card-detail'><strong>Condition: </strong>{card.condition}</span>
                </div>

                {/* THE GLITCH IS FIXED HERE */}
                {card.image_url && (
                  <img className='card-image' src={card.image_url} alt={card.generated_title || 'Card image'} />
                )}
              </div>

              <div className="status-wrapper">
                <select 
                  value={card.status || 'Active'} 
                  onChange={(e) => handleStatusChange(card.id, e.target.value)}
                  className="status-select"
                >
                  {/* Fixed to match your DB Enum! */}
                  <option value="Active">Active</option>
                  <option value="Sold">Sold</option>
                  <option value="Personal">Personal</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </li>
          ))
        ) : (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>The Card Vault is Empty. Add Some Cards.</p>
        )}
      </ul>
      
      {cards.length > itemsPerPage && (
        <Paginator 
          totalItems={cards.length} 
          itemsPerPage={itemsPerPage} 
          currentPage={currentPage} 
          onPageChange={setCurrentPage} 
        />
      )}
    </div>
  );
}