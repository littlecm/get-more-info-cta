import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default function Admin() {
  const { data: session } = useSession();
  const [dealerships, setDealerships] = useState([]);
  const [newDealership, setNewDealership] = useState({
    name: '',
    leads_email: '',
    address: '',
    phone: ''
  });

  useEffect(() => {
    if (session) {
      fetchDealerships();
    }
  }, [session]);

  const fetchDealerships = async () => {
    const { data, error } = await supabase.from('dealerships').select('*');
    if (error) {
      console.error('Error fetching dealerships:', error);
    } else {
      setDealerships(data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDealership((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDealership = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('dealerships').insert([newDealership]);
    if (error) {
      console.error('Error adding dealership:', error);
    } else {
      setNewDealership({ name: '', leads_email: '', address: '', phone: '' });
      fetchDealerships();
    }
  };

  if (!session) {
    return (
      <div>
        <p>You need to sign in to access the admin dashboard.</p>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={() => signOut()}>Sign out</button>
      <form onSubmit={handleAddDealership}>
        <input type="text" name="name" placeholder="Dealership Name" onChange={handleChange} value={newDealership.name} required />
        <input type="email" name="leads_email" placeholder="Leads Email" onChange={handleChange} value={newDealership.leads_email} required />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} value={newDealership.address} />
        <input type="text" name="phone" placeholder="Phone" onChange={handleChange} value={newDealership.phone} />
        <button type="submit">Add Dealership</button>
      </form>
      <h2>Dealerships</h2>
      <ul>
        {dealerships.map((dealership) => (
          <li key={dealership.id}>
            {dealership.name} - {dealership.leads_email}
          </li>
        ))}
      </ul>
    </div>
  );
}
