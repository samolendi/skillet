// ============================================================
// questions.js — All 3 sections with their question data
// ============================================================

const SCALE_LABELS = {
  interest:    ['Not at all', 'A little', 'Somewhat', 'Very much', 'Extremely'],
  confidence:  ['Not at all', 'A little', 'Somewhat', 'Very much', 'Extremely'],
  importance:  ['Not important', 'Nice to have', 'Helpful', 'Important', 'Essential'],
  current:     ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
  need:        ['Not needed', 'Nice to have', 'Helpful', 'Important', 'Essential'],
};

// ============================================================
// SECTIONS — top-level structure
// ============================================================
const SECTIONS = [
  {
    id: 'preferences',
    name: 'Design Work Preferences',
    shortName: 'Preferences',
    description: 'Explore which areas of design energise you most and where you feel confident.',
    icon: '✦',
    questionType: 'dual-scale', // interest + confidence
    dimensions: ['interest', 'confidence'],
  },
  {
    id: 'environment',
    name: 'Work Environment Needs',
    shortName: 'Environment',
    description: 'Define what kind of team, culture, and conditions help you do your best work.',
    icon: '◈',
    questionType: 'importance-gap', // importance + current vs ideal
    dimensions: ['importance', 'current'],
  },
  {
    id: 'accommodations',
    name: 'Accommodations',
    shortName: 'Accommodations',
    description: 'Identify the specific adjustments that help you thrive at work.',
    icon: '◇',
    questionType: 'need-toggle', // need level + non-negotiable toggle
    dimensions: ['need'],
  },
];

