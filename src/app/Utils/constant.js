export const topBarHeight = 64;
export const sideNavWidth = 260;
export const navbarHeight = 60;
export const sidenavCompactWidth = 80;
export const containedLayoutWidth = 1200;

export const staffuser = ['staff', 'company-agent']
export const mainuser = ['company', 'agent']
export const allUsers =  ['company', 'agent', 'staff', 'company-agent']

export const nextDates = [
    { label: 'After 3 days', day: 3, type: "days" },
    { label: 'After 7 days', day: 7, type: "days" },
    { label: 'After 1 month', day: 1, type: "months" },
    { label: 'After 6 month', day: 6, type: "months" },
    { label: 'After 1 year', day: 1, type: "years" }
]

export const supportNeedsOptions1 = [
    { label: "Tenancy failure or losing short term accommodation", name: "tenancyFailure" },
    { label: "Becoming homeless / evicted (within 28 Days)", name: "homelessnessRisk" },
    { label: "Ongoing issues with drug and alcohol", name: "substanceAbuse" },
    { label: "Ability to manage ongoing health problems", name: "healthManagement" },
    { label: "Access to local services Rough Sleeping", name: "roughSleepingServices" },
    { label: "Access to health services", name: "healthServicesAccess" },
    { label: "Improved quality of life", name: "qualityOfLifeImprovement" },
    { label: "Build an alternative support network", name: "supportNetworkBuilding" },
    { label: "Skills to eat healthily", name: "healthyEatingSkills" },
    { label: "Access voluntary services", name: "voluntaryServicesAccess" },
    { label: "Ability to manage personal hygiene", name: "personalHygieneManagement" },
    { label: "Risk of domestic abuse", name: "domesticAbuseRisk" },
    { label: "Increase social and community networks", name: "socialNetworkExpansion" },
    { label: "Frequent presentation to accident and emergency", name: "emergencyServicesUsage" },
    { label: "Unplanned hospital admissions", name: "hospitalAdmissions" },
    { label: "Reduce social isolation", name: "socialIsolationReduction" },
    { label: "Accessing drug and alcohol services", name: "substanceAbuseServices" },
    { label: "Obtaining or maintaining a suitable home", name: "suitableHomeMaintenance" },
    { label: "Getting involved in activities", name: "activityInvolvement" },
    { label: "Increased feelings of being less reliant", name: "relianceReduction" },
    { label: "Gaining and/or maintaining employment and/or education and training", name: "employmentEducationMaintenance" },
    { label: "Risk of long-term worklessness", name: "longTermWorklessnessRisk" },
    { label: "Deteriorating financial position", name: "financialPositionDeterioration" },
    { label: "Developing household skills", name: "householdSkillsDevelopment" },
    { label: "Help to find other help", name: "additionalSupportAccess" },
    { label: "Feeling more involved", name: "increasedInvolvement" },
    { label: "Risk of offending", name: "offendingRisk" },
    { label: "Risk of harm from others", name: "harmFromOthersRisk" },
    { label: "Ongoing health issues", name: "ongoingHealthIssues" },
    { label: "Ability to keep home safe & secure", name: "homeSafetySecurity" },
    { label: "Developing problem-solving skills", name: "problemSolvingSkillsDevelopment" },
    { label: "Ability to manage a healthy lifestyle", name: "healthyLifestyleManagement" },
    { label: "Developing personal competence", name: "personalCompetenceDevelopment" },
    { label: "Developing self-esteem", name: "selfEsteemDevelopment" },
    { label: "Increased feelings of being more independent", name: "increasedIndependence" },
    { label: "Ability to manage health & wellbeing", name: "healthWellbeingManagement" },
    { label: "Ability to manage money better", name: "moneyManagementImprovement" },
    { label: "Developing interpersonal skills", name: "interpersonalSkillsDevelopment" },
    { label: "Increased knowledge", name: "knowledgeIncrease" },
    { label: "Increased confidence", name: "confidenceIncrease" },
];

