import React, { useState } from 'react';

const GetMoreInfoForm = ({ dealershipId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    options: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        options: checked
          ? [...prev.options, value]
          : prev.options.filter((option) => option !== value)
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/submit-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...formData, dealershipId })
    });
    const result = await response.json();
    alert(result.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Your Name" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Your Email" onChange={handleChange} required />
      <input type="text" name="phone" placeholder="Your Phone" onChange={handleChange} required />
      <textarea name="message" placeholder="Your Message" onChange={handleChange}></textarea>
      <label>
        <input type="checkbox" name="options" value="photos" onChange={handleChange} />
        Can you send me photos of this vehicle?
      </label>
      <label>
        <input type="checkbox" name="options" value="walkaround_video" onChange={handleChange} />
        Can you send me a walk-around video of this vehicle?
      </label>
      <label>
        <input type="checkbox" name="options" value="availability" onChange={handleChange} />
        Is this car still available?
      </label>
      <label>
        <input type="checkbox" name="options" value="location" onChange={handleChange} />
        Where is this car located?
      </label>
      <label>
        <input type="checkbox" name="options" value="similar_cars" onChange={handleChange} />
        Do you have other cars that are similar?
      </label>
      <label>
        <input type="checkbox" name="options" value="test_drive" onChange={handleChange} />
        Schedule a test drive
      </label>
      <label>
        <input type="checkbox" name="options" value="price_alert" onChange={handleChange} />
        Sign up for price change alerts
      </label>
      <label>
        <input type="checkbox" name="options" value="sold_alert" onChange={handleChange} />
        Let me know when this vehicle is sold
      </label>
      <label>
        <input type="checkbox" name="options" value="similar_stock" onChange={handleChange} />
        Let me know when similar vehicles come in stock
      </label>
      <label>
        <input type="checkbox" name="options" value="sale_alert" onChange={handleChange} />
        Notify me when this car goes on sale
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default GetMoreInfoForm;