// ============================================================
// SECTION 1: DESIGN WORK PREFERENCES
// ============================================================
const S1_CATEGORIES = [
  {
    id: 's1_research',
    sectionId: 'preferences',
    name: 'Research',
    description: 'The extent to which different research activities energise you and align with how you want to spend your time.',
    color: '#4ECDC4',
    subcategories: [
      {
        id: 'qual',
        name: 'Qualitative Research',
        subtitle: 'Interviews & Observations',
        statements: [
          { id: 's1_research_qual_1', text: 'I actively seek opportunities to conduct one-on-one user interviews', dimension: 'interest' },
          { id: 's1_research_qual_2', text: 'I feel confident extracting meaningful insights from user conversations', dimension: 'confidence' },
        ]
      },
      {
        id: 'quant',
        name: 'Quantitative Research',
        subtitle: 'Data & Testing',
        statements: [
          { id: 's1_research_quant_1', text: 'I enjoy analysing quantitative data to understand user behaviour', dimension: 'interest' },
          { id: 's1_research_quant_2', text: 'I trust my ability to design and interpret A/B tests', dimension: 'confidence' },
        ]
      },
      {
        id: 'synthesis',
        name: 'Research Synthesis',
        subtitle: 'Patterns & Insights',
        statements: [
          { id: 's1_research_synth_1', text: 'I find satisfaction in organising research findings into actionable insights', dimension: 'interest' },
          { id: 's1_research_synth_2', text: 'I trust my ability to identify patterns across complex research data', dimension: 'confidence' },
        ]
      }
    ]
  },
  {
    id: 's1_interaction',
    sectionId: 'preferences',
    name: 'Interaction Design',
    description: 'The extent to which you\u2019re drawn to shaping how users navigate and interact with interfaces.',
    color: '#A78BFA',
    subcategories: [
      {
        id: 'ia_flow',
        name: 'Foundational IA & Flow',
        subtitle: 'Structure & Navigation',
        statements: [
          { id: 's1_ixd_ia_1', text: 'I get excited about organising complex information architectures', dimension: 'interest' },
          { id: 's1_ixd_ia_2', text: 'I trust my instincts when designing user flows and navigation', dimension: 'confidence' },
        ]
      },
      {
        id: 'wireframe',
        name: 'Wireframing & Prototyping',
        subtitle: 'Sketching & Iteration',
        statements: [
          { id: 's1_ixd_wire_1', text: 'I enjoy the process of sketching and wireframing ideas', dimension: 'interest' },
          { id: 's1_ixd_wire_2', text: 'I feel confident creating interactive prototypes that communicate my vision', dimension: 'confidence' },
        ]
      },
      {
        id: 'systems',
        name: 'Systems Thinking',
        subtitle: 'Components & Scalability',
        statements: [
          { id: 's1_ixd_sys_1', text: 'I\u2019m drawn to designing reusable component systems', dimension: 'interest' },
          { id: 's1_ixd_sys_2', text: 'I\u2019m confident defining how components should behave across different contexts', dimension: 'confidence' },
        ]
      }
    ]
  },
  {
    id: 's1_visual',
    sectionId: 'preferences',
    name: 'Visual Design',
    description: 'The extent to which visual craft and aesthetic decisions energise your work.',
    color: '#F472B6',
    subcategories: [
      {
        id: 'polish',
        name: 'UI Polish & Refinement',
        subtitle: 'Craft & Execution',
        statements: [
          { id: 's1_vis_polish_1', text: 'I get satisfaction from pixel-perfect visual execution', dimension: 'interest' },
          { id: 's1_vis_polish_2', text: 'I trust my eye for visual hierarchy and composition', dimension: 'confidence' },
        ]
      },
      {
        id: 'ds_usage',
        name: 'Design Systems Application',
        subtitle: 'Tokens & Consistency',
        statements: [
          { id: 's1_vis_ds_1', text: 'I enjoy working within and extending existing design systems', dimension: 'interest' },
          { id: 's1_vis_ds_2', text: 'I\u2019m confident applying design tokens and components consistently', dimension: 'confidence' },
        ]
      },
      {
        id: 'creative',
        name: 'Creative Expression',
        subtitle: 'Experimentation & Push',
        statements: [
          { id: 's1_vis_create_1', text: 'I\u2019m energised by opportunities for visual experimentation', dimension: 'interest' },
          { id: 's1_vis_create_2', text: 'I trust my ability to balance creative expression with usability', dimension: 'confidence' },
        ]
      }
    ]
  },
  {
    id: 's1_accessibility',
    sectionId: 'preferences',
    name: 'Accessibility',
    description: 'The extent to which inclusive design practices align with your interests and values.',
    color: '#34D399',
    subcategories: [
      {
        id: 'standards',
        name: 'Standards & Compliance',
        subtitle: 'Guidelines & Advocacy',
        statements: [
          { id: 's1_a11y_std_1', text: 'I actively seek out learning about WCAG guidelines and accessibility standards', dimension: 'interest' },
          { id: 's1_a11y_std_2', text: 'I\u2019m confident auditing designs for accessibility issues independently', dimension: 'confidence' },
        ]
      },
      {
        id: 'inclusive',
        name: 'Inclusive Design Thinking',
        subtitle: 'Diverse & Cognitive Needs',
        statements: [
          { id: 's1_a11y_inc_1', text: 'I\u2019m energised by designing for diverse cognitive and sensory needs', dimension: 'interest' },
          { id: 's1_a11y_inc_2', text: 'I trust my ability to identify accessibility barriers early in the design process', dimension: 'confidence' },
        ]
      }
    ]
  },
  {
    id: 's1_tech',
    sectionId: 'preferences',
    name: 'Tech Skills',
    description: 'The extent to which technical capabilities and emerging tools interest you.',
    color: '#FB923C',
    subcategories: [
      {
        id: 'code',
        name: 'Code & Implementation',
        subtitle: 'HTML/CSS & Beyond',
        statements: [
          { id: 's1_tech_code_1', text: 'I\u2019m excited about understanding how designs are built technically', dimension: 'interest' },
          { id: 's1_tech_code_2', text: 'I\u2019m confident working with code to refine designs in the browser', dimension: 'confidence' },
        ]
      },
      {
        id: 'ai',
        name: 'AI & Automation',
        subtitle: 'Generative AI & Workflows',
        statements: [
          { id: 's1_tech_ai_1', text: 'I\u2019m energised by exploring AI tools in design workflows', dimension: 'interest' },
          { id: 's1_tech_ai_2', text: 'I feel confident experimenting with and evaluating generative AI tools for design', dimension: 'confidence' },
        ]
      },
      {
        id: 'tooling',
        name: 'Design Tooling',
        subtitle: 'Tools & Emerging Tech',
        statements: [
          { id: 's1_tech_tool_1', text: 'I enjoy learning and pushing the limits of design and prototyping tools', dimension: 'interest' },
          { id: 's1_tech_tool_2', text: 'I\u2019m confident enough with my tooling knowledge to teach others', dimension: 'confidence' },
        ]
      }
    ]
  },
  {
    id: 's1_strategy',
    sectionId: 'preferences',
    name: 'Strategy & Conceptual Thinking',
    description: 'The extent to which high-level design strategy and vision work appeals to you.',
    color: '#FACC15',
    subcategories: [
      {
        id: 'framing',
        name: 'Problem Framing',
        subtitle: 'Defining the Right Problem',
        statements: [
          { id: 's1_strat_frame_1', text: 'I\u2019m energised by defining what problem we should actually be solving', dimension: 'interest' },
          { id: 's1_strat_frame_2', text: 'I trust my ability to frame ambiguous problems clearly for a team', dimension: 'confidence' },
        ]
      },
      {
        id: 'vision',
        name: 'Design Vision',
        subtitle: 'Strategy & Business Goals',
        statements: [
          { id: 's1_strat_vision_1', text: 'I enjoy imagining future-state experiences and long-term design directions', dimension: 'interest' },
          { id: 's1_strat_vision_2', text: 'I\u2019m confident articulating design strategy to stakeholders and leadership', dimension: 'confidence' },
        ]
      }
    ]
  }
];

