const Visitor = require('../models/VisitorModal'); 

// Track a new visitor
exports.trackVisitor = async (req, res) => {
  try {
    
    const { userAgent, page, referrer,ip } = req.body;
    
    const visitor = new Visitor({
      ip,
      userAgent,
      page,
      referrer,
      // You can integrate with IP geolocation service here if needed
      // countryCode: geoData.country,
      // city: geoData.city,
    });

    await visitor.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Visitor tracked successfully' 
    });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to track visitor', 
      error: error.message 
    });
  }
};

// Get visitor statistics
exports.getVisitorStats = async (req, res) => {
  try {
    // Get total count
    const totalCount = await Visitor.countDocuments();
    
    // Get unique visitor count
    const uniqueCount = await Visitor.distinct('ip').then(ips => ips.length);
    
    // Get today's count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Visitor.countDocuments({ 
      visitDate: { $gte: today } 
    });
    
    // Get visitors from last 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const weeklyCount = await Visitor.countDocuments({ 
      visitDate: { $gte: lastWeek } 
    });
    
    // Get last 10 visitors
    const recentVisitors = await Visitor.find()
      .sort({ visitDate: -1 })
      .limit(10)
      .select('ip visitDate page userAgent countryCode city');
    
    res.status(200).json({
      success: true,
      data: {
        totalCount,
        uniqueCount,
        todayCount,
        weeklyCount,
        recentVisitors
      }
    });
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch visitor statistics', 
      error: error.message 
    });
  }
};

// Get detailed visitor logs (with pagination)
exports.getVisitorLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    const logs = await Visitor.find()
      .sort({ visitDate: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Visitor.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        logs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching visitor logs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch visitor logs', 
      error: error.message 
    });
  }
};