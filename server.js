const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const userAuth = require("./routes/userAuth");
const wcuRoutes = require("./routes/about/wcuRoutes");
const faqRoutes = require("./routes/faqRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const careerOppertunitiesRoutes = require("./routes/careerOppertunitiesRoutes");
const coursemodulesRoutes = require("./routes/courseModulesRoutes");
const toolSoftwareRoutes = require("./routes/tool_SoftwareRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const courseRoutes = require("./routes/courseRoutes");
const batchesRoutes = require("./routes/batchRoutes");
const entrollBatchRoutes = require("./routes/entrollBatchRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const contactRoutes = require("./routes/contactRoutes");
const careerFormRoutes = require("./routes/careerFormRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const joinUsRoutes = require("./routes/joinUsRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const careerRoutes = require("./routes/carrerRoutes");

const degreeProgramRoutes = require("./routes/degreeProgram/degreeProgramRoutes");
const ourProgramRoutes = require("./routes/degreeProgram/ourProgramRoutes");
const admissionProcessRoutes = require("./routes/degreeProgram/admissionProcessRoutes");
const targetStudentRoutes = require("./routes/degreeProgram/targetStudentRoutes");
const programFeesRoutes = require("./routes/degreeProgram/programFeesRoutes");
const eligibilityCriteriaRoutes = require("./routes/degreeProgram/eligibilityCriteriaRoutes");
const semesterRoutes = require("./routes/degreeProgram/semesterRoutes");
const outcomeRoutes = require("./routes/degreeProgram/outcomeRoutes");
const highlightRoutes = require("./routes/degreeProgram/highlightRoutes");
const courseApplyNowRoutes = require("./routes/courseApplyNowRoutes");
const programApplyRoutes = require("./routes/degreeProgram/ApplyProgramRoutes");
const ourPartnersRoutes = require("./routes/degreeProgram/ourPartnersRoutes");
const ourSponosrsRoutes = require("./routes/degreeProgram/ourSponosorsRoutes");
const collegeRoutes = require("./routes/degreeProgram/collegeRoutes");
const certificationRoutes = require("./routes/degreeProgram/certificationRoutes");

// services

const businessServicesRoutes = require("./routes/services/businessServicesRoutes");

const servicesRoutes = require("./routes/services/servicesRoutes");
const servicesAboutRoutes = require("./routes/services/aboutRoutes");
const servicesProcessRoutes = require("./routes/services/processRoutes");
const serviceOpportunityRoutes = require("./routes/services/serviceOppertunityRoutes");
const placementTrainingTrackRoutes = require("./routes/services/placementTrainingTrackRoutes");

const companyLogoRoutes = require("./routes/services/companyLogoRoutes");
const executionHighlightRoutes = require("./routes/services/executionHighlightsRoutes");
const executionOverviewRoutes = require("./routes/services/executionOverviewRoutes");
const serviceTestimonialRoutes = require("./routes/services/serviceTestimonialRoutes");
const serviceGalleryRoutes = require("./routes/services/galleryRoutes");
const managedCampusRoutes = require("./routes/services/managedCampusRoutes");
const skillVerticalRoutes = require("./routes/degreeProgram/skillVerticalRoutes");

// hiring
const hiringRoutes = require("./routes/hiring/hiringRoutes");
const hireFromUsRoutes = require("./routes/hiring/hireFromUsRoutes");
const hiringApplyRoutes = require("./routes/hiring/hiringApplyRoutes");
const trainFromUsRoutes = require("./routes/hiring/trainFromUsRoutes");
const instituteRoutes = require("./routes/hiring/instituteFormRoutes");

// business
const keyElementsRoutes = require("./routes/bussiness/keyElementsRoutes");
const businessPlacementsRoutes = require("./routes/bussiness/bussinessPlacementsRoutes");
const engagedGovermenceRoutes = require("./routes/bussiness/engagedGovermanceRoutes");
const learningJourneyRoutes = require("./routes/bussiness/learningJourneyRoutes");
const wcyRoutes = require("./routes/bussiness/WCYHireRoutes");
const howItWorksRoutes = require("./routes/bussiness/howItWorksRoutes");
const currentAvialbilityRoutes = require("./routes/bussiness/currentAvailabilityRoutes");
const clientRoutes = require("./routes/bussiness/clientRoutes");

// home service 
const homeServicesRoutes = require("./routes/home/homeSerivesCountRoutes");
const homeExecutionHighlightsRoutes = require("./routes/home/HomeExectionHighlightsRoutes");
// About 
const aboutAboutUsRoutes = require("./routes/about/aboutUsRoutes");
const visionMissionUsRoutes = require("./routes/about/visionmissionRoutes");
const shineRoutes = require("./routes/about/shineRoutes");
const yearlyServicesRoutes = require("./routes/about/yearlyServicesRoutes");





const path = require("path");

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://smartcliff.academy",
      "http://localhost:3535",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: ["Content-Length", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(fileUpload());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Home route
app.get("/", (req, res) => res.send("API Running"));

// Define Routes
app.use("/", userAuth);
app.use("/", wcuRoutes);
app.use("/",faqRoutes);
app.use("/",categoryRoutes);
app.use("/",careerOppertunitiesRoutes);
app.use("/",coursemodulesRoutes);
app.use("/",toolSoftwareRoutes);
app.use("/",instructorRoutes);
app.use("/",courseRoutes);
app.use("/",degreeProgramRoutes);
app.use("/",ourProgramRoutes);
app.use("/",admissionProcessRoutes);
app.use("/",targetStudentRoutes);
app.use("/",programFeesRoutes);
app.use("/",eligibilityCriteriaRoutes);
app.use("/",semesterRoutes);
app.use("/",outcomeRoutes);
app.use("/",highlightRoutes);
app.use("/",courseApplyNowRoutes);
app.use("/",programApplyRoutes);
app.use("/",servicesRoutes);
app.use("/",companyLogoRoutes);
app.use("/", executionHighlightRoutes)
app.use("/", executionOverviewRoutes)
app.use("/", serviceTestimonialRoutes)
app.use("/", serviceGalleryRoutes)
app.use("/", managedCampusRoutes)
app.use("/",entrollBatchRoutes);
app.use("/", batchesRoutes)
app.use("/", enquiryRoutes)
app.use("/", contactRoutes)
app.use("/", careerFormRoutes)
app.use("/", reviewRoutes)
app.use("/", joinUsRoutes)
app.use("/", galleryRoutes)
app.use("/", ourPartnersRoutes)
app.use("/", ourSponosrsRoutes)
app.use("/",careerRoutes)
app.use("/",collegeRoutes)
app.use("/",certificationRoutes)

app.use("/",skillVerticalRoutes)

// home
app.use("/", homeServicesRoutes)
app.use("/", homeExecutionHighlightsRoutes)
// Abbout
app.use("/", aboutAboutUsRoutes)
app.use("/", visionMissionUsRoutes)
app.use("/", shineRoutes)
app.use("/", yearlyServicesRoutes)





app.use("/", businessServicesRoutes)
app.use("/", servicesAboutRoutes)
app.use("/", servicesProcessRoutes)
app.use("/", clientRoutes)
app.use("/", serviceOpportunityRoutes)
app.use("/",placementTrainingTrackRoutes);

// hiring
app.use("/",hiringRoutes);
app.use("/",hireFromUsRoutes);
app.use("/",hiringApplyRoutes);
app.use("/",trainFromUsRoutes);
app.use("/",instituteRoutes);

// business
app.use("/",keyElementsRoutes);
app.use("/",businessPlacementsRoutes);
app.use("/",engagedGovermenceRoutes);
app.use("/",learningJourneyRoutes);
app.use("/",wcyRoutes);
app.use("/",howItWorksRoutes);
app.use("/",currentAvialbilityRoutes);




const PORT = process.env.PORT || 5353;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