// ============================================================
// SECTION 2: WORK ENVIRONMENT NEEDS
// Statements have: importance (scale) + current (scale for "current vs ideal")
// Some subcategories have a "current vs ideal" statement
// ============================================================
const S2_CATEGORIES = [
  {
    id: 's2_team',
    sectionId: 'environment',
    name: 'Team Dynamics',
    description: 'How you work best with others and what kind of team culture supports your success.',
    color: '#4ECDC4',
    subcategories: [
      {
        id: 'structure',
        name: 'Team Structure',
        subtitle: 'Size, Roles & Safety',
        statements: [
          { id: 's2_team_struct_1', text: 'Working on a small, close-knit team' },
          { id: 's2_team_struct_2', text: 'Having clear roles and responsibilities within the team' },
          { id: 's2_team_struct_3', text: 'Feeling psychologically safe to speak up and make mistakes' },
        ],
        currentStatement: { id: 's2_team_struct_c', text: 'My current team has the right level of psychological safety' },
      },
      {
        id: 'collab_style',
        name: 'Collaboration Style',
        subtitle: 'Balance & Feedback',
        statements: [
          { id: 's2_team_collab_1', text: 'Having a balance between collaborative and independent work' },
          { id: 's2_team_collab_2', text: 'Regular, structured feedback from teammates' },
          { id: 's2_team_collab_3', text: 'Genuine social connection with my teammates (not just work talk)' },
        ],
        currentStatement: { id: 's2_team_collab_c', text: 'I have enough space for independent deep work' },
      },
      {
        id: 'culture',
        name: 'Team Culture',
        subtitle: 'Diversity & Conflict',
        statements: [
          { id: 's2_team_culture_1', text: 'Working with diverse perspectives and backgrounds' },
          { id: 's2_team_culture_2', text: 'Being on a team that handles conflict constructively' },
        ],
      }
    ]
  },
  {
    id: 's2_autonomy',
    sectionId: 'environment',
    name: 'Autonomy & Decision-Making',
    description: 'How much control and ownership you need over your work.',
    color: '#A78BFA',
    subcategories: [
      {
        id: 'approach',
        name: 'Work Approach',
        subtitle: 'Freedom & Direction',
        statements: [
          { id: 's2_auto_approach_1', text: 'Freedom in how I approach problems and solutions' },
          { id: 's2_auto_approach_2', text: 'Control over my schedule and working hours' },
          { id: 's2_auto_approach_3', text: 'Ability to shape the direction of projects I\u2019m on' },
        ],
        currentStatement: { id: 's2_auto_approach_c', text: 'I have enough autonomy in how I work' },
      },
      {
        id: 'trust',
        name: 'Trust & Ownership',
        subtitle: 'Decisions & Accountability',
        statements: [
          { id: 's2_auto_trust_1', text: 'Being trusted to make decisions without constant approval' },
          { id: 's2_auto_trust_2', text: 'Having input on which projects I work on' },
          { id: 's2_auto_trust_3', text: 'Taking ownership over outcomes and results' },
        ],
        currentStatement: { id: 's2_auto_trust_c', text: 'I feel trusted to make good design decisions' },
      },
      {
        id: 'experiment',
        name: 'Experimentation',
        subtitle: 'Risk & Learning',
        statements: [
          { id: 's2_auto_exp_1', text: 'Having space to experiment and try new approaches' },
          { id: 's2_auto_exp_2', text: 'Permission to fail and learn from mistakes' },
        ],
      }
    ]
  },
  {
    id: 's2_communication',
    sectionId: 'environment',
    name: 'Communication Style',
    description: 'How you need information to flow and how you prefer to interact.',
    color: '#F472B6',
    subcategories: [
      {
        id: 'modes',
        name: 'Communication Modes',
        subtitle: 'Written, Async & Meetings',
        statements: [
          { id: 's2_comm_mode_1', text: 'More written communication than verbal' },
          { id: 's2_comm_mode_2', text: 'More asynchronous communication than real-time' },
          { id: 's2_comm_mode_3', text: 'Low meeting frequency and shorter meetings' },
        ],
        currentStatement: { id: 's2_comm_mode_c', text: 'My team\u2019s meeting culture works for me' },
      },
      {
        id: 'clarity',
        name: 'Clarity & Processing',
        subtitle: 'Documentation & Time',
        statements: [
          { id: 's2_comm_clarity_1', text: 'Clear, written documentation of decisions and processes' },
          { id: 's2_comm_clarity_2', text: 'Crystal-clear expectations about what\u2019s needed from me' },
          { id: 's2_comm_clarity_3', text: 'Time to process information before responding' },
        ],
        currentStatement: { id: 's2_comm_clarity_c', text: 'I get the information I need in a format that works for me' },
      },
      {
        id: 'feedback',
        name: 'Feedback Culture',
        subtitle: 'Directness & Tone',
        statements: [
          { id: 's2_comm_fb_1', text: 'Direct, straightforward feedback (not hinting or implying)' },
          { id: 's2_comm_fb_2', text: 'Informal, conversational interactions over formal ones' },
        ],
      }
    ]
  },
  {
    id: 's2_structure',
    sectionId: 'environment',
    name: 'Work Structure',
    description: 'How work is organised and the predictability you need.',
    color: '#34D399',
    subcategories: [
      {
        id: 'predict',
        name: 'Clarity & Predictability',
        subtitle: 'Priorities & Workload',
        statements: [
          { id: 's2_struct_pred_1', text: 'Clear priorities and goals at all times' },
          { id: 's2_struct_pred_2', text: 'Predictable workload rather than constant surprises' },
          { id: 's2_struct_pred_3', text: 'Longer-term projects over short sprints' },
        ],
        currentStatement: { id: 's2_struct_pred_c', text: 'My work priorities are clear and stable' },
      },
      {
        id: 'focus',
        name: 'Focus & Context',
        subtitle: 'Deep Work & Flexibility',
        statements: [
          { id: 's2_struct_focus_1', text: 'Minimal context switching between different projects' },
          { id: 's2_struct_focus_2', text: 'Protected, uninterrupted time for deep focus' },
          { id: 's2_struct_focus_3', text: 'Flexibility in how I structure my day' },
        ],
        currentStatement: { id: 's2_struct_focus_c', text: 'I have enough dedicated focus time' },
      },
      {
        id: 'process',
        name: 'Process',
        subtitle: 'Deadlines & Workflows',
        statements: [
          { id: 's2_struct_proc_1', text: 'Clear deadlines and milestones' },
          { id: 's2_struct_proc_2', text: 'Well-defined processes and workflows (not ad-hoc)' },
        ],
      }
    ]
  },
  {
    id: 's2_leadership',
    sectionId: 'environment',
    name: 'Leadership & Management',
    description: 'What you need from your manager and leadership.',
    color: '#FB923C',
    subcategories: [
      {
        id: 'manager',
        name: 'Manager Relationship',
        subtitle: 'Communication & Trust',
        statements: [
          { id: 's2_lead_mgr_1', text: 'Manager who communicates clearly and directly' },
          { id: 's2_lead_mgr_2', text: 'Regular 1-on-1s with my manager' },
          { id: 's2_lead_mgr_3', text: 'Manager who trusts my expertise and doesn\u2019t micromanage' },
        ],
        currentStatement: { id: 's2_lead_mgr_c', text: 'My manager\u2019s style works well for me' },
      },
      {
        id: 'support',
        name: 'Support & Advocacy',
        subtitle: 'Growth & Conflict',
        statements: [
          { id: 's2_lead_sup_1', text: 'Active career development support from my manager' },
          { id: 's2_lead_sup_2', text: 'Manager who advocates for team and individual needs' },
          { id: 's2_lead_sup_3', text: 'Manager who handles conflicts constructively' },
        ],
        currentStatement: { id: 's2_lead_sup_c', text: 'I feel supported in my professional growth' },
      },
      {
        id: 'recognition',
        name: 'Recognition',
        subtitle: 'Appreciation & Trust',
        statements: [
          { id: 's2_lead_rec_1', text: 'Regular recognition and appreciation for good work' },
          { id: 's2_lead_rec_2', text: 'Manager who trusts my judgment on design decisions' },
        ],
      }
    ]
  },
  {
    id: 's2_growth',
    sectionId: 'environment',
    name: 'Growth & Learning',
    description: 'Opportunities for development and skill-building.',
    color: '#FACC15',
    subcategories: [
      {
        id: 'development',
        name: 'Development Opportunities',
        subtitle: 'Learning & Challenges',
        statements: [
          { id: 's2_grow_dev_1', text: 'Access to new learning opportunities' },
          { id: 's2_grow_dev_2', text: 'Support for skill development (time, budget, resources)' },
          { id: 's2_grow_dev_3', text: 'Exposure to new challenges and problem spaces' },
        ],
        currentStatement: { id: 's2_grow_dev_c', text: 'I have enough opportunities to learn and grow' },
      },
      {
        id: 'career',
        name: 'Career Progression',
        subtitle: 'Path & Mentorship',
        statements: [
          { id: 's2_grow_career_1', text: 'Clear path for career progression' },
          { id: 's2_grow_career_2', text: 'Mentorship or coaching availability' },
          { id: 's2_grow_career_3', text: 'Time allocated specifically for professional development' },
          { id: 's2_grow_career_4', text: 'Stretch projects that push my capabilities' },
        ],
      }
    ]
  },
  {
    id: 's2_physical',
    sectionId: 'environment',
    name: 'Physical/Sensory Environment',
    description: 'Your workspace and sensory needs.',
    color: '#60A5FA',
    subcategories: [
      {
        id: 'location',
        name: 'Location & Setup',
        subtitle: 'Remote, Noise & Lighting',
        statements: [
          { id: 's2_phys_loc_1', text: 'Primarily remote work' },
          { id: 's2_phys_loc_2', text: 'Control over noise levels in my workspace' },
          { id: 's2_phys_loc_3', text: 'Control over lighting in my workspace' },
        ],
        currentStatement: { id: 's2_phys_loc_c', text: 'My work environment supports my sensory needs' },
      },
      {
        id: 'space',
        name: 'Space & Comfort',
        subtitle: 'Temperature, Desk & Commute',
        statements: [
          { id: 's2_phys_space_1', text: 'Control over temperature' },
          { id: 's2_phys_space_2', text: 'Flexibility in desk setup and equipment' },
          { id: 's2_phys_space_3', text: 'Access to private, quiet space when needed' },
          { id: 's2_phys_space_4', text: 'Minimal or manageable commute' },
        ],
        currentStatement: { id: 's2_phys_space_c', text: 'I have the physical workspace I need to do my best work' },
      }
    ]
  },
  {
    id: 's2_boundaries',
    sectionId: 'environment',
    name: 'Work-Life Boundaries',
    description: 'How work respects your time and energy outside work hours.',
    color: '#C084FC',
    subcategories: [
      {
        id: 'time',
        name: 'Time Boundaries',
        subtitle: 'Off-hours & Availability',
        statements: [
          { id: 's2_bound_time_1', text: 'Strict respect for off-hours and personal time' },
          { id: 's2_bound_time_2', text: 'Healthy vacation and time-off culture' },
          { id: 's2_bound_time_3', text: 'No expectation of constant availability' },
        ],
        currentStatement: { id: 's2_bound_time_c', text: 'My team respects my boundaries around work hours' },
      },
      {
        id: 'sustain',
        name: 'Sustainability',
        subtitle: 'Workload & Disconnect',
        statements: [
          { id: 's2_bound_sust_1', text: 'Sustainable workload that doesn\u2019t lead to burnout' },
          { id: 's2_bound_sust_2', text: 'Flexibility for medical appointments and life needs' },
          { id: 's2_bound_sust_3', text: 'Organisation that actively prevents burnout' },
          { id: 's2_bound_sust_4', text: 'Permission to truly disconnect outside work' },
        ],
        currentStatement: { id: 's2_bound_sust_c', text: 'My workload feels sustainable long-term' },
      }
    ]
  },
  {
    id: 's2_org',
    sectionId: 'environment',
    name: 'Organisational Culture',
    description: 'Broader company culture and values.',
    color: '#F87171',
    subcategories: [
      {
        id: 'values',
        name: 'Values & Respect',
        subtitle: 'Design Culture & Alignment',
        statements: [
          { id: 's2_org_val_1', text: 'Strong alignment with company values' },
          { id: 's2_org_val_2', text: 'Organisation with mature design culture' },
          { id: 's2_org_val_3', text: 'Cross-functional respect for design\u2019s role' },
        ],
        currentStatement: { id: 's2_org_val_c', text: 'Design is valued and respected in my organisation' },
      },
      {
        id: 'decisions',
        name: 'Decision-Making & Transparency',
        subtitle: 'Experimentation & Inclusion',
        statements: [
          { id: 's2_org_dec_1', text: 'Culture that encourages experimentation and risk-taking' },
          { id: 's2_org_dec_2', text: 'Fast decision-making without excessive bureaucracy' },
          { id: 's2_org_dec_3', text: 'Low political complexity' },
          { id: 's2_org_dec_4', text: 'Transparency about how decisions are made' },
          { id: 's2_org_dec_5', text: 'Genuine inclusion and belonging for neurodivergent people' },
        ],
        currentStatement: { id: 's2_org_dec_c', text: 'I understand how decisions are made in my organisation' },
      }
    ]
  }
];

