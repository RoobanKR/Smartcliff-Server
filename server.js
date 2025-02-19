const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const userAuth = require("./routes/userAuth");
const wcuRoutes = require("./routes/wcuRoutes");
const faqRoutes = require("./routes/faqRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const careerOppertunitiesRoutes = require("./routes/careerOppertunitiesRoutes");
const coursemodulesRoutes = require("./routes/courseModulesRoutes");
const toolSoftwareRoutes = require("./routes/tool_SoftwareRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const courseRoutes = require("./routes/courseRoutes");
const batchesRoutes = require("./routes/batchRoutes");
const entrollBatchRoutes = require("./routes/entrollBatchRoutes");


const degreeProgramRoutes = require("./routes/degreeProgram/degreeProgramRoutes");
const ourProgramRoutes = require("./routes/degreeProgram/ourProgramRoutes");
const admissionProcessRoutes = require("./routes/degreeProgram/admissionProcessRoutes");
const programMentorRoutes = require("./routes/degreeProgram/programMentorRoutes");
const programFeesRoutes = require("./routes/degreeProgram/programFeesRoutes");
const eligibilityCriteriaRoutes = require("./routes/degreeProgram/eligibilityCriteriaRoutes");
const semesterRoutes = require("./routes/degreeProgram/semesterRoutes");
const outcomeRoutes = require("./routes/degreeProgram/outcomeRoutes");
const highlightRoutes = require("./routes/degreeProgram/highlightRoutes");
const courseApplyNowRoutes = require("./routes/courseApplyNowRoutes");
const programApplyRoutes = require("./routes/degreeProgram/ApplyProgramRoutes");
// services
const businessServicesRoutes = require("./routes/services/businessServicesRoutes");

const servicesRoutes = require("./routes/services/servicesRoutes");
const servicesAboutRoutes = require("./routes/services/aboutRoutes");
const servicesProcessRoutes = require("./routes/services/processRoutes");
const servicesClientRoutes = require("./routes/services/clientRoutes");
const serviceOpportunityRoutes = require("./routes/services/serviceOppertunityRoutes");


const companyLogoRoutes = require("./routes/services/companyLogoRoutes");
const executionHighlightRoutes = require("./routes/services/executionHighlightsRoutes");
const executionOverviewRoutes = require("./routes/services/executionOverviewRoutes");
const serviceTestimonialRoutes = require("./routes/services/serviceTestimonialRoutes");
const serviceGalleryRoutes = require("./routes/services/galleryRoutes");
const managedCampusRoutes = require("./routes/services/managedCampusRoutes");

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



const path = require("path");

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(
  cors({
    //origin: ["http://localhost:3000", "http://localhost:3535"],
    origin: [
      // "http://localhost:3000",
      "https://smart-cliff-next-js.vercel.app",
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
app.use(
  "/uploads/users",
  express.static(path.join(__dirname, "uploads/users"))
);
app.use(
  "/uploads/users",
  express.static(path.join(__dirname, "uploads/users"))
);

app.use(
  "/uploads/super_admin",
  express.static(path.join(__dirname, "uploads/super_admin"))
);
// app.use(
//   "/uploads/category",
//   express.static(path.join(__dirname, "uploads/category"))
// );
// app.use(
//   "/uploads/career_opportunities",
//   express.static(path.join(__dirname, "uploads/career_opportunities"))
// );
// app.use(
//   "/uploads/tool_software",
//   express.static(path.join(__dirname, "uploads/tool_software"))
// );
// app.use(
//   "/uploads/instructor",
//   express.static(path.join(__dirname, "uploads/instructor"))
// );
// app.use(
//   "/uploads/course",
//   express.static(path.join(__dirname, "uploads/course"))
// );
// app.use(
//   "/uploads/batches",
//   express.static(path.join(__dirname, "uploads/batches"))
// );
app.use(
  "/uploads/degreeprogram/degree/images",
  express.static(path.join(__dirname, "/uploads/degreeprogram/degree/images"))
);
// app.use(
//   "/uploads/mca/our_program",
//   express.static(path.join(__dirname, "/uploads/mca/our_program"))
// );
// app.use(
//   "/uploads/mca/assesment",
//   express.static(path.join(__dirname, "/uploads/mca/assesment"))
// );

// app.use(
//   "/uploads/mca/program_mentor",
//   express.static(path.join(__dirname, "/uploads/mca/program_mentor"))
// );
// app.use(
//   "/uploads/mca/program_fees",
//   express.static(path.join(__dirname, "/uploads/mca/program_fees"))
// );
// app.use(
//   "/uploads/mca/eligibility_criteria",
//   express.static(path.join(__dirname, "/uploads/mca/eligibility_criteria"))
// );
// app.use(
//   "/uploads/mca/outcome",
//   express.static(path.join(__dirname, "/uploads/mca/outcome"))
// );
// app.use(
//   "/uploads/program_apply",
//   express.static(path.join(__dirname, "uploads/program_apply"))
// );

// Services


app.use(
  "/uploads/services/service/icon",
  express.static(path.join(__dirname, "uploads/services/service/icon"))
);
app.use(
  "/uploads/services/about/icon",
  express.static(path.join(__dirname, "uploads/services/about/icon"))
);
app.use(
  "/uploads/services/about/images",
  express.static(path.join(__dirname, "uploads/services/about/images"))
);
app.use(
  "/uploads/services/process/icon",
  express.static(path.join(__dirname, "uploads/services/process/icon"))
);
app.use(
  "/uploads/services/client",
  express.static(path.join(__dirname, "uploads/services/client"))
);

app.use(
  "/uploads/services/highlights",
  express.static(path.join(__dirname, "uploads/services/highlights"))
);

app.use(
  "/uploads/services/opportunity",
  express.static(path.join(__dirname, "uploads/services/opportunity"))
);

// app.use(
//   "/uploads/services/company_logo",
//   express.static(path.join(__dirname, "uploads/services/company_logo"))
// );
// app.use(
//   "/uploads/services/execution_highlights",
//   express.static(path.join(__dirname, "uploads/services/execution_highlights"))
// );
// app.use(
//   "/uploads/services/testimonial",
//   express.static(path.join(__dirname, "uploads/services/testimonial"))
// );
// app.use(
//   "/uploads/services/gallery",
//   express.static(path.join(__dirname, "uploads/services/gallery"))
// );
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
app.use("/",programMentorRoutes);
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


app.use("/", businessServicesRoutes)
app.use("/", servicesAboutRoutes)
app.use("/", servicesProcessRoutes)
app.use("/", servicesClientRoutes)
app.use("/", serviceOpportunityRoutes)


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



const PORT = process.env.PORT || 5353;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
