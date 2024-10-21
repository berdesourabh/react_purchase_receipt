import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, updateItem, resetItems } from './redux/itemSlice';
import './App.css';

function App() {
  const items = useSelector((state) => state.items.items);
  const dispatch = useDispatch();
  
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [sgst, setSGST] = useState(0);
  const [cgst, setCGST] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleInputChange = (id, field, value) => {
    dispatch(updateItem({ id, field, value }));
  };

  const handleCalculateTotal = () => {
    const total = items.reduce((acc, item) => {
      return acc + item.weight * item.quantity * item.offeredPrice;
    }, 0);

    const calculatedSGST = total * 0.025;
    const calculatedCGST = total * 0.025;
    const grandTotal = total + calculatedSGST + calculatedCGST;

    setSGST(calculatedSGST.toFixed(2));
    setCGST(calculatedCGST.toFixed(2));
    setTotalAmount(grandTotal.toFixed(2));
  };

  const handleReset = () => {
    dispatch(resetItems());
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setSGST(0);
    setCGST(0);
    setTotalAmount(0);
  };

  return (
    <div className="container">
      {/* Brand Details Section */}
      <div className="section-box">
        <div className="brand-row">
          <div className="brand-left">
            <p>बेर्डेकर काजू उद्योग, खरवते फाटा<br />राजापुर, रत्नागिरी, ४१६७०५<br />मोबाइल नो. ९८५०४४५०९०, ८६००४३९९९९</p>
          </div>
          <div className="brand-center">
            <img src="company_logo.png" alt="Brand Logo" className="brand-logo" />
            <h3>बेर्डेकर काजु उदयोग</h3>
          </div>
          <div className="brand-right">
            <p>GST क्रमांक: ABC123XYZ<br />फूड लायसन्स क्रमांक: 123</p>
          </div>
        </div>
      </div>

      {/* Customer Details Section */}
      <div className="section-box customer-details-box">
        <div className="customer-details-row">
          <div className="form-group">
            <label>ग्राहकाचे नाव</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>फोन नंबर</label>
            <input type="tel" />
          </div>
          <div className="form-group">
            <label>खरेदी दिनांक</label>
            <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>ग्राहकाचे GST क्रमांक</label>
            <input type="text" />
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="section-box">
        {items.map((item, index) => (
          <div key={item.id} className="item-row">
            <div className="item-number">
              {item.id}. {/* Only the number followed by a dot */}
            </div>
            <div className="form-item">
              <label>वस्तूचे नाव</label>
              <input type="text" value={item.itemName} onChange={(e) => handleInputChange(item.id, 'itemName', e.target.value)} />
            </div>
            <div className="form-item">
              <label>वजन (किलो)</label>
              <input type="number" value={item.weight} onChange={(e) => handleInputChange(item.id, 'weight', e.target.value)} />
            </div>
            <div className="form-item">
              <label>प्रमाण</label>
              <input type="number" value={item.quantity} onChange={(e) => handleInputChange(item.id, 'quantity', e.target.value)} />
            </div>
            <div className="form-item">
              <label>मूळ किंमत</label>
              <input type="number" value={item.originalPrice} onChange={(e) => handleInputChange(item.id, 'originalPrice', e.target.value)} />
            </div>
            <div className="form-item">
              <label>ऑफर किंमत</label>
              <input type="number" value={item.offeredPrice} onChange={(e) => handleInputChange(item.id, 'offeredPrice', e.target.value)} />
            </div>
            <button onClick={() => dispatch(removeItem(item.id))}>❌</button>
          </div>
        ))}
        <div className="item-button-center">
          <button onClick={() => dispatch(addItem())}>आणखी एक वस्तू जोडा</button>
        </div>
      </div>

      {/* Purchase Details Section */}
      <div className="section-box">
        <div className="purchase-row">
          <div className="form-item">
            <label>SGST (2.5%)</label>
            <input type="number" value={sgst} readOnly />
          </div>
          <div className="form-item">
            <label>CGST (2.5%)</label>
            <input type="number" value={cgst} readOnly />
          </div>
          <div className="form-item">
            <label>एकूण रक्कम</label>
            <input type="number" value={totalAmount} readOnly />
          </div>
        </div>
        <div className="purchase-details-button">
          <button onClick={handleCalculateTotal}>एकूण रक्कम मोजा</button>
        </div>
      </div>

      {/* Print and Reset Buttons */}
      <div className="button-group">
        <button onClick={() => window.print()}>प्रिंट करा</button>
        <button type="reset" onClick={handleReset}>रीसेट करा</button>
      </div>
    </div>
  );
}

export default App;