// ============================================================
// SECTION 3: ACCOMMODATIONS
// Statements have: need (scale) + optional non-negotiable toggle per subcategory
// ============================================================
const S3_CATEGORIES = [
  {
    id: 's3_communication',
    sectionId: 'accommodations',
    name: 'Communication Accommodations',
    description: 'How you need information structured and delivered.',
    color: '#4ECDC4',
    subcategories: [
      {
        id: 'meeting_support',
        name: 'Meeting Support',
        subtitle: 'Agendas, Processing & Follow-up',
        statements: [
          { id: 's3_comm_meet_1', text: 'Written agendas sent before meetings' },
          { id: 's3_comm_meet_2', text: 'Time to process before being expected to respond' },
          { id: 's3_comm_meet_3', text: 'Written follow-up after verbal discussions or decisions' },
        ],
        nonNegotiableId: 's3_comm_meet_nn',
        nonNegotiableText: 'These communication supports are non-negotiable for me',
      },
      {
        id: 'clarity_prep',
        name: 'Clarity & Preparation',
        subtitle: 'Directness & Advance Notice',
        statements: [
          { id: 's3_comm_clar_1', text: 'Clear, direct communication (not hints or subtext)' },
          { id: 's3_comm_clar_2', text: 'Advance notice before presenting or being put on the spot' },
          { id: 's3_comm_clar_3', text: 'Permission to ask clarifying questions without judgment' },
          { id: 's3_comm_clar_4', text: 'Access to meeting notes or minutes' },
        ],
      },
      {
        id: 'comm_mode',
        name: 'Communication Mode',
        subtitle: 'Async Options',
        statements: [
          { id: 's3_comm_async_1', text: 'Async communication options (not everything needs to be real-time)' },
        ],
      }
    ]
  },
  {
    id: 's3_time',
    sectionId: 'accommodations',
    name: 'Time & Schedule Accommodations',
    description: 'How your time needs to be structured and protected.',
    color: '#A78BFA',
    subcategories: [
      {
        id: 'schedule',
        name: 'Schedule Control',
        subtitle: 'Flexibility & Focus Blocks',
        statements: [
          { id: 's3_time_sched_1', text: 'Flexible start and end times' },
          { id: 's3_time_sched_2', text: 'Control over when meetings are scheduled' },
          { id: 's3_time_sched_3', text: 'Protected blocks of focus time' },
          { id: 's3_time_sched_4', text: 'Buffer time between meetings to reset' },
        ],
        nonNegotiableId: 's3_time_sched_nn',
        nonNegotiableText: 'Schedule flexibility is non-negotiable for me',
      },
      {
        id: 'workload',
        name: 'Workload Management',
        subtitle: 'Meetings, Switching & Recovery',
        statements: [
          { id: 's3_time_work_1', text: 'Reduced overall meeting load' },
          { id: 's3_time_work_2', text: 'Time to prepare for context switches' },
          { id: 's3_time_work_3', text: 'Deadline flexibility during high-stress periods' },
          { id: 's3_time_work_4', text: 'Recovery time built in after intense work periods' },
        ],
      }
    ]
  },
  {
    id: 's3_sensory',
    sectionId: 'accommodations',
    name: 'Sensory Accommodations',
    description: 'Environmental factors that affect your ability to focus and function.',
    color: '#F472B6',
    subcategories: [
      {
        id: 'env_control',
        name: 'Environment Control',
        subtitle: 'Noise, Light & Temperature',
        statements: [
          { id: 's3_sens_env_1', text: 'Control over noise levels (access to quiet space)' },
          { id: 's3_sens_env_2', text: 'Control over lighting' },
          { id: 's3_sens_env_3', text: 'Control over temperature' },
          { id: 's3_sens_env_4', text: 'Ability to minimise visual distractions' },
        ],
        nonNegotiableId: 's3_sens_env_nn',
        nonNegotiableText: 'Sensory control is non-negotiable for me',
      },
      {
        id: 'workspace_flex',
        name: 'Workspace Flexibility',
        subtitle: 'Choice & Remote Options',
        statements: [
          { id: 's3_sens_ws_1', text: 'Choice of where I work (different spaces for different tasks)' },
          { id: 's3_sens_ws_2', text: 'Remote work options' },
          { id: 's3_sens_ws_3', text: 'Full control over my sensory environment' },
        ],
      }
    ]
  },
  {
    id: 's3_workload',
    sectionId: 'accommodations',
    name: 'Workload Accommodations',
    description: 'How work needs to be distributed and managed.',
    color: '#34D399',
    subcategories: [
      {
        id: 'task_mgmt',
        name: 'Task Management',
        subtitle: 'Priorities & Timelines',
        statements: [
          { id: 's3_wl_task_1', text: 'Reduced context switching between projects' },
          { id: 's3_wl_task_2', text: 'One clear priority at a time (when possible)' },
          { id: 's3_wl_task_3', text: 'Clear prioritisation from leadership when juggling multiple things' },
          { id: 's3_wl_task_4', text: 'Realistic timelines that account for actual capacity' },
        ],
        nonNegotiableId: 's3_wl_task_nn',
        nonNegotiableText: 'Workload management supports are non-negotiable for me',
      },
      {
        id: 'boundaries',
        name: 'Boundaries & Monitoring',
        subtitle: 'Pushback & Check-ins',
        statements: [
          { id: 's3_wl_bound_1', text: 'Permission to say no or push back on unrealistic demands' },
          { id: 's3_wl_bound_2', text: 'Regular check-ins to monitor workload before it becomes overwhelming' },
          { id: 's3_wl_bound_3', text: 'Fewer simultaneous projects' },
        ],
      }
    ]
  },
  {
    id: 's3_structure',
    sectionId: 'accommodations',
    name: 'Structure Accommodations',
    description: 'How processes and expectations need to be organised.',
    color: '#FB923C',
    subcategories: [
      {
        id: 'doc',
        name: 'Clarity & Documentation',
        subtitle: 'Processes & Templates',
        statements: [
          { id: 's3_struc_doc_1', text: 'Clear structures and processes for how work gets done' },
          { id: 's3_struc_doc_2', text: 'Written instructions and documentation (not just verbal)' },
          { id: 's3_struc_doc_3', text: 'Predictable patterns in how work flows' },
          { id: 's3_struc_doc_4', text: 'Templates and frameworks to work from' },
        ],
        nonNegotiableId: 's3_struc_doc_nn',
        nonNegotiableText: 'Structure and clarity are non-negotiable for me',
      },
      {
        id: 'support',
        name: 'Support & Stability',
        subtitle: 'PM Support & Check-ins',
        statements: [
          { id: 's3_struc_sup_1', text: 'Project management support (tools, processes, someone tracking)' },
          { id: 's3_struc_sup_2', text: 'Regular check-ins on progress and blockers' },
          { id: 's3_struc_sup_3', text: 'External accountability and structure' },
          { id: 's3_struc_sup_4', text: 'Advance notice when things are changing' },
        ],
      }
    ]
  },
  {
    id: 's3_team',
    sectionId: 'accommodations',
    name: 'Team Dynamics Accommodations',
    description: 'How group interactions need to be adjusted.',
    color: '#FACC15',
    subcategories: [
      {
        id: 'meeting_mods',
        name: 'Meeting Modifications',
        subtitle: 'Size, Purpose & Warning',
        statements: [
          { id: 's3_team_meet_1', text: 'Smaller meeting sizes when possible' },
          { id: 's3_team_meet_2', text: 'Clear purpose stated for every meeting' },
          { id: 's3_team_meet_3', text: 'Optional attendance at social events' },
          { id: 's3_team_meet_4', text: 'Warning before being called on or put on the spot' },
        ],
        nonNegotiableId: 's3_team_meet_nn',
        nonNegotiableText: 'These meeting modifications are non-negotiable for me',
      },
      {
        id: 'social',
        name: 'Social Adjustments',
        subtitle: 'Camera & Performance Pressure',
        statements: [
          { id: 's3_team_soc_1', text: 'Camera-off options for video calls when needed' },
          { id: 's3_team_soc_2', text: 'Reduced pressure to be \u2018on\u2019 or performative in group settings' },
        ],
      }
    ]
  }
];

