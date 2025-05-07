const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
  logo: { type: String, required: true },
  
  // Social links
  socials: [{
    platform: { type: String, required: true }, // e.g., 'facebook', 'twitter', etc.
    url: { type: String, required: true },
    icon: { type: String, required: true } // Icon class or name
  }],
  
  // Footer navigation links (Quick Link, Support, etc.)
  quickLinks: [{
    title: { type: String, required: true },
    links: [{
      href: { type: String, required: true },
      label: { type: String, required: true }
    }]
  }],
  
  support: [{
    title: { type: String, required: true },
    links: [{
      href: { type: String, required: true },
      label: { type: String, required: true }
    }]
  }],

  // Business section
  business: {
    title: { type: String, default: "Business" },
    sections: [{
      title: { type: String, required: true }, // e.g., "Corporate", "Institution"
      links: [{
        href: { type: String, required: true },
        label: { type: String, required: true }
      }]
    }]
  },
  
  // Contact information
  contact: {
    title: { type: String, default: "Contact" },
    phone: { type: String },
    secondaryNumber: { type: String },
    address: { type: String },
    email: { type: String },
  },
  
  // Meta data
  lastModifiedBy: { type: String },
  lastModifiedOn: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Footer', footerSchema);