export const supportPlanChoices = [
    { label: "Accessing benefits", name: "accessingBenefits" },
    { label: "Budgeting", name: "budgeting" },
    { label: "Reducing debt", name: "reducingDebt" },
    { label: "Learn how to shop wisely", name: "learnToShopWisely" },
    { label: "Setting up a bank/savings account", name: "settingUpAccount" },
    { label: "Recoup monies owed", name: "recoupMoniesOwed" },
];

export const beHealthyChoices = [
    { label: "Better manage/improve mental health", name: "manageMentalHealth" },
    { label: "Better manage/improve physical health", name: "managePhysicalHealth" },
    { label: "Follow a healthy diet", name: "followHealthyDiet" },
    { label: "Maintain good personal hygiene", name: "maintainHygiene" },
    { label: "Reduce substance misuse (alcohol, drugs)", name: "reduceSubstanceMisuse" },
    { label: "Register with a dentist", name: "registerDentist" },
    { label: "Register with a GP", name: "registerGP" },
];

export const enjoyAndAchieveChoices = [
    { label: "Access training/education", name: "accessTrainingEducation" },
    { label: "Accessing employment", name: "accessingEmployment" },
    { label: "Accessing leisure, faith or cultural activities", name: "accessingLeisure" },
    { label: "Access volunteering", name: "accessVolunteering" },
    { label: "Move on", name: "moveOn" },
    { label: "Support with equality and diversity", name: "supportEqualityDiversity" },
    { label: "To change offending behaviour", name: "change_offending_behaviour" },
    { label: "To access Support Services", name: "access_support_services" },
];;

export const makingContributionChoices = [
    { label: "Establishing positive support networks", name: "establishingSupportNetworks" },
    { label: "Address anti-social behaviour", name: "addressAntiSocialBehaviour" },
    { label: "Address offending behaviour", name: "addressOffendingBehaviour" },
];

export const staySafeChoices = [
    { label: "Develop independent living skills", name: "developLivingSkills" },
    { label: "Maintain accommodation", name: "maintainAccommodation" },
    { label: "Minimize risk of harm", name: "minimizeRiskOfHarm" },
];
export const riskCategories = [
    { label: "Violence / Aggression", name: "violenceAggression" },
    { label: "Known associates", name: "knownAssociates" }, // New
    { label: "Hazards from others (friend/family/visitors)", name: "hazardsFromOthers" }, // New
    { label: "Recent discontinuation of medication", name: "medicationDiscontinuation" }, // New
    { label: "Professional boundaries", name: "professionalBoundaries" },
    { label: "Finance / Gambling / Debt", name: "financeGamblingDebt" },
    { label: "Attempted suicide", name: "attemptedSuicide" }, // New
    { label: "Arson", name: "arson" },
    { label: "Violent ideas/acts", name: "violentIdeasActs" }, // New
    { label: "Substance abuse/alcohol misuse", name: "substanceAbuse" },
    { label: "Harm to self, others or from others/injurious behaviour", name: "harmToSelfOthers" }, // New
    { label: "Criminal/police or court involvement", name: "criminalInvolvement" }, // New
    { label: "Offending behaviour", name: "offendingBehaviour" },
    { label: "Anti-social behaviour", name: "antiSocialBehaviour" },
    { label: "Physical Health", name: "physicalHealth" },
    { label: "Mental Health", name: "mentalHealth" },
    { label: "Sex Offences", name: "sexOffences" }, // New
    { label: "Domestic Abuse", name: "domesticAbuse" }, // New
    { label: "Extreme anger and hostility", name: "extremeanger" }, // New
];



