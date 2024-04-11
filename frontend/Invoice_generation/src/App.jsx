import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AppStyle.css'


function App() {
  const [sellerInfo, setSellerInfo] = useState({ name: '', phone: '', address: '' });
  const [buyerInfo, setBuyerInfo] = useState({ name: '', phone: '', address: '' });
  const [items, setItems] = useState([{ name: '', price: 0, quantity: 0, tax: 0, total: 0 }]);
  const [response, setResponse] = useState('');
  const [total, setTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    generateInvoiceNumber();
    setCurrentDate(getCurrentDate());
    items.forEach(item => calculateTotal(item));
    calculateGrandTotal();
    
  }, []);

  const generateInvoiceNumber = () => {
    const randomInvoiceNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setInvoiceNumber(randomInvoiceNumber);
  };

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const calculateTotal = (item) => {
    const totalPrice = parseFloat(item.price) * parseInt(item.quantity);
    const taxAmount = totalPrice * (parseFloat(item.tax) / 100);
    const total = totalPrice + taxAmount;
    return total.toFixed(2);
  };
  const calculateGrandTotal = () => {
    let sum = 0;
    items.forEach(item => {
       sum += parseFloat(item.total);
    });
    setGrandTotal(sum.toFixed(2));
  };


  const handleAddItem = () => {
    const updatedItems = [...items, { name: '', price: 0, quantity: 0, tax: 0,total:0 }];
    setItems(updatedItems);
    setGrandTotal(calculateGrandTotal(updatedItems));
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    calculateGrandTotal();
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    updatedItems[index].total = calculateTotal(updatedItems[index]);
    setItems(updatedItems);
    calculateGrandTotal();
  };

  const handleSubmit = async () => {
    try {
      const data = {
        
        seller_info: sellerInfo,
        buyer_info: buyerInfo,
        items_info: items,
        
      };
      const response = await axios.post('http://127.0.0.1:8000/generate_invoice/', data);
      setResponse(response.data.message);
    } catch (error) {
      console.error('Error generating invoice:', error);
      setResponse('Error generating invoice');
    }
  };

  return (
    <>
      <h1>Invoice Generator</h1>
      <div className='invoice_no_date'>
        <h3>Invoice No. #{invoiceNumber}</h3>
        <h3>Date {currentDate}</h3>
      </div>

      <div className='seller_buyer_details'>

        <div>
        <h2>Seller Information</h2>
          <div className='sell_Info'>
        <input 
        type="text" 
        placeholder="Name" 
        value={sellerInfo.name} 
        onChange={(e) => setSellerInfo({ ...sellerInfo, name: e.target.value })} 
        />

        <input 
        type="text" 
        placeholder="Phone" 
        value={sellerInfo.phone} 
        onChange={(e) => setSellerInfo({ ...sellerInfo, phone: e.target.value })} 
        />

        <input 
        type="text" 
        placeholder="Address" 
        value={sellerInfo.address} 
        onChange={(e) => setSellerInfo({ ...sellerInfo, address: e.target.value })} 
        />
          </div>
        </div>

        <div>
        <h2>Buyer Information</h2>
          <div className='buy_Info'>
        <input 
        type="text" 
        placeholder="Name" 
        value={buyerInfo.name} 
        onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })} 
        />

        <input 
        type="text" 
        placeholder="Phone" 
        value={buyerInfo.phone} 
        onChange={(e) => setBuyerInfo({ ...buyerInfo, phone: e.target.value })} 
        />

        <input 
        type="text" 
        placeholder="Address" 
        value={buyerInfo.address} 
        onChange={(e) => setBuyerInfo({ ...buyerInfo, address: e.target.value })} 
        />
          </div>

        </div>

      </div>

      <div className='item_info'>
        <h2>Items Information</h2>

        {items.map((item, index) => (
          <div className='items_input' key={index}>
            <input className='inputs' 
            type="text" placeholder="Name" 
            value={item.name} 
            onChange={(e) => handleItemChange(index, 'name', e.target.value)} />

            <input className='inputs' 
            type="number" 
            placeholder="Price" 
            value={item.price} 
            onChange={(e) => handleItemChange(index, 'price', e.target.value)} />

            <input className='inputs' 
            type="number" 
            placeholder="Quantity" 
            value={item.quantity} 
            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} />

            <input className='inputs' 
            type="number" 
            placeholder="Tax" 
            value={item.tax} 
            onChange={(e) => handleItemChange(index, 'tax', e.target.value)} />

            <button className='remove' onClick={() => handleRemoveItem(index)}>Remove</button>
          </div>
        ))}
      </div>

      <div>
        <h3>Grand total: ${grandTotal}</h3>
      </div>

      <div className='container'>
        <button className='buttons' onClick={handleAddItem}>Add Item</button>
        <button className='buttons' onClick={handleSubmit}>Generate Invoice</button>
        {response && <p>{response}</p>}
      </div>
      
    </>
  );
}

export default App;
