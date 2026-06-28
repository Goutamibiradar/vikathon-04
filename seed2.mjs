const restaurants = [
  { name: 'Golden Dragon', address: '123 Chinatown Blvd', cuisine: 'Chinese', ownerName: 'Wei Chen', ownerEmail: 'wei@goldendragon.com', status: 'Active' },
  { name: 'The Rusty Spoon', address: '45 Industrial Pkwy', cuisine: 'American', ownerName: 'Mike Davis', ownerEmail: 'mike@rustyspoon.com', status: 'Pending Inspection' },
  { name: 'Ocean View Seafood', address: '88 Marina Drive', cuisine: 'Seafood', ownerName: 'Sarah Harbor', ownerEmail: 'sarah@oceanview.com', status: 'Active' },
  { name: 'Central Perk Cafe', address: '11 Bedford St', cuisine: 'Coffee & Bakery', ownerName: 'Gunther Smith', ownerEmail: 'gunther@centralperk.com', status: 'Active' },
  { name: 'Big Burger Joint', address: '99 Highway Road', cuisine: 'Fast Food', ownerName: 'Tom Beef', ownerEmail: 'tom@bigburger.com', status: 'Suspended' },
  { name: 'Curry House', address: '22 Spice Lane', cuisine: 'Indian', ownerName: 'Anita Patel', ownerEmail: 'anita@curryhouse.com', status: 'Active' },
  { name: 'Bangkok Street Food', address: '33 Thai Ave', cuisine: 'Thai', ownerName: 'Somchai Lee', ownerEmail: 'somchai@bangkokstreet.com', status: 'Active' },
  { name: 'Luigis Pasta', address: '44 Little Italy', cuisine: 'Italian', ownerName: 'Luigi Rossi', ownerEmail: 'luigi@pasta.com', status: 'Pending Inspection' },
  { name: 'The Pancake Parlor', address: '55 Breakfast Blvd', cuisine: 'Breakfast', ownerName: 'Jenny Maple', ownerEmail: 'jenny@pancakeparlor.com', status: 'Active' },
  { name: 'Green Leaf Vegan', address: '66 Eco Way', cuisine: 'Vegan', ownerName: 'Oliver Plant', ownerEmail: 'oliver@greenleaf.com', status: 'Active' }
];

async function seedData() {
  for (const r of restaurants) {
    try {
      const res = await fetch('http://localhost:3000/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(r)
      });
      if (!res.ok) {
        console.error(`Failed to add ${r.name}: ${res.statusText}`);
      } else {
        console.log(`Added: ${r.name}`);
      }
    } catch (e) {
      console.error(`Error adding ${r.name}:`, e.message);
    }
  }
}

seedData();
