export const topBarHeight = 64;
export const sideNavWidth = 260;
export const navbarHeight = 60;
export const sidenavCompactWidth = 80;
export const containedLayoutWidth = 1200;

export const staffuser = ['staff', 'company-agent']
export const mainuser = ['company', 'agent']

export const nextDates = [
    { label: 'After 3 days', day: 3, type: "days" },
    { label: 'After 7 days', day: 7, type: "days" },
    { label: 'After 1 month', day: 1, type: "months" },
    { label: 'After 6 month', day: 6, type: "months" },
    { label: 'After 1 year', day: 1, type: "years" }
]


import FlotingLableInput from '@app/CommonComponents/FlotingLableInput';

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
];

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
    { label: "Finance / Gambling / Debt", name: "financeGamblingDebt" },
    { label: "Self-Harm / Injurious behaviour", name: "selfHarm" },
    { label: "Self-neglect / lack of personal care", name: "selfNeglect" },
    { label: "Alcohol misuse", name: "alcoholMisuse" },
    { label: "Drug misuse", name: "drugMisuse" },
    { label: "Offending behaviour", name: "offendingBehaviour" },
    { label: "Arson", name: "arson" },
    { label: "Damage to property", name: "damageToProperty" },
    { label: "Anti-social behaviour", name: "antiSocialBehaviour" },
    { label: "Physical health", name: "physicalHealth" },
    { label: "Mental health", name: "mentalHealth" },
    { label: "Professional boundaries", name: "professionalBoundaries" },
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
    { label: "NI Income Form", name: "niIncomeForm" },
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