'use client';
import { useState, useEffect } from "react";
import { collection, deleteDoc, getDocs, query, getDoc, setDoc, doc } from "firebase/firestore";
import { Box, Button, Modal, Stack, TextField, Typography, Card, CardContent, CardActions, CircularProgress, Divider, Grid } from "@mui/material";
import { firestore } from "@/firebase";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [loading, setLoading] = useState(false);

  const updateInventory = async () => {
    setLoading(true);
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList); // Initialize filtered inventory
    setLoading(false);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    if (term) {
      const filtered = inventory.filter(item =>
        item.name.toLowerCase().includes(term)
      );
      setFilteredInventory(filtered);
    } else {
      setFilteredInventory(inventory);
    }
  };

  const addItem = async (item) => {
    if (!item.trim()) {
      return;
    }
    setLoading(true);
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
    setItemName('');
    handleClose();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center" p={3}>
      <Typography variant="h3" color="primary" mb={4}>Pantry Tracker</Typography>
      
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Search Inventory"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 3, maxWidth: 600 }}
      />

      <Button variant="contained" onClick={handleOpen} sx={{ mb: 3 }}>Add New Item</Button>

      <Box width="100%" maxWidth="1200px">
        <Grid container spacing={3}>
          {filteredInventory.length > 0 ? (
            filteredInventory.map(({ name, quantity }) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Quantity: {quantity}
                    </Typography>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Button size="small" variant="contained" onClick={() => addItem(name)}>Add</Button>
                    <Button size="small" variant="contained" color="secondary" onClick={() => removeItem(name)}>Remove</Button>
                  </CardActions>
                  </Card>
                </Grid>
            ))
          ) : (
            <Typography variant="h6" color="text.secondary">No items found.</Typography>
          )}
        </Grid>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-item-modal"
        aria-describedby="modal-to-add-new-inventory-item"
      >
        <Box 
          position="absolute" 
          top="50%" 
          left="50%" 
          width={400}
          bgcolor="background.paper"
          borderRadius={2}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography id="add-item-modal" variant="h6" component="h2">Add Item</Typography>
          <TextField 
            variant="outlined" 
            fullWidth 
            value={itemName} 
            onChange={(e) => setItemName(e.target.value)} 
            label="Item Name"
            helperText="Enter the name of the item to add."
          />
          <Stack direction="row" spacing={2} mt={2}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => addItem(itemName)}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Add'}
            </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
