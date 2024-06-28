import axios from 'axios';
import { convert } from 'xml-js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, message, options, dealershipId } = req.body;

    // Fetch dealership info from Supabase
    const { data: dealership, error } = await supabase
      .from('dealerships')
      .select('leads_email')
      .eq('id', dealershipId)
      .single();

    if (error) {
      return res.status(500).json({ message: 'Error fetching dealership info', error: error.message });
    }

    const xmlData = {
      lead: {
        _attributes: {
          source: 'Website',
          dealershipId: dealershipId
        },
        customer: {
          name: { _text: name },
          email: { _text: email },
          phone: { _text: phone },
          message: { _text: message },
          options: { _text: options.join(', ') }
        }
      }
    };

    const xml = convert.js2xml(xmlData, { compact: true, spaces: 2 });

    try {
      await axios.post(dealership.leads_email, xml, {
        headers: {
          'Content-Type': 'application/xml'
        }
      });
      res.status(200).json({ message: 'Lead submitted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error submitting lead', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
