import { Project, Category, User, ProjectRequest } from '@/types';

// Demo admin user
export const adminUser: User = {
  id: "admin-1",
  firstName: "Admin",
  lastName: "User",
  email: "admin@docusphere.com",
  isAdmin: true,
  purchasedProjects: []
};

// Demo categories
export const categories: Category[] = [
  { id: "cat-1", name: "Computer Science" },
  { id: "cat-2", name: "Business Administration" },
  { id: "cat-3", name: "Engineering" },
  { id: "cat-4", name: "Medicine" },
  { id: "cat-5", name: "Law" },
  { id: "cat-6", name: "Education" }
];

// Demo projects
export let projects: Project[] = [
  {
    id: "proj-1",
    title: "Database Management Systems",
    description: "A comprehensive study on modern database management systems with practical implementations.",
    price: 5000,
    category: "cat-1",
    featured: true,
    chapters: [
      {
        id: "chap-1-1",
        title: "Introduction to Database Systems",
        content: "This chapter introduces the fundamental concepts of database systems, their evolution, and importance in modern computing.\n\nA database is an organized collection of data, generally stored and accessed electronically from a computer system. Where databases are more complex they are often developed using formal design and modeling techniques.\n\nThe database management system (DBMS) is the software that interacts with end users, applications, and the database itself to capture and analyze the data. The DBMS software additionally encompasses the core facilities provided to administer the database. The sum total of the database, the DBMS and the associated applications can be referred to as a database system. Often the term 'database' is also used loosely to refer to any of the DBMS, the database system or an application associated with the database."
      },
      {
        id: "chap-1-2",
        title: "Data Models and Entity-Relationship Diagrams",
        content: "This is a locked chapter. Purchase to view."
      },
      {
        id: "chap-1-3",
        title: "SQL Fundamentals",
        content: "This is a locked chapter. Purchase to view."
      },
      {
        id: "chap-1-4",
        title: "Database Normalization",
        content: "This is a locked chapter. Purchase to view."
      }
    ],
    createdAt: "2023-05-15T10:30:00Z"
  },
  {
    id: "proj-2",
    title: "Artificial Intelligence and Machine Learning",
    description: "Exploring the cutting-edge technologies in AI and ML with case studies and implementations.",
    price: 7500,
    category: "cat-1",
    featured: true,
    chapters: [
      {
        id: "chap-2-1",
        title: "Introduction to AI",
        content: "This chapter provides an overview of artificial intelligence, its history, and its current applications in various industries.\n\nArtificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.\n\nThe term 'artificial intelligence' had previously been used to describe machines that mimic and display 'human' cognitive skills that are associated with the human mind, such as 'learning' and 'problem-solving'. This definition has since been rejected by major AI researchers who now describe AI in terms of rationality and acting rationally, which does not limit how intelligence can be articulated."
      },
      {
        id: "chap-2-2",
        title: "Machine Learning Fundamentals",
        content: "This is a locked chapter. Purchase to view."
      }
    ],
    createdAt: "2023-06-20T14:15:00Z"
  },
  {
    id: "proj-3",
    title: "Business Strategy in Emerging Markets",
    description: "Analysis of business strategies for companies operating in emerging market economies.",
    price: 6000,
    category: "cat-2",
    featured: false,
    chapters: [
      {
        id: "chap-3-1",
        title: "Characteristics of Emerging Markets",
        content: "This chapter examines the defining characteristics of emerging markets and how they differ from developed economies.\n\nAn emerging market is a market that has some characteristics of a developed market, but does not fully meet its standards. This includes markets that may become developed markets in the future or were in the past.\n\nThe term 'emerging market' is used to describe a nation's economy that is progressing toward becoming more advanced, usually by means of rapid growth and industrialization. These countries experience an expanding role both in the world economy and on the political frontier."
      },
      {
        id: "chap-3-2",
        title: "Market Entry Strategies",
        content: "This is a locked chapter. Purchase to view."
      }
    ],
    createdAt: "2023-07-05T09:45:00Z"
  },
  {
    id: "proj-4",
    title: "Civil Engineering Structures",
    description: "Detailed analysis of civil engineering structures including bridges, dams, and high-rise buildings.",
    price: 8000,
    category: "cat-3",
    featured: false,
    chapters: [
      {
        id: "chap-4-1",
        title: "Fundamentals of Structural Analysis",
        content: "This chapter covers the basic principles of structural analysis in civil engineering.\n\nStructural analysis is the determination of the effects of loads on physical structures and their components. Structures subject to this type of analysis include all that must withstand loads, such as buildings, bridges, aircraft and ships. Structural analysis employs the fields of applied mechanics, materials science and applied mathematics to compute a structure's deformations, internal forces, stresses, support reactions, accelerations, and stability. The results of the analysis are used to verify a structure's fitness for use, often precluding physical tests.\n\nStructural analysis is thus a key part of the engineering design of structures."
      },
      {
        id: "chap-4-2",
        title: "Bridge Design",
        content: "This is a locked chapter. Purchase to view."
      }
    ],
    createdAt: "2023-08-12T16:20:00Z"
  },
  {
    id: "proj-5",
    title: "Medical Ethics and Law",
    description: "Examination of ethical and legal issues in medical practice and healthcare management.",
    price: 5500,
    category: "cat-4",
    featured: true,
    chapters: [
      {
        id: "chap-5-1",
        title: "Principles of Medical Ethics",
        content: "This chapter introduces the fundamental principles of medical ethics that guide healthcare professionals.\n\nMedical ethics is a system of moral principles that apply values and judgments to the practice of medicine. As a scholarly discipline, medical ethics encompasses its practical application in clinical settings as well as work on its history, philosophy, theology, and sociology.\n\nMedical ethics tends to be understood narrowly as an applied professional ethics, whereas bioethics has a more expansive application, touching upon the philosophy of science and issues of biotechnology. The four main moral commitments are respect for autonomy, beneficence, non-maleficence, and justice. Medical ethics is closely related, but not identical to, bioethics."
      },
      {
        id: "chap-5-2",
        title: "Legal Framework in Healthcare",
        content: "This is a locked chapter. Purchase to view."
      }
    ],
    createdAt: "2023-09-03T11:10:00Z"
  }
];

// Demo project requests
export const projectRequests: ProjectRequest[] = [
  {
    id: "req-1",
    userId: "user-1",
    userEmail: "user@example.com",
    projectTitle: "Blockchain Technology Applications",
    paid: true,
    completed: false,
    createdAt: "2023-10-05T13:25:00Z"
  },
  {
    id: "req-2",
    userId: "user-2",
    userEmail: "another@example.com",
    projectTitle: "Sustainable Architecture",
    paid: true,
    completed: true,
    createdAt: "2023-10-02T09:15:00Z"
  }
];

// Demo admin account details
export const adminBankDetails = {
  accountName: "DocuSphere Academic Projects",
  accountNumber: "0123456789",
  bankName: "First Bank Nigeria"
};

// Function to update the projects array
export const setProjects = (newProjects: Project[]) => {
  projects = newProjects;
};
