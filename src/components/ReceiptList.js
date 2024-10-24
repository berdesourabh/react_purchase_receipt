import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";
import { Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx'; // Import xlsx for Excel export
import './ReceiptList.css';

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

  // Function to export receipts data to Excel excluding the 'id' field and including date in the filename
  const exportToExcel = () => {
    const filteredData = receipts.map(({ id, ...rest }) => rest); // Exclude the 'id' field
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Receipts");
    const now = new Date();
    const formattedDate = now.toLocaleDateString().replace(/\//g, '-');
    const formattedTime = now.toLocaleTimeString().replace(/:/g, '-');
    const fileName = `receipts_data_${formattedDate}_${formattedTime}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  return (
    <Box className="receipt-list-container">
      <div className="button-container">
        <Button onClick={() => navigate("/")} variant="contained">
          Back
        </Button>

        <Button variant="contained" onClick={exportToExcel} className="export-excel-button">
          Export to excel
        </Button>
      </div>

      <Typography variant="h4" className="receipt-list-title" gutterBottom>
        पावत्यांची यादी
      </Typography>

      {/* Search Fields */}
      <Box sx={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <TextField
          label="ग्राहकाचे नाव शोधा"
          variant="outlined"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <TextField
          label="खरेदी दिनांक शोधा"
          type="date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <Button variant="contained" size="small" onClick={handleFilter}>
          Search
        </Button>
      </Box>

      {filteredReceipts.length === 0 ? (
        <Typography variant="body1" align="center">
          पावत्या उपलब्ध नाहीत
        </Typography>
      ) : (
        <div>
          {/* Column headers */}
          <div className="receipt-grid-header">
            <span>ग्राहकाचे नाव</span>
            <span>फोन नंबर</span>
            <span>खरेदी दिनांक</span>
            <span>SGST</span>
            <span>CGST</span>
            <span>एकूण रक्कम</span>
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
                  Details
                </Button>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Dialog for Viewing Receipt Details */}
      {selectedReceipt && (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>पावती तपशील</DialogTitle>
          <DialogContent>
            <Typography variant="body1"><strong>ग्राहकाचे नाव:</strong> {selectedReceipt.customerName}</Typography>
            <Typography variant="body1"><strong>फोन नंबर:</strong> {selectedReceipt.phoneNumber}</Typography>
            <Typography variant="body1"><strong>ग्राहकाचे GST:</strong> {selectedReceipt.customerGST}</Typography>
            <Typography variant="body1"><strong>खरेदी दिनांक:</strong> {selectedReceipt.purchaseDate}</Typography>
            <Typography variant="body1"><strong>SGST:</strong> {selectedReceipt.sgst}</Typography>
            <Typography variant="body1"><strong>CGST:</strong> {selectedReceipt.cgst}</Typography>
            <Typography variant="body1"><strong>एकूण रक्कम:</strong> {selectedReceipt.totalAmount}</Typography>

            {/* Display Items */}
            <Typography variant="h6" sx={{ marginTop: '20px' }}>खरेदी केलेल्या वस्तू</Typography>
            {selectedReceipt.items.map((item, index) => (
              <Box key={index} sx={{ marginTop: '10px', paddingLeft: '20px' }}>
                <Typography variant="body2"><strong>वस्तूचे नाव:</strong> {item.itemName}</Typography>
                <Typography variant="body2"><strong>प्रमाण:</strong> {item.quantity}</Typography>
                <Typography variant="body2"><strong>ऑफर किंमत:</strong> ₹{item.offeredPrice}</Typography>
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} variant="contained">बंद करा</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default ReceiptList;