export const signaturearray = [
    { label: "Support Check List", name: "supportCheckList" },
    { label: "License To Occupy", name: "licenseToOccupy" },
    { label: "Your Weekly Service Charge", name: "weeklyServiceCharge" },
    { label: "Missing Person Form", name: "missingPersonForm" },
    { label: "Tenant Photographic ID Consent Form", name: "tenantIdConsentForm" },
    { label: "Personal Details", name: "personalDetails" },
    { label: "License Charge Payments", name: "licenseChargePayments" },
    { label: "Fire Evacuation Procedure For All Residents", name: "fireEvacuationProcedure" },
    { label: "Support Agreement", name: "supportAgreement" },
    { label: "Complaints Procedure Declaration", name: "complaintsProcedureDeclaration" },
    { label: "Confidentiality Waiver Form", name: "confidentialityWaiverForm" },
    { label: "Nill Income Form", name: "niIncomeForm" },
    { label: "Authorization Form", name: "authorizationForm" },
    { label: "Support Services", name: "supportServices" },
]

export const ArrayforotherDetails = [
    { radio_titel: 'Are you or your partner a student?', radio_name: 'isYouorptnrIstd', sel_title: 'Who is a student?', sel_name: 'whoisStd' },
    { radio_titel: 'Are you or your partner incapable of work or treated as incapable of work?', radio_name: 'incapableofwork', sel_name: 'whoisincapableofwork', sel_title: 'Who is incapable of work?' },
    { radio_titel: 'Are you or your partner registered blind?', radio_name: 'isBlind', sel_name: 'whoisblind', sel_title: 'Who is Blind' },
    { radio_titel: 'Were you or your partner previously registered as blind?', radio_name: 'ispreblind', sel_name: 'whowasregasblind', sel_title: 'Who was registered as blind?' },
    { radio_titel: 'Does somebody receive a Carer Allowance for you or your partner?', radio_name: 'CarerAllowance', sel_name: 'whopaidto', sel_title: "Who is the Carer's Allowance paid to?" },
    { radio_titel: 'Do you or your partner require overnight care?', radio_name: 'needOvernightcare', sel_name: 'whoneedovernightcare', sel_title: 'Who needs overnight care?' },
    { radio_titel: 'Do you or your partner receive invalid carriage or grant payments for a vehicle?', radio_name: 'grantpaymentsforvehicle', sel_name: 'whoreceivespayments for a vehicle', sel_title: 'Who receives invalid carriage or grant payments for a vehicle?' },
]


export const checklistData = [
    { id: 1, description: "A Licence Agreement is in place and key points have been understood", date: "07-12-2024" },
    { id: 2, description: "Ash-Shahada HA has been introduced as the landlord and corresponding contact details have been provided", date: "07-12-2024" },
    { id: 3, description: "The role of TUK as a Managing Agent has been understood", date: "07-12-2024" },
    { id: 4, description: "A copy of the rent settings has been made available to the tenant", date: "07-12-2024" },
    { id: 5, description: "Tenant was offered a choice of accommodation", date: "07-12-2024" },
    { id: 6, description: "Tenant has been formally introduced to other tenants at the property", date: "07-12-2024" },
    { id: 7, description: "Tenant has been introduced to the support worker and has been informed that they have the right to ask for a different support worker if they are not comfortable.", date: "07-12-2024" },
    { id: 8, description: "All facilities at the property have been shown and any operating instructions for appliances have been provided", date: "07-12-2024" },
    { id: 9, description: "Code of Conduct has been understood by the tenant", date: "07-12-2024" },
    { id: 10, description: "Tenant has been made aware of emergency contact details for the Support Provider, Managing Agent and RP", date: "07-12-2024" },
    { id: 11, description: "Complaints procedure has been explained", date: "07-12-2024" },
    { id: 12, description: "Health and safety aspects have been explained, for example fire exits, fire blankets etc", date: "07-12-2024" },
    { id: 13, description: "Tenant is informed that they have a right to ask for property compliance certificates", date: "07-12-2024" },
    { id: 14, description: "Requesting repairs and maintenance work", date: "07-12-2024" },
    { id: 15, description: "Anti-social Behaviour Policy has been explained", date: "07-12-2024" },
    { id: 16, description: "Information on notice board has been shown", date: "07-12-2024" },
    { id: 17, description: "Brief introduction to the local area including relevant amenities", date: "07-12-2024" },
    { id: 18, description: "The support provision and frequency has been explained", date: "07-12-2024" },
    { id: 19, description: "Consequences of failure to engage with support provision have been communicated.", date: "07-12-2024" },
    { id: 20, description: "Safeguarding procedures have been explained", date: "07-12-2024" },
];


