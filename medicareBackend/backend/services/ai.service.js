const HealthTip = require('../models/HealthTip');
const Patient = require('../models/Patient');
const logService = require('./log.service');
const cron = require('node-cron');

// AI-generated health tips based on pregnancy week
const generateHealthTipByWeek = (week) => {
  const healthTips = {
    // First Trimester (1-12 weeks)
    1: {
      title: "Welcome to Your Pregnancy Journey",
      content: "Take folic acid supplements, avoid alcohol and smoking, and schedule your first prenatal appointment. Start tracking your symptoms and eat regular, balanced meals."
    },
    2: {
      title: "Early Pregnancy Nutrition",
      content: "Focus on foods rich in folic acid like leafy greens, citrus fruits, and fortified cereals. Stay hydrated and eat small, frequent meals to combat nausea."
    },
    3: {
      title: "Managing Morning Sickness",
      content: "Try eating ginger, keeping crackers by your bedside, and avoiding strong smells. Eat small meals throughout the day and stay hydrated with clear fluids."
    },
    4: {
      title: "First Prenatal Visit Preparation",
      content: "Prepare questions for your doctor, bring your medical history, and discuss any medications you're taking. This is when you'll likely hear your baby's heartbeat for the first time."
    },
    5: {
      title: "Hormone Changes and Your Body",
      content: "Mood swings, breast tenderness, and fatigue are normal. Get plenty of rest, maintain a regular sleep schedule, and don't hesitate to ask for support."
    },
    6: {
      title: "Safe Exercise During Early Pregnancy",
      content: "Light exercises like walking, swimming, and prenatal yoga are beneficial. Avoid contact sports and activities with fall risks. Always consult your doctor before starting new exercises."
    },
    8: {
      title: "Prenatal Vitamins Importance",
      content: "Continue taking prenatal vitamins with folic acid, iron, and calcium. These support your baby's neural tube development and prevent birth defects."
    },
    10: {
      title: "Managing Pregnancy Fatigue",
      content: "Rest when you can, maintain a healthy diet, and don't overexert yourself. Fatigue is your body's way of telling you to slow down and nurture your growing baby."
    },
    12: {
      title: "End of First Trimester",
      content: "Congratulations on reaching 12 weeks! Morning sickness may start to ease, and your energy levels might improve. Continue regular prenatal care."
    },
    
    // Second Trimester (13-27 weeks)
    14: {
      title: "Second Trimester Energy Boost",
      content: "Many women feel more energetic now. This is a great time to prepare the nursery, take childbirth classes, and enjoy your pregnancy glow."
    },
    16: {
      title: "Feeling Baby's First Movements",
      content: "You might start feeling gentle flutters or bubbles. These movements will become stronger over time. Track your baby's activity patterns."
    },
    18: {
      title: "Anatomy Scan Preparation",
      content: "Around this time, you'll have an anatomy scan to check your baby's development. This is often when you can learn your baby's sex if you choose."
    },
    20: {
      title: "Halfway Point Celebration",
      content: "You're halfway through your pregnancy! Focus on a balanced diet with extra protein and calcium. Your baby is now about the size of a banana."
    },
    22: {
      title: "Skin and Hair Changes",
      content: "Pregnancy hormones may cause skin darkening or hair changes. Use gentle, fragrance-free products and always wear sunscreen when outdoors."
    },
    24: {
      title: "Viability Milestone",
      content: "Your baby has reached an important milestone! Continue regular prenatal visits and monitor your baby's movements. Start thinking about birth preferences."
    },
    26: {
      title: "Preparing for Third Trimester",
      content: "Begin thinking about your birth plan, tour the maternity ward, and consider taking breastfeeding classes. Monitor for signs of preterm labor."
    },
    
    // Third Trimester (28-40+ weeks)
    28: {
      title: "Welcome to Third Trimester",
      content: "You're in the final stretch! Visits become more frequent now. Watch for signs of preeclampsia: severe headaches, vision changes, or sudden swelling."
    },
    30: {
      title: "Baby's Rapid Growth",
      content: "Your baby is gaining weight rapidly. You might experience shortness of breath as your baby grows. Practice relaxation techniques and prenatal breathing exercises."
    },
    32: {
      title: "Getting Ready for Baby",
      content: "Prepare your hospital bag, install the car seat, and finalize your birth plan. Start practicing perineal massage to help prepare for delivery."
    },
    34: {
      title: "Monitoring Baby's Movements",
      content: "Pay attention to your baby's movement patterns. You should feel at least 10 movements in 2 hours. Contact your healthcare provider if movements decrease significantly."
    },
    36: {
      title: "Baby is Considered Full-Term Soon",
      content: "Your baby's lungs are maturing. Practice your breathing techniques, finish any last-minute preparations, and rest as much as possible."
    },
    37: {
      title: "Full-Term Pregnancy",
      content: "Your baby is now considered full-term! Labor could start any time. Know the signs of labor and when to contact your healthcare provider."
    },
    38: {
      title: "Final Preparations",
      content: "Double-check your hospital bag, confirm your birth plan with your healthcare team, and ensure you have reliable transportation to the hospital."
    },
    39: {
      title: "Signs of Labor",
      content: "Watch for regular contractions, water breaking, or bloody show. Time contractions and contact your healthcare provider when they're 5 minutes apart for 1 hour."
    },
    40: {
      title: "Your Due Date",
      content: "You've reached your due date! Only 5% of babies are born on their exact due date. Stay calm, rest when possible, and trust your body's process."
    },
    41: {
      title: "Post-Due Date Monitoring",
      content: "Your healthcare provider will monitor you and your baby closely. Non-stress tests and fluid checks help ensure your baby's well-being."
    },
    42: {
      title: "Extended Pregnancy",
      content: "Your healthcare provider may discuss induction options. Continue monitoring baby's movements and attend all scheduled appointments."
    }
  };

  // Return the tip for the specific week, or a general tip if week not found
  return healthTips[week] || {
    title: "General Pregnancy Wellness",
    content: "Maintain regular prenatal care, eat a balanced diet, stay hydrated, get adequate rest, and don't hesitate to contact your healthcare provider with any concerns."
  };
};