// ============================================================
// Collect all categories with section references
// ============================================================
const ALL_CATEGORIES = {
  preferences: S1_CATEGORIES,
  environment: S2_CATEGORIES,
  accommodations: S3_CATEGORIES,
};

// ============================================================
// Build flat question lists per section
// ============================================================
function buildSectionQuestions(sectionId, categories) {
  const section = SECTIONS.find(s => s.id === sectionId);
  const questions = [];

  for (const cat of categories) {
    for (const sub of cat.subcategories) {
      for (const stmt of sub.statements) {
        questions.push({
          id: stmt.id,
          type: 'scale', // regular scale statement
          sectionId,
          categoryId: cat.id,
          categoryName: cat.name,
          categoryColor: cat.color,
          subcategoryId: sub.id,
          subcategoryName: sub.name,
          subcategorySubtitle: sub.subtitle,
          statement: stmt.text,
          dimensions: stmt.dimension ? [stmt.dimension] : section.dimensions,
        });
      }
      // Add "current vs ideal" statement for S2 if it exists
      if (sub.currentStatement) {
        questions.push({
          id: sub.currentStatement.id,
          type: 'current',
          sectionId,
          categoryId: cat.id,
          categoryName: cat.name,
          categoryColor: cat.color,
          subcategoryId: sub.id,
          subcategoryName: sub.name,
          subcategorySubtitle: sub.subtitle,
          statement: sub.currentStatement.text,
          dimensions: ['current'],
        });
      }
      // Add non-negotiable toggle for S3 if it exists
      if (sub.nonNegotiableId) {
        questions.push({
          id: sub.nonNegotiableId,
          type: 'toggle',
          sectionId,
          categoryId: cat.id,
          categoryName: cat.name,
          categoryColor: cat.color,
          subcategoryId: sub.id,
          subcategoryName: sub.name,
          subcategorySubtitle: sub.subtitle,
          statement: sub.nonNegotiableText,
          dimensions: ['toggle'],
        });
      }
    }
  }

  return questions;
}

const SECTION_QUESTIONS = {
  preferences: buildSectionQuestions('preferences', S1_CATEGORIES),
  environment: buildSectionQuestions('environment', S2_CATEGORIES),
  accommodations: buildSectionQuestions('accommodations', S3_CATEGORIES),
};

// Legacy compat
const ALL_QUESTIONS = SECTION_QUESTIONS.preferences;
const TOTAL_QUESTIONS = ALL_QUESTIONS.length;