export const supportNeedsOptions = [
    { label: "Tenancy failure or losing short term accommodation", name: "tenancyFailure" },
    { label: "Becoming homeless / evicted (within 28 Days)", name: "homelessnessRisk" },
    { label: "Ongoing issues with drug and alcohol", name: "substanceAbuse" },
    { label: "Ability to manage ongoing health problems", name: "healthManagement" },
    { label: "Access to local services Rough Sleeping", name: "roughSleepingServices" },
    { label: "Access to health services", name: "healthServicesAccess" },
    { label: "Improved quality of life", name: "qualityOfLifeImprovement" },
    { label: "Build an alternative support network", name: "supportNetworkBuilding" },
    { label: "Skills to eat healthily", name: "healthyEatingSkills" },
    { label: "Access voluntary services", name: "voluntaryServicesAccess" },
    { label: "Ability to manage personal hygiene", name: "personalHygieneManagement" },
    { label: "Risk of domestic abuse", name: "domesticAbuseRisk" },
    { label: "Increase social and community networks", name: "socialNetworkExpansion" },
    { label: "Frequent presentation to accident and emergency", name: "emergencyServicesUsage" },
    { label: "Unplanned hospital admissions", name: "hospitalAdmissions" },
    { label: "Reduce social isolation", name: "socialIsolationReduction" },
    { label: "Accessing drug and alcohol services", name: "substanceAbuseServices" },
    { label: "Obtaining or maintaining a suitable home", name: "suitableHomeMaintenance" },
    { label: "Getting involved in activities", name: "activityInvolvement" },
    { label: "Increased feelings of being less reliant", name: "relianceReduction" },
    { label: "Gaining and/or maintaining employment and/or education and training", name: "employmentEducationMaintenance" },
    { label: "Risk of long-term worklessness", name: "longTermWorklessnessRisk" },
    { label: "Deteriorating financial position", name: "financialPositionDeterioration" },
    { label: "Developing household skills", name: "householdSkillsDevelopment" },
    { label: "Help to find other help", name: "additionalSupportAccess" },
    { label: "Feeling more involved", name: "increasedInvolvement" },
    { label: "Risk of offending", name: "offendingRisk" },
    { label: "Risk of harm from others", name: "harmFromOthersRisk" },
    { label: "Ongoing health issues", name: "ongoingHealthIssues" },
    { label: "Ability to keep home safe & secure", name: "homeSafetySecurity" },
    { label: "Developing problem-solving skills", name: "problemSolvingSkillsDevelopment" },
    { label: "Ability to manage a healthy lifestyle", name: "healthyLifestyleManagement" },
    { label: "Developing personal competence", name: "personalCompetenceDevelopment" },
    { label: "Developing self-esteem", name: "selfEsteemDevelopment" },
    { label: "Increased feelings of being more independent", name: "increasedIndependence" },
    { label: "Ability to manage health & wellbeing", name: "healthWellbeingManagement" },
    { label: "Ability to manage money better", name: "moneyManagementImprovement" },
    { label: "Developing interpersonal skills", name: "interpersonalSkillsDevelopment" },
    { label: "Increased knowledge", name: "knowledgeIncrease" },
    { label: "Increased confidence", name: "confidenceIncrease" },
];


// const communicationNeeds = [
//     { value: "Large Print", label: "Large Print" },
//     { value: "Braille", label: "Braille" },
//     { value: "Audiotape/CD", label: "Audiotape/CD" },
//     { value: "Translation/ Interpreter", label: "Translation/ Interpreter" },
//     { value: "Pictures & Symbols", label: "Pictures & Symbols" },
//     { value: "Easy Read", label: "Easy Read" },
//     { value: "BSL/Makaton", label: "BSL/Makaton" },
//     { value: "Other_communication_needs", label: "Other" }
// ];