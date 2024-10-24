import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'
import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";
import { Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // For navigation
import './ReceiptList.css'; // Import the external CSS file

function ReceiptList() {
  const [receipts, setReceipts] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]); // To store filtered receipts
  const [selectedReceipt, setSelectedReceipt] = useState(null); // To store selected receipt details
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [openDialog, setOpenDialog] = useState(false); // Control the modal
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchReceipts = async () => {
      const receiptQuery = query(collection(db, "receipts"), orderBy("purchaseDate", "desc"));
      const querySnapshot = await getDocs(receiptQuery);
      const receiptList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReceipts(receiptList);
      setFilteredReceipts(receiptList); // Initialize filtered receipts
    };

    fetchReceipts();
  }, []);

  const handleViewDetails = async (receiptId) => {
    const receiptDoc = await getDoc(doc(db, "receipts", receiptId));
    if (receiptDoc.exists()) {
      setSelectedReceipt(receiptDoc.data());
      setOpenDialog(true); // Open the dialog to show details
    } else {
      alert("No additional details found for this receipt.");
    }
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReceipt(null); // Clear the selected receipt
  };

  // Function to handle filtering
  const handleFilter = () => {
    const filtered = receipts.filter(receipt =>
      receipt.customerName.toLowerCase().includes(searchName.toLowerCase()) &&
      receipt.purchaseDate.includes(searchDate)
    );
    setFilteredReceipts(filtered);
  };

  return (
    <Box className="receipt-list-container">
      {/* Back Button */}
      <Button onClick={() => navigate("/")} variant="outlined" sx={{ marginBottom: '20px' }}>
        Back
      </Button>

      <Typography variant="h4" className="receipt-list-title" gutterBottom>
        Receipts List
      </Typography>

      {/* Search Fields */}
      <Box sx={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <TextField
          label="Search by Customer Name"
          variant="outlined"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <TextField
          label="Search by Purchase Date"
          type="date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <Button variant="contained" onClick={handleFilter}>
          Search
        </Button>
      </Box>

      {filteredReceipts.length === 0 ? (
        <Typography variant="body1" align="center">
          No receipts available
        </Typography>
      ) : (
        <div>
          {/* Column headers */}
          <div className="receipt-grid-header">
            <span>Customer Name</span>
            <span>Phone Number</span>
            <span>Purchase Date</span>
            <span>SGST</span>
            <span>CGST</span>
            <span>Total Amount</span>
            <span></span> {/* Empty title for View Details */}
          </div>
          
          {/* Filtered Receipt rows */}
          {filteredReceipts.map(receipt => (
            <div key={receipt.id} className="receipt-grid-row">
              <span>{receipt.customerName}</span>
              <span>{receipt.phoneNumber}</span>
              <span>{receipt.purchaseDate}</span>
              <span>{receipt.sgst}</span>
              <span>{receipt.cgst}</span>
              <span>{receipt.totalAmount}</span>
              <span>
                <Button variant="contained" onClick={() => handleViewDetails(receipt.id)}>
                  View Details
                </Button>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Dialog for Viewing Receipt Details */}
      {selectedReceipt && (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Receipt Details</DialogTitle>
          <DialogContent>
            <Typography variant="body1"><strong>Customer Name:</strong> {selectedReceipt.customerName}</Typography>
            <Typography variant="body1"><strong>Phone Number:</strong> {selectedReceipt.phoneNumber}</Typography>
            <Typography variant="body1"><strong>Customer GST:</strong> {selectedReceipt.customerGST}</Typography>
            <Typography variant="body1"><strong>Purchase Date:</strong> {selectedReceipt.purchaseDate}</Typography>
            <Typography variant="body1"><strong>SGST:</strong> {selectedReceipt.sgst}</Typography>
            <Typography variant="body1"><strong>CGST:</strong> {selectedReceipt.cgst}</Typography>
            <Typography variant="body1"><strong>Total Amount:</strong> {selectedReceipt.totalAmount}</Typography>

            {/* Display Items */}
            <Typography variant="h6" sx={{ marginTop: '20px' }}>Items Purchased</Typography>
            {selectedReceipt.items.map((item, index) => (
              <Box key={index} sx={{ marginTop: '10px', paddingLeft: '20px' }}>
                <Typography variant="body2"><strong>Item Name:</strong> {item.itemName}</Typography>
                <Typography variant="body2"><strong>Quantity:</strong> {item.quantity}</Typography>
                <Typography variant="body2"><strong>Offered Price:</strong> ₹{item.offeredPrice}</Typography>
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} variant="contained">Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default ReceiptList;