// Generate personalized health tips for patients
const generatePersonalizedTips = async () => {
  try {
    console.log('[AI Service] Generating personalized health tips...');
    
    const patients = await Patient.find().populate('user', 'name');
    let tipsGenerated = 0;

    for (const patient of patients) {
      if (!patient.edd) continue;

      // Calculate current pregnancy week
      const today = new Date();
      const eddDate = new Date(patient.edd);
      const msPerWeek = 7 * 24 * 60 * 60 * 1000;
      const weeksUntilDue = Math.ceil((eddDate.getTime() - today.getTime()) / msPerWeek);
      const currentWeek = Math.max(1, Math.min(42, 40 - weeksUntilDue));

      // Check if we already have a tip for this week
      const existingTip = await HealthTip.findOne({
        relevantWeek: currentWeek,
        createdAt: {
          $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate())
        }
      });

      if (!existingTip) {
        // Generate AI tip for this week
        const weeklyTip = generateHealthTipByWeek(currentWeek);
        
        // Create health tip in database
        const healthTip = await HealthTip.create({
          title: weeklyTip.title,
          content: weeklyTip.content,
          relevantWeek: currentWeek,
          tags: ['AI-Generated', `Week-${currentWeek}`, 'Personalized'],
          createdBy: patient.user._id || '60d5f484f72f7c1a4c8b4567' // Default system user ID
        });

        tipsGenerated++;

        await logService.logActivity(
          'ai_system',
          'system',
          `Generated AI health tip for week ${currentWeek}: "${weeklyTip.title}"`,
          'HealthTip',
          healthTip._id
        );
      }
    }

    console.log(`[AI Service] Generated ${tipsGenerated} new health tips`);
    return tipsGenerated;
  } catch (error) {
    console.error('[AI Service] Error generating tips:', error.message);
    await logService.logActivity(
      'ai_system_error',
      'system',
      `Failed to generate AI tips: ${error.message}`,
      'SystemError'
    );
    throw error;
  }
};

// Schedule AI tip generation (runs every day at 6 AM)
const scheduleAIHealthTips = () => {
  cron.schedule('0 6 * * *', async () => {
    console.log('[AI Scheduler] Starting daily AI health tip generation...');
    try {
      await generatePersonalizedTips();
    } catch (error) {
      console.error('[AI Scheduler] Error:', error.message);
    }
  });

  console.log('✔️ AI Health tip generator scheduled (runs daily @ 6 AM).');
};

// Get tips based on pregnancy week
const getTipsByWeek = async (week) => {
  try {
    const tips = await HealthTip.find({ relevantWeek: week })
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 });
    
    return tips;
  } catch (error) {
    console.error('Error fetching tips by week:', error);
    throw error;
  }
};

// Get tips for current user based on their pregnancy week
const getPersonalizedTips = async (userId) => {
  try {
    const patient = await Patient.findOne({ user: userId });
    
    if (!patient || !patient.edd) {
      // Return general tips if no patient record or EDD
      return await HealthTip.find()
        .populate('createdBy', 'name role')
        .sort({ createdAt: -1 })
        .limit(5);
    }

    // Calculate current pregnancy week
    const today = new Date();
    const eddDate = new Date(patient.edd);
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weeksUntilDue = Math.ceil((eddDate.getTime() - today.getTime()) / msPerWeek);
    const currentWeek = Math.max(1, Math.min(42, 40 - weeksUntilDue));

    // Get tips for current week and adjacent weeks
    const tips = await HealthTip.find({
      relevantWeek: { $in: [currentWeek - 1, currentWeek, currentWeek + 1] }
    })
    .populate('createdBy', 'name role')
    .sort({ relevantWeek: -1, createdAt: -1 });

    return tips;
  } catch (error) {
    console.error('Error fetching personalized tips:', error);
    throw error;
  }
};

module.exports = {
  generateHealthTipByWeek,
  generatePersonalizedTips,
  scheduleAIHealthTips,
  getTipsByWeek,
  getPersonalizedTips
};
